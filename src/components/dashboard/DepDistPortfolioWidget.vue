<template>
    <div class="bg-white m-1 w-50 p-1 rounded">
        <apexchart
            type="bar"
            height="250"
            :options="chartOptions"
            :series="series"
        ></apexchart>
    </div>
</template>


<script>
import Utils from "@/utils/";
import Vm from "@/utils/Vm";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    VueApexCharts
  },
  props: {
    user: {
      type: Object,
      default: function () {
        return Utils.defaultUser();
      },
    },
  },
  data() {
    return {
      currency: "",
      series: [
        {
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [
            "low (0 - 10)%",
            "10% range",
            "20% range",
            "mid (30 - 40)%",
            "40% range",
            "50% range",
            "high (60 - 70)%",
            "70% range",
            "80% range",
            "max (90 - 100)%",
          ],
        },
        title: {
          text: "Depreciation Distribution Portfolio",
          align: "center",
        },
        fill: {
          colors: [
            function (dataPoint) {
              let index = dataPoint.dataPointIndex;
              let colors = [
                "#c3b6fd",
                "#ddd6fe",
                "#c3b6fd",
                "#c3b6fd",
                "#8b5cf6",
                "#7c3aed",
                "#6d28d9",
                "#5b21b6",
                "#4c1d95",
                "#4c1d95",
              ];

              return colors[index];
            },
          ],
        },
      }
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadDependencies() {
      var vm = this;
      vm.fetch("dashboardDepDistPortfolioWidgetDependencies", function (thisVm, res) {
        let depPortfolioData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let index = 0; index < res.assets.length; index++) {
          const asset = res.assets[index];
          let itemPurchCost = parseFloat(asset.purchase_cost);
          let currentValue = Utils.getCurrentAssetValue(asset);
         
          let depAmount = itemPurchCost - currentValue;
          let perDep = (depAmount / itemPurchCost) * 100;
          if (perDep >= 100) {
            perDep = 99;
          }
          let perIndex = Number(`${perDep}`[0]);
          depPortfolioData[perIndex] += depAmount;
        }
        thisVm.series = [
          {
            data: depPortfolioData,
          },
        ];
      });
    }
  },
  mounted() {
    this.currency = JSON.parse(localStorage.getItem("config")).currency;
    this.loadDependencies();
  },
};
</script>