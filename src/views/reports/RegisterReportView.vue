<template>
  <div class="px-5 py-1">
    <div class="d-flex bg-white" style="padding: 10px">
      <div class="">
        <h5><b>Asset Registry Report</b></h5>
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
                <template #expand="asset">
                  <div
                    v-if="asset.level3Data"
                    class="inner-inner-level"
                    style="padding: 10px"
                  >
                    <AssetRegisterReportInnerViewer
                      :asset="asset"
                      :indexed-categories="indexedCategories"
                      :asset-trends="asset.level3Data"
                    />
                  </div>
                </template>
              </EasyDataTable>
            </div>
          </template>
        </EasyDataTable>
      </div>
      <div
        style="min-width: 450px; text-align: right"
        class="position-relative"
      >
        <div class="d-flex flex-column justify-content-end position-fixed" style="min-width: 430px;" >
          <div class="w-100">
            <KeyValueList :items="basicInfo" />
          </div>
          <div v-if="renderPieChart">
            <apexchart
              type="pie"
              width="380"
              :options="pieChartOptions"
              :series="pieChartSeries"
            ></apexchart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import AssetRegisterReportInnerViewer from "@/components/viewers/AssetRegisterReportInnerViewer.vue";
import KeyValueList from "@/components/lists/KeyValueList.vue";

export default {
  components: {
    VueApexCharts,
    AssetRegisterReportInnerViewer,
    KeyValueList,
  },
  data: function () {
    return {
      indexedCategories: {},
      indexedAssets: {},
      trends: [],
      headers: [
        { text: "Category", value: "categoryName" },
        {
          text: "Purchase Cost",
          value: "formatedTotalPurchaseCost",
          width: "145",
        },
        {
          text: "Total Depreciation",
          value: "formatedTotalDepreciation",
          width: "145",
        },
        {
          text: "Asset's Value",
          value: "formatedTotalAssetsValue",
          width: "145",
        },
        { text: "Salvage Amount", value: "formatedTotalSalvage", width: "145" },
      ],
      items: [],
      footer: {
        totalPurcaseCost: 0,
        totalDepreciation: 0,
        totalAssetsValue: 0,
        totalSalvageAmount: 0,
      },

      level2Headers: [
        { text: "Asset", value: "assetName" },
        { text: "Purchase Cost", value: "formatedPurchaseCost", width: "145" },
        {
          text: "Total Depreciation",
          value: "formatedTotalDepreciation",
          width: "145",
        },
        { text: "Asset's Value", value: "formatedAssetsValue", width: "145" },
        { text: "Salvage Amount", value: "formatedSalvage", width: "145" },
      ],

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
            floating: true
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
          text: "Asset Values Distribution",
          align: "center",
        },
      },
      pieChartSeries: [],

      options: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
      ],
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadReport() {
      var vm = this;
      vm.footer = {
        totalPurcaseCost: 0,
        totalDepreciation: 0,
        totalAssetsValue: 0,
        totalSalvageAmount: 0,
      };
      vm.pieChartSeries = [];
      vm.fetch("reportAssetRegisterDependencies", function (thisVm, res) {
        //nyd
        //delete this dummy genertated data
        var genTrendsData = Utils.generateSampleTrendingDataRegisterReport(
          res.assets,
          new Date(),
          1
        );
        res.valueTrends = genTrendsData;

        thisVm.indexedCategories = Utils.index(res.categories, "id");
        //preprocess data
        let indexedAsets = Utils.index(res.assets, "id");
        //get the last asset value in the trends and salvage amount
        for (let index = 0; index < res.valueTrends.length; index++) {
          const trend = res.valueTrends[index];
          let assetId = trend.asset_id;
          if (indexedAsets[assetId]) {
            let asset = indexedAsets[assetId];
            if (asset.lastTrendAssetValue) {
              asset.lastTrendAssetValue = 0;
            }
            if (asset.lastTrendSalvageValue) {
              asset.lastTrendSalvageValue = 0;
            }
            asset.lastTrendAssetValue = parseFloat(trend.current_value);
            asset.lastTrendSalvageValue = parseFloat(trend.salvage_amount);
            indexedAsets[assetId] = asset;
          }
        }
        thisVm.indexedAssets = indexedAsets;
        thisVm.trends = res.valueTrends;

        thisVm.prepareTableData(res.valueTrends, indexedAsets);
      });
    },
    prepareTableData(trendsData, indexedAssets) {
      //level 1
      var categoriesData = [];
      var indexedCategoriesCopy = {
        ...this.indexedCategories,
      };
      //add needed props for level 1
      for (const categoryId in indexedCategoriesCopy) {
        let categoryObj = indexedCategoriesCopy[categoryId];
        let category = {
          ...categoryObj,
          categoryName: categoryObj.name,
          totalPurchaseCost: 0,
          formatedTotalPurchaseCost: "0",
          totalDepreciation: 0,
          formatedTotalDepreciation: "0",
          totalAssetsValue: 0,
          formatedTotalAssetsValue: "0",
          totalSalvage: 0,
          formatedTotalSalvage: "0",
        };
        indexedCategoriesCopy[categoryId] = category;
      }
      //collect the purchase costs of the assets at once and the asset value
      for (const assetId in indexedAssets) {
        let asset = indexedAssets[assetId];
        let catId = asset.category_id;
        let category = indexedCategoriesCopy[catId];
        let purchaseCost = parseFloat(asset.purchase_cost);
        //purchase cost
        category.totalPurchaseCost += purchaseCost;
        category.formatedTotalPurchaseCost = Utils.comma(
          category.totalPurchaseCost
        );
        //asset value
        if (asset.lastTrendAssetValue) {
          category.totalAssetsValue += asset.lastTrendAssetValue;
          category.formatedTotalAssetsValue = Utils.comma(
            category.totalAssetsValue
          );
        }
        //salvage amount
        if (asset.lastTrendSalvageValue) {
          category.totalSalvage += asset.lastTrendSalvageValue;
          category.formatedTotalSalvage = Utils.comma(category.totalSalvage);
        }
        indexedCategoriesCopy[catId] = category;
      }

      //go through the trends, we need only one pass
      for (let index = 0; index < trendsData.length; index++) {
        const trend = trendsData[index];
        let catId = trend.category_id;
        let category = indexedCategoriesCopy[catId];
        if (!category) {
          console.log("Notcat", catId, indexedCategoriesCopy);
          continue;
        }
        //depreciation
        category.totalDepreciation += parseFloat(trend.daily_depreciation);
        category.formatedTotalDepreciation = Utils.comma(
          category.totalDepreciation
        );
        indexedCategoriesCopy[catId] = category;
      }

      //flatten the data
      var pieChartData = {};
      for (const categoryId in indexedCategoriesCopy) {
        let category = indexedCategoriesCopy[categoryId];
        categoriesData.push(category);

        this.footer.totalPurcaseCost += parseFloat(category.totalPurchaseCost);
        this.footer.totalSalvageAmount += parseFloat(category.totalSalvage);
        this.footer.totalDepreciation += parseFloat(category.totalDepreciation);
        this.footer.totalAssetsValue += parseFloat(category.totalAssetsValue);

        //pie chart series
        let pieChartCategory = category;
        if(pieChartCategory.category_id && parseInt(pieChartCategory.category_id) > 0){
            let parentCategoryId = pieChartCategory.category_id;
            pieChartCategory = indexedCategoriesCopy[parentCategoryId];
        }
        if(!pieChartData[pieChartCategory.id]){
            //add a new entry
            pieChartData[pieChartCategory.id] = {
                label: pieChartCategory.name,
                totalAssetsValue: 0
            }
        }
        pieChartData[pieChartCategory.id].totalAssetsValue += parseFloat(pieChartCategory.totalAssetsValue);
        
      }

      this.items = categoriesData;

      //footer totals
      this.basicInfo = [
        {
          key: "<b>TOTALS<b>",
          value: "",
        },
        {
          key: "Purchase Cost",
          value: Utils.comma(Math.ceil(this.footer.totalPurcaseCost)),
        },
        {
          key: "Depreciation",
          value: Utils.comma(Math.ceil(this.footer.totalDepreciation)),
        },
        {
          key: "Assets Value",
          value: Utils.comma(Math.ceil(this.footer.totalAssetsValue)),
        },
        {
          key: "Salvage",
          value: Utils.comma(Math.ceil(this.footer.totalSalvageAmount)),
        },
      ];
      //pie chart flat data
      let pieChartSeriesData = [];
      let pieChartLabels = [];
      for (const categoryId in pieChartData) {
        let pieItem = pieChartData[categoryId];
        pieChartSeriesData.push(pieItem.totalAssetsValue);
        pieChartLabels.push(pieItem.label);
      }
      this.pieChartSeries = pieChartSeriesData;
      this.pieChartOptions.labels = pieChartLabels;
      this.renderPieChart = true;


    },
    level1HeaderItemClassNameFunction: function (header, columnNumber) {
      let headerName = "";
      if (typeof header === "object") {
        headerName = header.value;
      } else {
        headerName = header;
      }
      let moneyDisplayColumns = [
        "formatedTotalPurchaseCost",
        "formatedTotalDepreciation",
        "formatedTotalAssetsValue",
        "formatedTotalSalvage",
        "formatedPurchaseCost",
        "formatedTotalDepreciation",
        "formatedAssetsValue",
        "formatedSalvage",
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
          vm.loadLevel2Data(expandedItem, this.indexedAssets, this.trends)
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
    loadLevel2Data: function (expandedItem, indexedAssets, trends) {
      let vm = this;
      var promise = new Promise(function (resolve, reject) {
        try {
          //level 2
          var level2Data = [];
          //we need only assets that belong to this category
          var indexedAssetsCopy = {};
          for (const assetId in indexedAssets) {
            let assetObj = indexedAssets[assetId];
            if (parseInt(assetObj.category_id) == parseInt(expandedItem.id)) {
              indexedAssetsCopy[assetObj.id] = assetObj;
            }
          }
          //add needed props for level 2
          for (const assetId in indexedAssetsCopy) {
            let assetObj = indexedAssetsCopy[assetId];
            let purchaseCost = parseFloat(assetObj.purchase_cost);
            let asset = {
              ...assetObj,
              assetName: `${assetObj.identifier_number} -  ${assetObj.name}`,
              purchaseCost: purchaseCost,
              formatedPurchaseCost: Utils.comma(purchaseCost),
              totalDepreciation: 0,
              formatedTotalDepreciation: "0",
              assetsValue: assetObj.lastTrendAssetValue
                ? assetObj.lastTrendAssetValue
                : 0,
              formatedAssetsValue: assetObj.lastTrendAssetValue
                ? Utils.comma(assetObj.lastTrendAssetValue)
                : "0",
              salvage: assetObj.lastTrendSalvageValue
                ? assetObj.lastTrendSalvageValue
                : 0,
              formatedSalvage: assetObj.lastTrendSalvageValue
                ? Utils.comma(assetObj.lastTrendSalvageValue)
                : "0",
            };
            indexedAssetsCopy[assetId] = asset;
          }
          //go through the trends, we need only one pass
          for (let index = 0; index < trends.length; index++) {
            const trend = trends[index];
            let assetId = trend.asset_id;
            let asset = indexedAssetsCopy[assetId];
            if (!asset) {
              // console.log("NoAsset", assetId, indexedAssetsCopy);
              continue;
            }
            //depreciation
            asset.totalDepreciation += parseFloat(trend.daily_depreciation);
            asset.formatedTotalDepreciation = Utils.comma(
              asset.totalDepreciation
            );
            indexedAssetsCopy[assetId] = asset;
          }
          //flatten the data
          for (const assetId in indexedAssetsCopy) {
            let asset = indexedAssetsCopy[assetId];
            level2Data.push(asset);
          }
          resolve(level2Data);
        } catch (error) {
          reject(error);
        }
      });
      return promise;
    },
    expandLevel2: function (categoryDataItem, level2Dataindex) {
      //get the item
      for (var index = 0; index < this.items.length; index++) {
        let item = this.items[index];
        if (parseInt(item.id) == parseInt(categoryDataItem.id)) {
          if (item.level2Data) {
            //get the asset in focus
            const expandedAssetItem = item.level2Data[level2Dataindex];
            if (!expandedAssetItem.level3Data) {
              expandedAssetItem.expandLoading = true;
              let vm = this;
              setTimeout(() => {
                vm.loadLevel3Data(expandedAssetItem, vm.trends)
                  .then((level3Data) => {
                    expandedAssetItem.level3Data = level3Data;
                    expandedAssetItem.expandLoading = false;
                  })
                  .catch((errors) => {
                    console.log("Expanding level3 error", errors);
                    expandedAssetItem.expandLoading = false;
                  });
              }, 1500);
            }
          } else {
            console.log("Expanded category has no level2data");
          }
          return false;
        }
      }
    },
    loadLevel3Data: function (expandedAssetItem, trends) {
      let vm = this;
      var promise = new Promise(function (resolve, reject) {
        try {
          //level 3
          var level3Data = [];
          //we need only trends that belong to this asset
          for (let index = 0; index < trends.length; index++) {
            const trend = trends[index];
            let assetId = trend.asset_id;
            if (parseInt(assetId) == parseInt(expandedAssetItem.id)) {
              level3Data.push(trend);
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