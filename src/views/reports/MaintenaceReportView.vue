<template>
  <div class="px-5 py-1">
    <div class="d-flex bg-white" style="padding: 10px">
      <div class="">
        <h5>
          <b
            >Asset's Maintenance Report -
            <i class="text-xs">Based On Approved Budgets</i></b
          >
        </h5>
      </div>
    </div>
    <div
      class="d-flex flex-row justify-content-between"
      style="min-height: 730px; height: 730px; overflow-y: scroll"
    >
        <div class="flex-grow-1 report-table-wrapper">
            <EasyDataTable
                :headers="headers"
                :items="items"
                @expand-row="expandLevel1"
                border-cell
                :header-item-class-name="level1HeaderItemClassNameFunction"
                :body-item-class-name="level1HeaderItemClassNameFunction"
                hide-footer
            >
                <template #expand="item">
                    <div
                        v-if="item.level2Data"
                        style="padding: 0px"
                        class="inner-level"
                    >
                        <EasyDataTable
                            :headers="level2Headers"
                            :items="item.level2Data"
                            @expand-row="
                            (level2DataIndex) => expandLevel2(item, level2DataIndex)
                            "
                            border-cell
                            :header-item-class-name="level1HeaderItemClassNameFunction"
                            :body-item-class-name="level1HeaderItemClassNameFunction"
                            hide-footer
                        >
                            <template #expand="maintenance">
                                <div
                                    v-if="maintenance.level3Data"
                                    class="inner-inner-level py-2"
                                    style="padding: 10px"
                                >
                                    <AssetMaintenanceViewer
                                        :is-loading="isLoading"
                                        @on-show-loader="showLoader"
                                        @on-hide-loader="hideLoader"
                                        @on-session-expired="onSessionExpired"
                                        :views="maintenance"
                                    />
                                </div>
                            </template>
                        </EasyDataTable>
                    </div>
                </template>
            </EasyDataTable>
        </div>
    </div>
  </div>
</template>

<script>
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import AssetMaintenanceViewer from "@/components/viewers/AssetMaintenanceViewer.vue";

export default {
    components: {
        AssetMaintenanceViewer
    },
    props: {
        isLoading: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return { 
            headers: [
                {
                    text: "Budget Approval Date",
                    value: "formatedApprovedDate",
                },
                {
                    text: "Assets Qty",
                    value: "formatedTotalAssetsQuantity",
                },
                {
                    text: "Approved Budget Amount",
                    value: "formatedTotalSpentAmount",
                    width: "190",
                },
                {
                    text: "Gained Days",
                    value: "formatedTotalGainedDays",
                    width: "145",
                },
                {
                    text: "Performed Count",
                    value: "formatedTotalPerformedCount",
                    width: "145",
                },
                {
                    text: "Non Performed Count",
                    value: "formatedTotalNonPeformedCount",
                    width: "180",
                },
                {
                    text: "Un Spent Amount",
                    value: "formatedTotalUnSpentAmount",
                    width: "160",
                },
            ],
            items: [],
            maintenances: [],
            basicInfo: [],

            level2Headers: [
                {
                    text: "Budget Approval Date",
                    value: "formatedApprovedDate",
                },
                {
                    text: "Asset Name",
                    value: "formatedAssetName",
                },
                {
                    text: "Approved Budget Amount",
                    value: "formatedTotalSpentAmount",
                    width: "190",
                },
                {
                    text: "Gained Days",
                    value: "formatedTotalGainedDays",
                    width: "145",
                },
                {
                    text: "Scheduled Date",
                    value: "scheduledDate",
                    width: "145",
                },
                {
                    text: "Perfomed Date",
                    value: "performedDate",
                    width: "180",
                },
                {
                    text: "Un Spent Amount",
                    value: "formatedTotalUnSpentAmount",
                    width: "160",
                },
            ]
        }
    },
    methods: {
        ...Vm.loaders,
        ...Vm.fetch,
        loadReport() {
            var vm = this;
            vm.items = [];
            vm.maintenances = [];
            vm.fetch("reportMaintenanceDependencies", function (thisVm, res) {
                thisVm.maintenances = res.maintenances;
                let tableData = thisVm.prepareTableData(
                    res.maintenances
                );
                //render the table
                thisVm.items = tableData;

                // //footer total
                // thisVm.prepareTotalsData(tableData);

                // //chart data
                // thisVm.prepareChartData(tableData);
            });
        },
        getIndexKeyAndOrderValue(dateStr, useFullOrderValue = false) {
            let dateObj = new Date(dateStr);
            let month = dateObj.getMonth() + 1;
            let monthStr = month < 10 ? `0${month}` : `${month}`;
            let year = dateObj.getFullYear();
            let indexKey = `${year}-${monthStr}`;
            let indexOrderingValue = Number(`${year}.${monthStr}`);
            if (useFullOrderValue) {
                let day = dateObj.getDate();
                let dayStr = day < 10 ? `0${day}` : `${day}`;
                indexOrderingValue = Number(`${year}.${monthStr}${dayStr}`);
            }
            return { indexKey: indexKey, indexOrderingValue: indexOrderingValue };
        },
        getNewTableItem(genKey) {
            return {
                formatedApprovedDate: genKey.indexKey,
                formatedTotalAssetsQuantity: "0",
                formatedTotalSpentAmount: "0",
                formatedTotalGainedDays: "0",
                formatedTotalPerformedCount: "0",
                formatedTotalNonPeformedCount: "0",
                formatedTotalUnSpentAmount: "0",
                totalAssetsQuantity: 0,
                totalSpentAmount: 0,
                totalGainedDays: 0,
                totalPerformedCount: 0,
                totalNonPeformedCount: 0,
                totalUnSpentAmount: 0,
                indexOrderingValue: genKey.indexOrderingValue,
            };
        },
        getNewTable2Item(genKey, item) {
            var amountUnspend = 0;
            if(item.performed_maintenance_date.trim().length == 0){
                //Performed Count
                amountUnspend = parseFloat(item.total_amount);
            }
            return {
                ... item,
                formatedApprovedDate: item.budget_approved_date,
                formatedAssetName: `${item.asset.identifier_number} - ${item.asset.name}`,
                formatedTotalSpentAmount: Utils.comma(item.total_amount),
                formatedTotalGainedDays: Utils.comma(item.total_life_time_gained_days),
                performedDate: item.performed_maintenance_date,
                scheduledDate: item.scheduled_maintenance_date,
                formatedTotalUnSpentAmount: Utils.comma(amountUnspend),
                indexOrderingValue: genKey.indexOrderingValue
            };
        },
        prepareTableData(maintenances){
            //nyd
            //get the right values for this
            let startPhpTime = 0;
            let endPhpTime = 100000000000000;

            //level 1
            let tableData = [];
            let indexedByDateMaintenances = {};
            for (let index = 0; index < maintenances.length; index++) {
                let maintenance = maintenances[index];

                //the index
                let genKey = this.getIndexKeyAndOrderValue(
                    maintenance.budget_approved_date
                );
                if (genKey.indexKey == "NaN-NaN") {
                    console.log("nan-maintenance", maintenance);
                }
                if (!Object.hasOwnProperty.call(indexedByDateMaintenances, genKey.indexKey)) {
                    //create this index
                    indexedByDateMaintenances[genKey.indexKey] = this.getNewTableItem(genKey);
                }
                let tableItem = indexedByDateMaintenances[genKey.indexKey];

                //totals
                //Assets Qty
                tableItem.totalAssetsQuantity += 1;
                tableItem.formatedTotalAssetsQuantity = Utils.comma(
                        tableItem.totalAssetsQuantity
                );

                //Gained Days
                tableItem.totalGainedDays += parseFloat(maintenance.total_life_time_gained_days);
                tableItem.formatedTotalGainedDays = Utils.comma(
                        tableItem.totalGainedDays
                );

                
                if(maintenance.performed_maintenance_date.trim().length > 0){
                    //Performed Count
                    tableItem.totalPerformedCount += 1;
                    tableItem.formatedTotalPerformedCount = Utils.comma(
                            tableItem.totalPerformedCount
                    );
                }else{
                    //Non Performed Count
                    tableItem.totalNonPeformedCount += 1;
                    tableItem.formatedTotalNonPeformedCount = Utils.comma(
                            tableItem.totalNonPeformedCount
                    );
                }
            
                //for the sake of consistence lets use the works items,
                //even if we have an embedded for loop for now
                for (
                    let workItemIndex = 0;
                    workItemIndex < maintenance.performed_works.length;
                    workItemIndex++
                ) {
                    const performedWorkItem = maintenance.performed_works[workItemIndex];
                    //Amount Approved
                    tableItem.totalSpentAmount += parseFloat(performedWorkItem.line_total_amount);
                    tableItem.formatedTotalSpentAmount = Utils.comma(
                        tableItem.totalSpentAmount
                    );

                    if(maintenance.performed_maintenance_date.trim().length == 0){
                        //Non Performed Count
                        tableItem.totalUnSpentAmount += parseFloat(performedWorkItem.line_total_amount);;
                        tableItem.formatedTotalUnSpentAmount = Utils.comma(
                                tableItem.totalUnSpentAmount
                        );
                    }
                }

                indexedByDateMaintenances[genKey.indexKey] = tableItem;
            }

            //flatten the data
            for (const indexKey in indexedByDateMaintenances) {
                const tableItem = indexedByDateMaintenances[indexKey];
                tableData.push(tableItem);
            }

            return tableData;
        },
        level1HeaderItemClassNameFunction: function (header, columnNumber) {
            let headerName = "";
            if (typeof header === "object") {
                headerName = header.value;
            } else {
                headerName = header;
            }
            let moneyDisplayColumns = [
                "formatedTotalAssetsQuantity",
                "formatedTotalSpentAmount",
                "formatedTotalGainedDays",
                "formatedTotalPerformedCount",
                "formatedTotalNonPeformedCount",
                "formatedTotalUnSpentAmount"
            ];
            if (moneyDisplayColumns.indexOf(headerName) >= 0) {
                return "text-end";
            }
            let centeredColumns = [
                "scheduledDate",
                "performedDate"
            ];
            if (centeredColumns.indexOf(headerName) >= 0) {
                return "text-center";
            }
            return "";
        },
        expandLevel1: function (index) {
            const expandedItem = this.items[index];
            if (!expandedItem.level2Data) {
                expandedItem.expandLoading = true;
                let vm = this;
                setTimeout(() => {
                vm.loadLevel2Data(
                    expandedItem,
                    this.maintenances,
                )
                    .then((level2Data) => {
                        expandedItem.level2Data = level2Data;
                        expandedItem.expandLoading = false;
                    })
                    .catch((errors) => {
                        console.log("Expanding level2 error", errors);
                        expandedItem.expandLoading = false;
                    });
                }, 1500);
            }
        },
        loadLevel2Data: function (expandedItem,maintenances) {
            let vm = this;
            var promise = new Promise(function (resolve, reject) {
                try {
                    let targetIndexKey = expandedItem.formatedApprovedDate;
                    let tableData = vm.prepareTable2Data(
                        targetIndexKey,
                        maintenances
                    );
                    resolve(tableData);
                } catch (error) {
                    reject(error);
                }
            });
            return promise;
        },
        prepareTable2Data(filterKey, maintenances) {
            //level 2
            let tableData = [];

            //we pick only items that have this key
            for (let index = 0; index < maintenances.length; index++) {
                let maintenance = maintenances[index];
                
                //the index
                let genKey = this.getIndexKeyAndOrderValue(
                    maintenance.budget_approved_date,
                    true
                );
                if (typeof filterKey != "undefined" && filterKey != genKey.indexKey) {
                    //skip
                    continue;
                }  

                let tableItem = this.getNewTable2Item(genKey, maintenance);

                tableData.push(tableItem);
            }

            //thats why we use b - a
            tableData.sort((a, b) => {
                return b.indexOrderingValue - a.indexOrderingValue;
            });
            return tableData;
        },
        expandLevel2: function (maintenaceDateItem, level2Dataindex) {
            //get the orders of this date
            //get the item
            for (var index = 0; index < this.items.length; index++) {
                let item = this.items[index];
                if (
                    parseInt(item.formatedApprovedDate) ==
                    parseInt(maintenaceDateItem.formatedApprovedDate)
                ) {
                    if (item.level2Data) {
                        //get the maintenance item
                        const expandedMaintenanceItem = item.level2Data[level2Dataindex];
                        if (!expandedMaintenanceItem.level3Data) {
                            expandedMaintenanceItem.expandLoading = true;
                            let vm = this;
                            setTimeout(() => {
                                expandedMaintenanceItem.level3Data = true;
                                expandedMaintenanceItem.expandLoading = false;
                            }, 1500);
                        }
                    } else {
                        console.log("Expanded maintenaceItem has no level2data");
                    }
                    return false;
                }
            }
        }
    },
    mounted() {
        this.loadReport();
    },
}
</script>
    