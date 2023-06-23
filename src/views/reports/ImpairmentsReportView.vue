<template>
  <div class="px-5 py-1">
    <div class="d-flex bg-white" style="padding: 10px">
      <div class="">
        <h5>
          <b> Asset's Impairments Report </b>
        </h5>
      </div>
    </div>
    <div
      class="d-flex flex-column justify-content-between"
      style="min-height: 730px; height: 730px; overflow-y: scroll"
    >
      <div class="d-flex " style="margin-bottom:20px; margin-top:20px; padding:5px"> 
        <div v-if="renderTypeChart" style="width: 400px; box-shadow: 0px 0px 5px 3px #e9e3e3; margin: 5px;" >
          <apexchart
            type="bar"
            height="250"
            :options="typesChartOptions"
            :series="typesChartSeries"
          >
          </apexchart>
        </div>
        <div v-if="renderPieChart" class="d-flex justify-content-center" style="width: 400px; box-shadow: 0px 0px 5px 3px #e9e3e3; margin: 5px; ">
          <apexchart
            type="pie"
            width="300"
            :options="pieChartOptions"
            :series="pieChartSeries"
          ></apexchart>
        </div>
        <div v-if="renderPieChart" class="d-flex justify-content-center flex-grow-1"  style="box-shadow: 0px 0px 5px 3px #e9e3e3; margin: 5px;">
            <div class="w-100">
                <KeyValueList :items="basicInfo" />
            </div>
        </div>
      </div>
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
                <template #expand="impairment">
                  <div
                    v-if="impairment.level3Data"
                    style="padding: 0px"
                    class="inner-level"
                  >
                    <EasyDataTable
                      :headers="level3Headers"
                      :items="impairment.level3Data"
                      border-cell
                      :header-item-class-name="
                        level1HeaderItemClassNameFunction
                      "
                      :body-item-class-name="level1HeaderItemClassNameFunction"
                      hide-footer
                    >
                    </EasyDataTable>
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
import VueApexCharts from "vue3-apexcharts";
import KeyValueList from "@/components/lists/KeyValueList.vue";

export default {
  components: {
    VueApexCharts,
    KeyValueList
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
          text: "Date - Month",
          value: "formatedOccuredDate",
        },
        {
          text: "Cases",
          value: "formatedTotalReportedCount",
          width: "90",
        },
        {
          text: "Approved",
          value: "formatedTotalApprovedCount",
          width: "90",
        },
        {
          text: "Damaged",
          value: "formatedTotalDamaged",
          width: "90",
        },
        {
          text: "Destroyed",
          value: "formatedTotalDestroyed",
          width: "90",
        },
        {
          text: "Lost/Stolen",
          value: "formatedTotalLost",
          width: "90",
        },
        {
          text: "Regulations",
          value: "formatedTotalRegulations",
          width: "90",
        },
        {
          text: "Others",
          value: "formatedTotalOthersCount",
          width: "90",
        },
        {
          text: "Total Value",
          value: "formatedTotalValueAmount",
          width: "130",
        },
      ],
      items: [],
      impairments: [],
      basicInfo: [],

      level2Headers: [
        {
          text: "Asset Category",
          value: "formatedAssetCategoryName",
        },
        {
          text: "Cases",
          value: "formatedTotalReportedCount",
          width: "90",
        },
        {
          text: "Approved",
          value: "formatedTotalApprovedCount",
          width: "90",
        },
        {
          text: "Damaged",
          value: "formatedTotalDamaged",
          width: "90",
        },
        {
          text: "Destroyed",
          value: "formatedTotalDestroyed",
          width: "90",
        },
        {
          text: "Lost/Stolen",
          value: "formatedTotalLost",
          width: "90",
        },
        {
          text: "Regulations",
          value: "formatedTotalRegulations",
          width: "90",
        },
        {
          text: "Others",
          value: "formatedTotalOthersCount",
          width: "90",
        },
        {
          text: "Total Value",
          value: "formatedTotalValueAmount",
          width: "130",
        },
      ],
      level3Headers: [
        {
          text: "Date",
          value: "formatedOccuredDate",
        },
        {
          text: "Identity",
          value: "assetIdentity",
        },
        {
          text: "Asset Name",
          value: "assetName",
        },
        {
          text: "Type",
          value: "type",
          width: "190",
        },
        {
          text: "Status",
          value: "status",
          width: "90",
        },
        {
          text: "Approved Date",
          value: "formatedApprovedDate",
          width: "90",
        },
        {
          text: "Condition",
          value: "condition",
          width: "90",
        },
        {
          text: "Custodian",
          value: "custodian",
          width: "180",
        },
        {
          text: "Impairment Value",
          value: "formatedImpairmnetValueAmount",
          width: "130",
        },
      ],

      renderTypeChart: false,
      typesChartSeries: [],
      typesChartOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [],
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              let currency = JSON.parse(
                localStorage.getItem("config")
              ).currency;
              return `${Utils.comma(val)} ${currency}`;
            },
          },
        },
        title: {
          text: "Impairments By Types",
          align: "center",
        },
      },

      renderPieChart: false,
      pieChartOptions: {
        chart: {
          width: 380,
          type: "pie",
        },
        labels: [],
        // responsive: [
        //   {
        //     breakpoint: 480,
        //     options: {
        //       chart: {
        //         width: 200,
        //       },
        //       legend: {
        //         position: "bottom",
        //       },
        //     },
        //   },
        // ],
        legend: {
          show: false,
          position: "bottom",
          horizontalAlign: "left",
          height: 50,
          floating: true,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              let currency = JSON.parse(
                localStorage.getItem("config")
              ).currency;
              return `${Utils.comma(val)} ${currency}`;
            },
          },
        },
        title: {
          text: "Impairments By Asset Categories",
          align: "center",
        },
      },
      pieChartSeries: [],

      basicInfo: []
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadReport() {
      var vm = this;
      vm.items = [];
      vm.impairments = [];
      vm.typesChartSeries = [];
      vm.typesChartOptions.xaxis.categories = [];
      vm.renderTypeChart = false;
      vm.fetch("reportImpairmentsDependencies", function (thisVm, res) {
        thisVm.impairments = res.impairments;
        let tableData = thisVm.prepareTableData(res.impairments);
        //render the table
        thisVm.items = tableData;

        // chart data
        thisVm.prepareTypeChartData(res.impairments);
        thisVm.preparePieChartData(res.impairments);

        let totalSpend = 0;
        let totalDamagedAmount = 0;
        let totalDestroyedAmount = 0;
        let totalLostAmount = 0;
        let totalOtherAmount = 0;
        for (let index = 0; index < tableData.length; index++) {
            const row = tableData[index];
            totalSpend += row.totalValueAmount;
            totalDamagedAmount += row.totalDamagedAmount;
            totalDestroyedAmount += row.totalDestroyedAmount;
            totalLostAmount += row.totalLostAmount;
            totalOtherAmount += row.totalOtherAmount;
        }

        //footer totals
        thisVm.basicInfo = [
            {
                key: "<b>TOTALS<b>",
                value: "",
            },
            {
                key: "<br/>",
                value: "",
            },
            {
                key: "Total Spent",
                value: Utils.comma(totalSpend),
            },
            {
                key: "<br/><br/>",
                value: "",
            },
            {
                key: "Value Due Damages",
                value: Utils.comma(totalDamagedAmount),
            },
            {
                key: "Value Due Destruction",
                value: Utils.comma(totalDestroyedAmount),
            },
            {
                key: "Value Due Loss/Theft",
                value: Utils.comma(totalLostAmount),
            },
            {
                key: "Value Due Other",
                value: Utils.comma(totalOtherAmount),
            },
        ];
      });
    },
    prepareTypeChartData(impairments) {
      try {
        let damagedSeries = {
          name: "Damaged",
          data: [],
        };
        let destroyedSeries = {
          name: "Destroyed",
          data: [],
        };
        let lostSeries = {
          name: "Lost",
          data: [],
        };
        let otherSeries = {
          name: "Other",
          data: [],
        };

        let indexedByDate = {};
        for (let index = 0; index < impairments.length; index++) {
          let impairment = impairments[index];
          let genKey = this.getIndexKeyAndOrderValue(impairment.occured_date);
          if (genKey.indexKey == "NaN-NaN") {
            console.log("nan-impairments types chart", impairment);
          }
          if (!Object.hasOwnProperty.call(indexedByDate, genKey.indexKey)) {
            //create this index
            indexedByDate[genKey.indexKey] = {
              key: genKey.indexKey,
              damaged: 0,
              destroyed: 0,
              lost: 0,
              other: 0,
              indexOrderingValue: genKey.indexOrderingValue,
            };
          }
          let chatColumnItem = indexedByDate[genKey.indexKey];

          //Approved
          if (parseInt(impairment.approved_date_time) > 0) {
            let value = parseFloat(impairment.impairment_value_amount);
            //Damaged
            if (impairment.type.toUpperCase() == "PHYSICAL DAMAGE") {
              chatColumnItem.damaged += value;
            }
            //Destroyed
            if (impairment.type.toUpperCase() == "DAMAGE BEYOND REPAIR") {
              chatColumnItem.destroyed += value;
            }
            //Lost/Stolen
            if (impairment.type.toUpperCase() == "LOSS OR THEFT") {
              chatColumnItem.lost += value;
            }
            //Others and Regulations
            if (impairment.type.toUpperCase() == "OTHERS") {
              chatColumnItem.other += value;
            }
            if (impairment.type.toUpperCase() == "CHANGE IN REGULATIONS") {
              chatColumnItem.other += value;
            }
          }

          indexedByDate[genKey.indexKey] = chatColumnItem;
        }

        //flatten the data
        let chatData = [];
        for (const indexKey in indexedByDate) {
          const tableItem = indexedByDate[indexKey];
          chatData.push(tableItem);
        }

        //order by
        chatData.sort((a, b) => {
          return a.indexOrderingValue - b.indexOrderingValue;
        });

        //get the coloumns
        let xAxisCategories = [];
        for (let index = 0; index < chatData.length; index++) {
          const chatColumnGroup = chatData[index];
          xAxisCategories.push(chatColumnGroup.key);
          damagedSeries.data.push(chatColumnGroup.damaged);
          destroyedSeries.data.push(chatColumnGroup.destroyed);
          lostSeries.data.push(chatColumnGroup.lost);
          otherSeries.data.push(chatColumnGroup.other);
        }

        this.typesChartSeries = [
          damagedSeries,
          destroyedSeries,
          lostSeries,
          otherSeries,
        ];
        this.typesChartOptions.xaxis.categories = xAxisCategories;
        this.renderTypeChart = true;
      } catch (error) {
        console.log("iiisss", error);
      }
    },
    preparePieChartData(impairments) {
      try {

        let indexedCatData = {};
        for (let index = 0; index < impairments.length; index++) {
            const impairment = impairments[index];

            let catName = impairment.asset.category.name;
            if (!Object.hasOwnProperty.call(indexedCatData, catName)) {
                indexedCatData[catName] = {
                    key: catName,
                    value: 0
                };
            }
            let item = indexedCatData[catName];
            //Approved
            if (parseInt(impairment.approved_date_time) > 0) {
                let value = parseFloat(impairment.impairment_value_amount);
                item.value = value;
            }
            indexedCatData[catName] = item;
        }


        let pieChartSeriesData = [];
        let pieChartLabels = [];
        for (const categoryId in indexedCatData) {
            let pieItem = indexedCatData[categoryId];
            pieChartSeriesData.push(pieItem.value);
            pieChartLabels.push(pieItem.key);
        }
        this.pieChartSeries = pieChartSeriesData;
        this.pieChartOptions.labels = pieChartLabels;
        this.renderPieChart = true;
      } catch (error) {
        console.log("this one", error);
      }
    },
    expandLevel1: function (index) {
      const expandedItem = this.items[index];
      if (!expandedItem.level2Data) {
        expandedItem.expandLoading = true;
        let vm = this;
        setTimeout(() => {
          vm.loadLevel2Data(expandedItem, this.impairments)
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
    level1HeaderItemClassNameFunction: function (header, columnNumber) {
      let headerName = "";
      if (typeof header === "object") {
        headerName = header.value;
      } else {
        headerName = header;
      }
      let moneyDisplayColumns = [
        "formatedTotalReportedCount",
        "formatedTotalApprovedCount",
        "formatedTotalDamaged",
        "formatedTotalDestroyed",
        "formatedTotalLost",
        "formatedTotalRegulations",
        "formatedTotalLostCount",
        "formatedTotalValueAmount",
        "formatedImpairmnetValueAmount",
        "formatedTotalOthersCount",
      ];
      if (moneyDisplayColumns.indexOf(headerName) >= 0) {
        return "text-end";
      }
      let centeredColumns = ["formatedOccuredDate", "formatedApprovedDate"];
      if (centeredColumns.indexOf(headerName) >= 0) {
        return "text-center";
      }
      return "";
    },
    prepareTableData(impairments) {
      //nyd
      //get the right values for this
      let startPhpTime = 0;
      let endPhpTime = 100000000000000;

      //level 1
      let tableData = [];
      let indexedByDate = {};
      for (let index = 0; index < impairments.length; index++) {
        let impairment = impairments[index];

        //the index
        let genKey = this.getIndexKeyAndOrderValue(impairment.occured_date);
        if (genKey.indexKey == "NaN-NaN") {
          console.log("nan-impairments", impairment);
        }
        if (!Object.hasOwnProperty.call(indexedByDate, genKey.indexKey)) {
          //create this index
          indexedByDate[genKey.indexKey] = this.getNewTableItem(genKey);
        }
        let tableItem = indexedByDate[genKey.indexKey];

        //Cases Qty
        tableItem.totalReportedCount += 1;
        tableItem.formatedTotalReportedCount = Utils.comma(
          tableItem.totalReportedCount
        );

        //Approved
        if (parseInt(impairment.approved_date_time) > 0) {
            let value = parseFloat(
                impairment.impairment_value_amount
            );

          tableItem.totalApprovedCount += 1;
          tableItem.formatedTotalApprovedCount = Utils.comma(
            tableItem.totalApprovedCount
          );

          //Damaged
          if (impairment.type.toUpperCase() == "PHYSICAL DAMAGE") {
            tableItem.totalDamaged += 1;
            tableItem.formatedTotalDamaged = Utils.comma(
              tableItem.totalDamaged
            );
            tableItem.totalDamagedAmount += value;
          }

          //Destroyed
          if (impairment.type.toUpperCase() == "DAMAGE BEYOND REPAIR") {
            tableItem.totalDestroyed += 1;
            tableItem.formatedTotalDestroyed = Utils.comma(
              tableItem.totalDestroyed
            );
            tableItem.totalDestroyedAmount += value;
          }

          //Lost/Stolen
          if (impairment.type.toUpperCase() == "LOSS OR THEFT") {
            tableItem.totalLost += 1;
            tableItem.formatedTotalLost = Utils.comma(tableItem.totalLost);
            tableItem.totalLostAmount += value;
          }

          //Regulations
          if (impairment.type.toUpperCase() == "CHANGE IN REGULATIONS") {
            tableItem.totalRegulations += 1;
            tableItem.formatedTotalRegulations = Utils.comma(
              tableItem.totalRegulations
            );
            tableItem.totalOtherAmount += value;
          }

          //Others
          if (impairment.type.toUpperCase() == "OTHERS") {
            tableItem.totalOthersCount += 1;
            tableItem.formatedTotalOthersCount = Utils.comma(
              tableItem.totalOthersCount
            );
            tableItem.totalOtherAmount += value;
          }

          //Total Value
          tableItem.totalValueAmount += value;
          tableItem.formatedTotalValueAmount = Utils.comma(value);
        }

        indexedByDate[genKey.indexKey] = tableItem;
      }

      //flatten the data
      for (const indexKey in indexedByDate) {
        const tableItem = indexedByDate[indexKey];
        tableData.push(tableItem);
      }

      return tableData;
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
        formatedOccuredDate: genKey.indexKey,
        formatedTotalReportedCount: "0",
        formatedTotalApprovedCount: "0",
        formatedTotalDamaged: "0",
        formatedTotalDestroyed: "0",
        formatedTotalLost: "0",
        formatedTotalRegulations: "0",
        formatedTotalOthersCount: "0",
        formatedTotalValueAmount: "0",

        totalReportedCount: 0,
        totalApprovedCount: 0,
        totalDamaged: 0,
        totalDestroyed: 0,
        totalLost: 0,
        totalRegulations: 0,
        totalOthersCount: 0,
        totalValueAmount: 0,
        indexOrderingValue: genKey.indexOrderingValue,

        totalDamagedAmount: 0,
        totalDestroyedAmount: 0,
        totalLostAmount: 0,
        totalOtherAmount: 0,
      };
    },
    loadLevel2Data: function (expandedItem, impairments) {
      let vm = this;
      var promise = new Promise(function (resolve, reject) {
        try {
          let targetIndexKey = expandedItem.formatedOccuredDate;
          let tableData = vm.prepareTable2Data(targetIndexKey, impairments);
          resolve(tableData);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    },
    prepareTable2Data(filterKey, impairments) {
      //level 2
      let tableData = [];

      let indexedCat = {};
      //we pick only items that have this key
      for (let index = 0; index < impairments.length; index++) {
        let impairment = impairments[index];

        //the index
        let genKey = this.getIndexKeyAndOrderValue(impairment.occured_date);
        if (typeof filterKey != "undefined" && filterKey != genKey.indexKey) {
          //skip
          continue;
        }

        let tableItem = this.getNewTable2Item(genKey, impairment);
        //var the category
        var catKey = impairment.asset.category.name;
        if (!Object.hasOwnProperty.call(indexedCat, catKey)) {
          //create this index
          indexedCat[catKey] = tableItem;
        }

        let catRowItem = indexedCat[catKey];

        //Cases Qty
        catRowItem.totalReportedCount += 1;
        catRowItem.formatedTotalReportedCount = Utils.comma(
          catRowItem.totalReportedCount
        );

        //Approved
        if (parseInt(impairment.approved_date_time) > 0) {
          catRowItem.totalApprovedCount += 1;
          catRowItem.formatedTotalApprovedCount = Utils.comma(
            catRowItem.totalApprovedCount
          );

          //Damaged
          if (impairment.type.toUpperCase() == "PHYSICAL DAMAGE") {
            catRowItem.totalDamaged += 1;
            catRowItem.formatedTotalDamaged = Utils.comma(
              catRowItem.totalDamaged
            );
          }

          //Destroyed
          if (impairment.type.toUpperCase() == "DAMAGE BEYOND REPAIR") {
            catRowItem.totalDestroyed += 1;
            catRowItem.formatedTotalDestroyed = Utils.comma(
              catRowItem.totalDestroyed
            );
          }

          //Lost/Stolen
          if (impairment.type.toUpperCase() == "LOSS OR THEFT") {
            catRowItem.totalLost += 1;
            catRowItem.formatedTotalLost = Utils.comma(catRowItem.totalLost);
          }

          //Regulations
          if (impairment.type.toUpperCase() == "CHANGE IN REGULATIONS") {
            catRowItem.totalRegulations += 1;
            catRowItem.formatedTotalRegulations = Utils.comma(
              catRowItem.totalRegulations
            );
          }

          //Others
          if (impairment.type.toUpperCase() == "OTHERS") {
            catRowItem.totalOthersCount += 1;
            catRowItem.formatedTotalOthersCount = Utils.comma(
              catRowItem.totalOthersCount
            );
          }

          //Total Value
          catRowItem.totalValueAmount += parseFloat(
            impairment.impairment_value_amount
          );
          catRowItem.formatedTotalValueAmount = Utils.comma(
            catRowItem.totalValueAmount
          );
        }

        indexedCat[catKey] = catRowItem;
      }

      //flatten the data
      for (const indexKey in indexedCat) {
        const tableItem = indexedCat[indexKey];
        tableData.push(tableItem);
      }

      //thats why we use b - a
      tableData.sort((a, b) => {
        return b.indexOrderingValue - a.indexOrderingValue;
      });
      return tableData;
    },
    getNewTable2Item(genKey, impairment) {
      return {
        formatedOccuredDate: genKey.indexKey,
        formatedAssetCategoryName: impairment.asset.category.name,
        formatedTotalReportedCount: "0",
        formatedTotalApprovedCount: "0",
        formatedTotalDamaged: "0",
        formatedTotalDestroyed: "0",
        formatedTotalLost: "0",
        formatedTotalRegulations: "0",
        formatedTotalOthersCount: "0",
        formatedTotalValueAmount: "0",
        totalReportedCount: 0,
        totalApprovedCount: 0,
        totalDamaged: 0,
        totalDestroyed: 0,
        totalLost: 0,
        totalRegulations: 0,
        totalOthersCount: 0,
        totalValueAmount: 0,
        indexOrderingValue: genKey.indexOrderingValue,
      };
    },
    expandLevel2: function (impairmentDateItem, level2Dataindex) {
      //get the item
      for (var index = 0; index < this.items.length; index++) {
        let item = this.items[index];
        if (
          parseInt(item.formatedOccuredDate) ==
          parseInt(impairmentDateItem.formatedOccuredDate)
        ) {
          if (item.level2Data) {
            //get the impairment item
            const expandedCatgeoryItem = item.level2Data[level2Dataindex];
            if (!expandedCatgeoryItem.level3Data) {
              expandedCatgeoryItem.expandLoading = true;
              let vm = this;
              setTimeout(() => {
                vm.loadLevel3Data(expandedCatgeoryItem, this.impairments)
                  .then((level3Data) => {
                    expandedCatgeoryItem.level3Data = level3Data;
                    expandedCatgeoryItem.expandLoading = false;
                  })
                  .catch((errors) => {
                    console.log("Expanding level3 error", errors);
                    expandedCatgeoryItem.expandLoading = false;
                  });
                expandedCatgeoryItem.level3Data = true;
                expandedCatgeoryItem.expandLoading = false;
              }, 1500);
            }
          } else {
            console.log("Expanded impairment Item has no level2data");
          }
          return false;
        }
      }
    },
    loadLevel3Data: function (expandedCatgeoryItem, impairments) {
      let vm = this;
      var promise = new Promise(function (resolve, reject) {
        try {
          let targetIndexKey = expandedCatgeoryItem.formatedOccuredDate;
          let catName = expandedCatgeoryItem.formatedAssetCategoryName;
          let tableData = vm.prepareTable3Data(
            targetIndexKey,
            catName,
            impairments
          );
          resolve(tableData);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    },
    prepareTable3Data(filterKey, categoryName, impairments) {
      //level 2
      let tableData = [];

      //we pick only items that have this key
      for (let index = 0; index < impairments.length; index++) {
        let impairment = impairments[index];

        //the index
        let genKey = this.getIndexKeyAndOrderValue(impairment.occured_date);
        if (typeof filterKey != "undefined" && filterKey != genKey.indexKey) {
          //skip
          continue;
        }
        if (impairment.asset.category.name != categoryName) {
          //skip
          continue;
        }

        let tableItem = this.getNewTable3Item(genKey, impairment);

        tableData.push(tableItem);
      }

      //thats why we use b - a
      tableData.sort((a, b) => {
        return b.indexOrderingValue - a.indexOrderingValue;
      });
      return tableData;
    },
    getNewTable3Item(genKey, impairment) {
      return {
        formatedOccuredDate: impairment.occured_date,
        assetIdentity: impairment.asset.identifier_number,
        assetName: impairment.asset.name,
        type: impairment.type,
        condition: impairment.asset_condition,
        custodian: impairment.custodian.name,
        status: impairment.status,
        formatedApprovedDate: impairment.approved_date,
        formatedImpairmnetValueAmount: Utils.comma(
          impairment.impairment_value_amount
        ),
        indexOrderingValue: genKey.indexOrderingValue,
      };
    },
  },
  mounted() {
    this.loadReport();
  },
};
</script>