<template>
  <div class="d-flex justify-content-between" v-if="asset != null">
    <div class="" style="width: 350px;">
      <div>
        <span style="margin-right: 50px"> Asset Name: </span>
        <span
          ><strong>{{ asset.name }}</strong></span
        >
      </div>
      <div>
        <span class="text-capitalize" style="margin-right: 45px">
          {{ indexedCategories[asset.category_id].identifier }}:
        </span>
        <span>
          <strong>{{ asset.identifier_number }}</strong>
        </span>
      </div>
      <div>
        <span class="text-capitalize" style="margin-right: 68px">
          Category:
        </span>
        <span>
          <strong class="text-capitalize">{{
            indexedCategories[asset.category_id].name
          }}</strong>
        </span>
      </div>
      <div>
        <span class="text-capitalize" style="margin-right: 65px">
          Condition:
        </span>
        <span>
          <strong class="text-capitalize">{{ asset.condition }}</strong>
        </span>
      </div>
      <div>
        <span class="text-capitalize" style="margin-right: 85px">
          Status:
        </span>
        <span>
          <strong class="text-capitalize">{{ asset.status }}</strong>
        </span>
      </div>
      <div class="pt-1">
        <span class="text-capitalize" style="margin-right: 50px">
          Useful Years:
        </span>
        <span>
          <strong class="text-capitalize">{{ asset.useful_years }}</strong>
          years
        </span>
      </div>
      <div>
        <span class="text-capitalize" style="margin-right: 3px">
          Out Of Service Date:
        </span>
        <div class="d-inline-block text-right" style="width: 150px">
          <strong class="text-capitalize">{{
            asset.outof_service_date
          }}</strong>
        </div>
      </div>
      <div>
        <span class="text-capitalize" style="margin-right: 33px">
          Purchase Date:
        </span>
        <span>
          <strong class="text-capitalize">{{ asset.purchase_date }}</strong>
        </span>
      </div>
      <div class="pt-1">
        <span class="text-capitalize" style="margin-right: 35px">
          Purchase Cost:
        </span>
        <div class="d-inline-block text-end" style="width: 150px">
          <strong class="text-capitalize">{{
            comma(asset.purchase_cost)
          }}</strong>
        </div>
      </div>
      <div>
        <span class="text-capitalize" style="margin-right: 22px">
          Salvage Amount:
        </span>
        <div class="d-inline-block text-end" style="width: 150px">
          <strong class="text-capitalize">{{ comma(asset.salvage) }}</strong>
        </div>
      </div>
      <div>
        <span class="text-capitalize" style="margin-right: 11px">
          Total Depreciation:
        </span>
        <div class="d-inline-block text-end" style="width: 150px">
          <strong class="text-capitalize">{{
            comma(asset.totalDepreciation)
          }}</strong>
        </div>
      </div>
      <div>
        <span class="text-capitalize" style="margin-right: 53px">
          Asset Value:
        </span>
        <div class="d-inline-block text-end" style="width: 150px">
          <strong class="text-capitalize">{{
            comma(asset.assetsValue)
          }}</strong>
        </div>
      </div>
      <div class="d-flex flex-column">
        <span class="text-capitalize" style="margin-right: 53px">
          Description:
        </span>
        <div
          class="d-inline-block text-start"
          style="padding: 5px; width: 300px; max-width: 300px"
        >
          <strong class="text-capitalize">{{ asset.description }}</strong>
        </div>
      </div>
    </div>
    <div class="flex-grow-1" style="align-items: flex-end">
      <apexchart
        type="line"
        height="250"
        :options="chartOptions"
        :series="series"
        v-if="displayChart"
      >
      </apexchart>
    </div>
  </div>
</template>

<script>
import Utils from "@/utils/";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    VueApexCharts,
  },
  props: {
    asset: {
      type: Object,
      default: function () {
        return null;
      },
    },
    indexedCategories: {
      type: Object,
      default: function () {
        return {};
      },
    },
    assetTrends: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      displayChart: false,
      series: [],
      chartOptions: {
        chart: {
          height: 250,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        title: {
          text: "Depreciation By Month",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
            labels: {
                /**
                 * Allows users to apply a custom formatter function to yaxis labels.
                 *
                 * @param { String } value - The generated value of the y-axis tick
                 * @param { index } index of the tick / currently executing iteration in yaxis labels array
                 */
                formatter: function(val, index) {
                    return val.toFixed(2);
                }
            }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              let currency = JSON.parse(localStorage.getItem("config")).currency;
              return `${Utils.comma(val)} ${currency}`;
            },
          },
        },
      },
    };
  },
  methods: {
    comma(value) {
      return Utils.comma(value);
    },
    loadChart() {
      let depreciationSeriesData = [];
      let assetsSeriesData = [];
      let xAxisCategories = [];
      let indexedRes = {};
      for (let index = 0; index < this.assetTrends.length; index++) {
        const assetTrend = this.assetTrends[index];
        var entryDate = assetTrend.entry_date; //e.g 2023-05-16
        var entryDateParts = entryDate.split("-");
        var key = `${entryDateParts[1]}-${entryDateParts[0]}`;
        if (!Object.hasOwnProperty.call(indexedRes, key)) {
          indexedRes[key] = {
            assetValue: 0,
            depreciation: 0,
          };
          xAxisCategories.push(key);
        }
        const graphColumnItem = indexedRes[key];
        //we want to pick the last asset value in the month
        graphColumnItem.assetValue = parseFloat(assetTrend.current_value);
        //we accumulate all the depreciation in this month
        graphColumnItem.depreciation += Number(
          assetTrend.daily_depreciation.toFixed(2)
        );
        indexedRes[key] = graphColumnItem;
      }
      var cummulativeDepreciation = 0;
      for (let index = 0; index < xAxisCategories.length; index++) {
        const generatedKey = xAxisCategories[index];
        let depreciationValue = Number(
          indexedRes[generatedKey].depreciation.toFixed(2)
        );
        cummulativeDepreciation += depreciationValue;
        depreciationSeriesData.push(cummulativeDepreciation);
        let assetValue = parseFloat(
          indexedRes[generatedKey].assetValue.toFixed(1)
        );
        console.log("assetValue", assetValue);
        assetsSeriesData.push(assetValue);
      }
      //skip some data points if we have more than 12 cols
      while(assetsSeriesData.length > 12){
        let colsRes = [];
        let valsRes = [];
        let depRes = [];
        let doSkip = 0;
        let prev_value_i = 0;
        let prev_dep_value_i = 0;
        for (let ptr_i = 0; ptr_i < assetsSeriesData.length; ptr_i++) {
            var value_i = assetsSeriesData[ptr_i];
            var dep_value_i = depreciationSeriesData[ptr_i];
            doSkip += 1;
            if(doSkip == 2){
                valsRes.push(value_i);
                depRes.push(dep_value_i);
                let col = xAxisCategories[ptr_i];
                colsRes.push(col);
                doSkip = 0;
            }else{
                prev_value_i = value_i;
                prev_dep_value_i = dep_value_i;
            }
        }
        assetsSeriesData = valsRes;
        depreciationSeriesData = depRes;
        xAxisCategories = colsRes;
      }
      //serires
      let serires = [
        {
          name: "Asset Value",
          type: "column",
          data: assetsSeriesData,
        },
        {
          name: "Depreciation",
          data: depreciationSeriesData,
        },
      ];
      this.series = serires;
      this.chartOptions.xaxis.categories = xAxisCategories;
      //mark the salvage line
      this.chartOptions["annotations"] = {
        yaxis: [
          {
            y: parseFloat(this.asset.salvage),
            borderColor: "#7367f0",
            label: {
              borderColor: "#7367f04d",
              style: {
                color: "#fff",
                background: "#7367f04d",
              },
              text: "salvage",
            },
          },
        ],
      };
    //   this.chartOptions["yaxis"] = [
    //     {
    //       title: {
    //         text: "Asset Values",
    //       },
    //     },
    //     {
    //       opposite: true,
    //       title: {
    //         text: "Depreciation",
    //       },
    //     },
    //   ];
      this.displayChart = true;
    },
  },
  mounted() {
    this.loadChart();
  },
};
</script>