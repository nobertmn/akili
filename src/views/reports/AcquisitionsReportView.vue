<template>
  <div class="px-5 py-1">
    <div class="d-flex bg-white" style="padding: 10px">
      <div class="">
        <h5>
          <b
            >Asset's Acquisition Report -
            <i class="text-xs">From Approved Orders</i></b
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
                <template #expand="acquisition">
                  <div
                    v-if="acquisition.level3Data"
                    class="inner-inner-level"
                    style="padding: 10px"
                  >
                    <AcquisitionReportInnerViewer :item="acquisition" />
                  </div>
                </template>
              </EasyDataTable>
            </div>
          </template>
        </EasyDataTable>
      </div>
      <div
        style="min-width: 350px; text-align: right"
        class="position-relative"
      >
        <div
          class="d-flex flex-column justify-content-end position-fixed"
          style="min-width: 350px;"
        >
          <div class="w-100">
            <KeyValueList :items="basicInfo" />
          </div>
          <div v-if="renderChart">
            <apexchart
              type="bar"
              height="300"
              :options="chartOptions"
              :series="chartSeries"
            >
            </apexchart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import AcquisitionReportInnerViewer from "@/components/viewers/AcquisitionReportInnerViewer.vue";
import KeyValueList from "@/components/lists/KeyValueList.vue";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    AcquisitionReportInnerViewer,
    KeyValueList,
    VueApexCharts,
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
          text: "Date",
          value: "formatedDate",
        },
        {
          text: "Amount",
          value: "formatedTotalOrderAmount",
          width: "100",
        },
        {
          text: "Ordered",
          value: "formatedTotalOrderQuantity",
          width: "80",
        },
        {
          text: "Received",
          value: "formatedTotalReceivedQuantity",
          width: "80",
        },
        {
          text: "Recorded",
          value: "formatedTotalRecordedQuantity",
          width: "80",
        },
        {
          text: "Pending",
          value: "formatedTotalPendingToRecordQuantity",
          width: "80",
        },
        {
          text: "Rejected",
          value: "formatedTotalDeficitQuantity",
          width: "80",
        },
        {
          text: "Resolved",
          value: "formatedTotalResolvedQuantity",
          width: "80",
        },
      ],
      items: [],
      acquisitionOrders: [],
      orderRecordedAssets: [],
      level2Data: [],
      level2Headers: [
        {
          text: "Date - Order Number ",
          value: "orderNameAndDate",
        },
        {
          text: "Amount",
          value: "formatedTotalOrderAmount",
          width: "100",
        },
        {
          text: "Order",
          value: "formatedTotalOrderQuantity",
          width: "80",
        },
        {
          text: "Received",
          value: "formatedTotalReceivedQuantity",
          width: "80",
        },
        {
          text: "Recorded",
          value: "formatedTotalRecordedQuantity",
          width: "80",
        },
        {
          text: "Pending",
          value: "formatedTotalPendingToRecordQuantity",
          width: "80",
        },
        {
          text: "Rejected",
          value: "formatedTotalDeficitQuantity",
          width: "80",
        },
        {
          text: "Resolved",
          value: "formatedTotalResolvedQuantity",
          width: "80",
        },
      ],
      basicInfo: [],

      renderChart: false,
      chartSeries: [],
      chartOptions: {
        chart: {
          type: "bar",
          height: 300,
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
        yaxis: {
        //   title: {
        //     text: "$ (thousands)",
        //   },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              let currency = JSON.parse(localStorage.getItem("config")).currency;
              return `${Utils.comma(val)} ${currency}`;
            },
          },
        },
        title: {
          text: "Monthly Oder's Amount Distribution",
          align: "center",
        },
      },
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadReport() {
      var vm = this;
      vm.chartSeries = [];
      vm.chartOptions.xaxis.categories = [];
      vm.renderChart = false;
      vm.fetch("reportAssetAcquisitionDependencies", function (thisVm, res) {
        thisVm.acquisitionOrders = res.acquisitionOrders;
        thisVm.orderRecordedAssets = res.orderRecordedAssets;
        let tableData = thisVm.prepareTableData(
          res.acquisitionOrders,
          res.orderRecordedAssets
        );
        //render the table
        thisVm.items = tableData;

        //footer total
        thisVm.prepareTotalsData(tableData);

        //chart data
        thisVm.prepareChartData(tableData);
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
        formatedDate: genKey.indexKey,
        formatedTotalOrderAmount: "0",
        formatedTotalOrderQuantity: "0",
        formatedTotalReceivedQuantity: "0",
        formatedTotalDeficitQuantity: "0",
        formatedTotalResolvedQuantity: "0",
        formatedTotalRecordedQuantity: "0",
        formatedTotalPendingToRecordQuantity: "0",
        totalOrderAmount: 0,
        totalOrderQuantity: 0,
        totalReceivedQuantity: 0,
        totalDeficitQuantity: 0,
        totalResolvedQuantity: 0,
        totalRecordedQuantity: 0,
        totalPendingToRecordQuantity: 0,
        indexOrderingValue: genKey.indexOrderingValue,
      };
    },
    prepareTableData(acquisitionOrders, orderRecordedAssets, filterKey) {
      //nyd
      //get the right values for this
      let startPhpTime = 0;
      let endPhpTime = 100000000000000;

      //level 1
      let tableData = [];
      let indexedByDateOrders = {};
      for (let index = 0; index < acquisitionOrders.length; index++) {
        const acquisitionOrder = acquisitionOrders[index];
        //the index
        let genKey = this.getIndexKeyAndOrderValue(
          acquisitionOrder.approved_date
        );
        if (typeof filterKey != "undefined" && filterKey != genKey.indexKey) {
          //skip
          continue;
        }
        if (genKey.indexKey == "NaN-NaN") {
          console.log("nan-acquisitionOrder", acquisitionOrder);
        }
        if (!Object.hasOwnProperty.call(indexedByDateOrders, genKey.indexKey)) {
          //create this index
          indexedByDateOrders[genKey.indexKey] = this.getNewTableItem(genKey);
        }
        let tableItem = indexedByDateOrders[genKey.indexKey];

        //total order amounts
        //for the sake of consistence lets use the order items,
        //even if we have an embedded for loop for now
        for (
          let orderItemIndex = 0;
          orderItemIndex < acquisitionOrder.order_items.length;
          orderItemIndex++
        ) {
          const orderItem = acquisitionOrder.order_items[orderItemIndex];
          //order amount
          tableItem.totalOrderAmount += parseFloat(orderItem.line_total_amount);
          tableItem.formatedTotalOrderAmount = Utils.comma(
            tableItem.totalOrderAmount
          );
          //order quantity
          tableItem.totalOrderQuantity += parseFloat(orderItem.quantity);
          tableItem.formatedTotalOrderQuantity = Utils.comma(
            tableItem.totalOrderQuantity
          );
          //Received Qty
          //this works with the delivery date
          //this delivery date should be within the range
          if (
            acquisitionOrder.delivery_date.trim().length > 0 &&
            acquisitionOrder.delivery_date_time >= startPhpTime &&
            acquisitionOrder.delivery_date_time <= endPhpTime
          ) {
            //delivery is within the report date range
            tableItem.totalReceivedQuantity += parseFloat(
              orderItem.quantity_delivered
            );
            tableItem.formatedTotalReceivedQuantity = Utils.comma(
              tableItem.totalReceivedQuantity
            );
            //rejected Qty
            tableItem.totalDeficitQuantity += parseFloat(
              orderItem.quantity_rejected
            );
            tableItem.formatedTotalDeficitQuantity = Utils.comma(
              tableItem.totalDeficitQuantity
            );
            //was this deficience resolved
            if (parseInt(orderItem.is_rejected_resolved) == 1) {
              tableItem.totalResolvedQuantity += parseFloat(
                orderItem.quantity_rejected
              );
              tableItem.formatedTotalResolvedQuantity = Utils.comma(
                tableItem.totalResolvedQuantity
              );
            }
          } else {
            //delivery is outside the report date range or it did not happen
          }
        }

        //pending recording
        tableItem.totalPendingToRecordQuantity =
          tableItem.totalReceivedQuantity - tableItem.totalRecordedQuantity;
        tableItem.formatedTotalPendingToRecordQuantity = Utils.comma(
          tableItem.totalPendingToRecordQuantity
        );

        indexedByDateOrders[genKey.indexKey] = tableItem;
      }
      for (let index = 0; index < orderRecordedAssets.length; index++) {
        const orderRecordedAsset = orderRecordedAssets[index];
        //the index
        let genKey = this.getIndexKeyAndOrderValue(
          orderRecordedAsset.recorded_date
        );
        if (typeof filterKey != "undefined" && filterKey != genKey.indexKey) {
          //skip
          continue;
        }
        if (genKey.indexKey == "NaN-NaN") {
          console.log("nan-orderRecordedAsset", orderRecordedAsset);
        }
        if (!Object.hasOwnProperty.call(indexedByDateOrders, genKey.indexKey)) {
          //create this index
          indexedByDateOrders[genKey.indexKey] = this.getNewTableItem(genKey);
        }
        let tableItem = indexedByDateOrders[genKey.indexKey];

        //recorded asset quantities
        tableItem.totalRecordedQuantity += 1;
        tableItem.formatedTotalRecordedQuantity = Utils.comma(
          tableItem.totalRecordedQuantity
        );
        //pending recording
        tableItem.totalPendingToRecordQuantity =
          tableItem.totalReceivedQuantity - tableItem.totalRecordedQuantity;
        tableItem.formatedTotalPendingToRecordQuantity = Utils.comma(
          tableItem.totalPendingToRecordQuantity
        );

        indexedByDateOrders[genKey.indexKey] = tableItem;
      }

      //flatten the data
      for (const indexKey in indexedByDateOrders) {
        const tableItem = indexedByDateOrders[indexKey];
        tableData.push(tableItem);
      }
      //nyd
      //sort the data according to date descing using the indexOrderingValue
      //thats why we use b - a
      tableData.sort((a, b) => {
        return b.indexOrderingValue - a.indexOrderingValue;
      });
      return tableData;
    },
    prepareTotalsData(tableData) {
      //footer totals
      let footerTotalOrderAmount = 0;
      let footerTotalOrderQuantity = 0;
      let footerTotalReceivedQuantity = 0;
      let footerTotalDeficitQuantity = 0;
      let footerTotalUndeliveredQuantity = 0;
      let footerTotalResolvedQuantity = 0;
      let footerTotalNotResolvedQuantity = 0;

      let footerTotalRecordedQuantity = 0;
      let footerTotalUnRegisteredQuantity = 0;

      let footerTotalMissingRequiredQuantity = 0;

      for (let index = 0; index < tableData.length; index++) {
        const row = tableData[index];
        footerTotalOrderAmount += row.totalOrderAmount;
        footerTotalOrderQuantity += row.totalOrderQuantity;
        footerTotalReceivedQuantity += row.totalReceivedQuantity;
        footerTotalDeficitQuantity += row.totalDeficitQuantity;
        //undelivered
        footerTotalUndeliveredQuantity =
          footerTotalOrderQuantity -
          (footerTotalReceivedQuantity + footerTotalDeficitQuantity);

        footerTotalResolvedQuantity += row.totalResolvedQuantity;
        footerTotalNotResolvedQuantity =
          footerTotalDeficitQuantity - footerTotalResolvedQuantity;

        footerTotalRecordedQuantity += row.totalRecordedQuantity;
        footerTotalUnRegisteredQuantity =
          footerTotalReceivedQuantity - footerTotalRecordedQuantity;

        footerTotalMissingRequiredQuantity =
          footerTotalOrderQuantity -
          (footerTotalReceivedQuantity - footerTotalDeficitQuantity);
      }
      this.basicInfo = [
        {
          key: "<b>TOTALS<b>",
          value: "",
        },
        {
          key: "Order Amount",
          value: Utils.comma(footerTotalOrderAmount),
        },
        {
          key: "Requested",
          value:
            Utils.comma(footerTotalOrderQuantity) + " <small>assets</small>",
        },
        {
          key: "Received - <small>accepted</small>",
          value:
            Utils.comma(footerTotalReceivedQuantity) + " <small>assets</small>",
        },
        {
          key: "Rejected - <small>defective</small>",
          value:
            Utils.comma(footerTotalDeficitQuantity) + " <small>assets</small>",
        },
        {
          key: `<b class="text-danger">Undelivered</b>`,
          value: `<b class="text-danger">${Utils.comma(
            footerTotalUndeliveredQuantity
          )}</b>  <small>assets</small>`,
        },
        {
          key: "<div><br/></div>",
          value: "",
        },
        {
          key: "Re-Ordered - <small>resolved</small>",
          value:
            Utils.comma(footerTotalResolvedQuantity) + " <small>assets</small>",
        },
        {
          key: `<b class="text-warning">Un-Resolved</b> - <small>from rejected</small>`,
          value: `<b class="text-warning">${Utils.comma(
            footerTotalNotResolvedQuantity
          )}</b>  <small>assets</small>`,
        },
        {
          key: "<div><br/></div>",
          value: "",
        },
        {
          key: "Recorded",
          value:
            Utils.comma(footerTotalRecordedQuantity) + " <small>assets</small>",
        },
        {
          key: `<b class="text-info">Pending-Registration</b> - <small>from received</small>`,
          value: `<b class="text-info">${Utils.comma(
            footerTotalUnRegisteredQuantity
          )}</b>  <small>assets</small>`,
        },
        {
          key: "<div><br/><br/></div>",
          value: "",
        },
        {
          key: `<b class="text-primary">Asset Deficit</b> - <small>from orders</small>`,
          value: `<b class="text-primary">${Utils.comma(
            footerTotalMissingRequiredQuantity
          )}</b>  <small>assets</small>`,
        },
      ];
    },
    prepareChartData(tableData) {
      let xAxisCategories = [];
      let orderAmmountData = [];
      let tableDataCopy = [...tableData];
      //reverse the table data
      tableDataCopy.reverse();
      for (let index = 0; index < tableDataCopy.length; index++) {
        const tableDataRow = tableDataCopy[index];

        orderAmmountData.push(tableDataRow.totalOrderAmount);
        xAxisCategories.push(tableDataRow.formatedDate);
      }

      this.chartSeries = [
        {
          name: "Order Amount",
          data: orderAmmountData,
        },
      ];
      this.chartOptions.xaxis.categories = xAxisCategories;
      this.renderChart = true;
    },
    level1HeaderItemClassNameFunction: function (header, columnNumber) {
      let headerName = "";
      if (typeof header === "object") {
        headerName = header.value;
      } else {
        headerName = header;
      }
      let moneyDisplayColumns = [
        "formatedTotalOrderAmount",
        "formatedTotalOrderQuantity",
        "formatedTotalReceivedQuantity",
        "formatedTotalDeficitQuantity",
        "formatedTotalResolvedQuantity",
        "formatedTotalRecordedQuantity",
        "formatedTotalPendingToRecordQuantity",
      ];
      if (moneyDisplayColumns.indexOf(headerName) >= 0) {
        return "text-end";
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
            this.acquisitionOrders,
            this.orderRecordedAssets
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
    loadLevel2Data: function (
      expandedItem,
      acquisitionOrders,
      orderRecordedAssets
    ) {
      let vm = this;
      var promise = new Promise(function (resolve, reject) {
        try {
          let targetIndexKey = expandedItem.formatedDate;
          let tableData = vm.prepareTable2Data(
            targetIndexKey,
            acquisitionOrders,
            orderRecordedAssets
          );
          resolve(tableData);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    },
    prepareTable2Data(filterKey, acquisitionOrders, orderRecordedAssets) {
      //nyd
      //get the right values for this
      let startPhpTime = 0;
      let endPhpTime = 100000000000000;

      //level 2
      let tableData = [];
      for (let index = 0; index < acquisitionOrders.length; index++) {
        const acquisitionOrder = acquisitionOrders[index];
        //the index
        let genKey = this.getIndexKeyAndOrderValue(
          acquisitionOrder.approved_date,
          true
        );
        if (typeof filterKey != "undefined" && filterKey != genKey.indexKey) {
          //skip
          continue;
        }

        let tableItem = this.getNewTableItem(genKey);
        tableItem.id = "ord-" + acquisitionOrder.id;
        tableItem.orderNameAndDate = `${acquisitionOrder.approved_date} - ${acquisitionOrder.order_number}`;
        tableItem.reportGenDate = acquisitionOrder.approved_date;
        tableItem.acquisitionOrder = { ...acquisitionOrder };

        //total order amounts
        //for the sake of consistence lets use the order items,
        //even if we have an embedded for loop for now
        for (
          let orderItemIndex = 0;
          orderItemIndex < acquisitionOrder.order_items.length;
          orderItemIndex++
        ) {
          const orderItem = acquisitionOrder.order_items[orderItemIndex];
          //order amount
          tableItem.totalOrderAmount += parseFloat(orderItem.line_total_amount);
          tableItem.formatedTotalOrderAmount = Utils.comma(
            tableItem.totalOrderAmount
          );
          //order quantity
          tableItem.totalOrderQuantity += parseFloat(orderItem.quantity);
          tableItem.formatedTotalOrderQuantity = Utils.comma(
            tableItem.totalOrderQuantity
          );
          //Received Qty
          //this works with the delivery date
          //this delivery date should be within the range
          if (
            acquisitionOrder.delivery_date.trim().length > 0 &&
            acquisitionOrder.delivery_date_time >= startPhpTime &&
            acquisitionOrder.delivery_date_time <= endPhpTime
          ) {
            //delivery is within the report date range
            tableItem.totalReceivedQuantity += parseFloat(
              orderItem.quantity_delivered
            );
            tableItem.formatedTotalReceivedQuantity = Utils.comma(
              tableItem.totalReceivedQuantity
            );
            //rejected Qty
            tableItem.totalDeficitQuantity += parseFloat(
              orderItem.quantity_rejected
            );
            tableItem.formatedTotalDeficitQuantity = Utils.comma(
              tableItem.totalDeficitQuantity
            );
            //was this deficience resolved
            if (parseInt(orderItem.is_rejected_resolved) == 1) {
              tableItem.totalResolvedQuantity += parseFloat(
                orderItem.quantity_rejected
              );
              tableItem.formatedTotalResolvedQuantity = Utils.comma(
                tableItem.totalResolvedQuantity
              );
            }
          } else {
            //delivery is outside the report date range or it did not happen
          }
        }

        //pending recording
        tableItem.totalPendingToRecordQuantity =
          tableItem.totalReceivedQuantity - tableItem.totalRecordedQuantity;
        tableItem.formatedTotalPendingToRecordQuantity = Utils.comma(
          tableItem.totalPendingToRecordQuantity
        );

        tableData.push(tableItem);
      }

      for (let index = 0; index < orderRecordedAssets.length; index++) {
        const orderRecordedAsset = orderRecordedAssets[index];
        //the index
        let genKey = this.getIndexKeyAndOrderValue(
          orderRecordedAsset.recorded_date,
          true
        );
        if (typeof filterKey != "undefined" && filterKey != genKey.indexKey) {
          //skip
          continue;
        }

        let tableItem = this.getNewTableItem(genKey);
        tableItem.id = "rec-" + orderRecordedAsset.order_item_id;
        tableItem.orderNameAndDate = `${orderRecordedAsset.recorded_date} - rec4 #${orderRecordedAsset.order_item_id}`;

        //first try and look for this date
        let foundIndex = -1;
        for (let index = 0; index < tableData.length; index++) {
          const row = tableData[index];
          if (row.reportGenDate == orderRecordedAsset.recorded_date) {
            tableItem = row;
            foundIndex = index;
            break;
          }
        }

        //recorded asset quantities
        tableItem.totalRecordedQuantity += 1;
        tableItem.formatedTotalRecordedQuantity = Utils.comma(
          tableItem.totalRecordedQuantity
        );

        //pending recording
        tableItem.totalPendingToRecordQuantity =
          tableItem.totalReceivedQuantity - tableItem.totalRecordedQuantity;
        tableItem.formatedTotalPendingToRecordQuantity = Utils.comma(
          tableItem.totalPendingToRecordQuantity
        );

        if (foundIndex != -1) {
          tableItem.isOnlyRecording = true;
          //we used an already existing row
          tableData[foundIndex] = tableItem;
        } else {
          //empty other columns
          tableItem.formatedTotalOrderAmount = "";
          tableItem.formatedTotalOrderQuantity = "";
          tableItem.formatedTotalReceivedQuantity = "";
          tableItem.formatedTotalDeficitQuantity = "";
          tableItem.formatedTotalResolvedQuantity = "";

          (tableItem.reportGenDate = orderRecordedAsset.recorded_date),
            tableData.push(tableItem);
        }
      }

      //thats why we use b - a
      tableData.sort((a, b) => {
        return b.indexOrderingValue - a.indexOrderingValue;
      });
      return tableData;
    },
    expandLevel2: function (monthOrdersDateItem, level2Dataindex) {
      //get the orders of this date
      //get the item
      for (var index = 0; index < this.items.length; index++) {
        let item = this.items[index];
        if (
          parseInt(item.formatedDate) ==
          parseInt(monthOrdersDateItem.formatedDate)
        ) {
          if (item.level2Data) {
            //get the acquisition order
            const expandedAcquisitionItem = item.level2Data[level2Dataindex];
            if (!expandedAcquisitionItem.level3Data) {
              expandedAcquisitionItem.expandLoading = true;
              let vm = this;
              setTimeout(() => {
                vm.loadLevel3Data(
                  expandedAcquisitionItem,
                  vm.orderRecordedAssets
                )
                  .then((level3Data) => {
                    expandedAcquisitionItem.level3Data = level3Data;
                    expandedAcquisitionItem.expandLoading = false;
                  })
                  .catch((errors) => {
                    console.log("Expanding level3 error", errors);
                    expandedAcquisitionItem.expandLoading = false;
                  });
              }, 1500);
            }
          } else {
            console.log("Expanded acquisitionItem has no level2data");
          }
          return false;
        }
      }
    },
    loadLevel3Data: function (expandedAcquisitionItem, orderRecordedAssets) {
      let vm = this;
      var promise = new Promise(function (resolve, reject) {
        try {
          //level 3
          var level3Data = [];
          //we need only recordings that belongs to the same date
          for (let index = 0; index < orderRecordedAssets.length; index++) {
            const orderRecordedAsset = orderRecordedAssets[index];
            if (
              expandedAcquisitionItem.reportGenDate ==
              orderRecordedAsset.recorded_date
            ) {
              level3Data.push(orderRecordedAsset);
            }
          }
          resolve(level3Data);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    },
  },
  mounted() {
    this.loadReport();
  },
};
</script>