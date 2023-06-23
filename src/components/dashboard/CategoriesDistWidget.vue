<template>
  <div class="bg-white ms-1 me-1  w-100 py-1 rounded">
    <apexchart
      type="bar"
      height="270"
      :options="categoriesChartOptions"
      :series="categoriesSeries"
      v-if="renderChart"
    ></apexchart>
  </div>
</template>


<script>
import Utils from "@/utils/";
import Vm from "@/utils/Vm";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    VueApexCharts,
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
      categoriesSeries: [],
      categoriesChartOptions: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          stackType: "100%",
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        xaxis: {
          categories: [],
          position: 'bottom',
        },
        fill: {
          opacity: 1,
        },
        legend: {
          position: "right",
          offsetX: 0,
          offsetY: 50,
        },
        plotOptions: {
            bar: {
                columnWidth: '100%',
            }
        },
      },
      renderChart: false
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadDependencies() {
        var vm = this;
        vm.categoriesSeries = [];
        vm.categoriesChartOptions.xaxis.categories = [];
        var apiName = "dashboardCategoriesDistWidgetDependencies";
        vm.fetch(apiName, function (thisVm, res) {
            //asset categories, only root categories
            let xAxisColums = [];
            //convert to a tree
            let tree = Utils.getTree(
                res.categories,
                "id",
                "category_id",
                false,
                "children",
                true
            );
            let flatItems = Utils.flattenTree(tree);

            
            let series = [
                {
                    name: "Purchase",
                    data: [],
                },
                {
                    name: "Maintenance",
                    data: [],
                },
                {
                    name: "Depreciation",
                    data: [],
                },
                {
                    name: "Impairment",
                    data: [],
                },
                {
                    name: "Disposed",
                    data: [],
                },
            ];

            let purchaseIndex = 0;
            let maintenanceIndex = 1;
            let depreciationIndex = 2;
            let impairmentIndex = 3;
            let disposedIndex = 4;

            let refDic = {};
            for (let index = 0; index < flatItems.length; index++) {
                const flatItem = flatItems[index];
                if(flatItem._level == 0){
                    xAxisColums.push(flatItem.short_name);
                    series[purchaseIndex].data.push(0);
                    series[maintenanceIndex].data.push(0);
                    series[depreciationIndex].data.push(0);
                    series[impairmentIndex].data.push(0);
                    series[disposedIndex].data.push(0);
                    refDic[flatItem.short_name] = xAxisColums.length - 1;
                }
            }

            
            for (let index = 0; index < res.assets.length; index++) {
                const asset = res.assets[index];
                let category = thisVm.getRootCategoryById(res.categories, asset.category_id);
                if(category == null){
                    let msg = `Error generating category distributiions, root category for asset (${asset.name} - ${asset.identifier_number}) cannot be found`;
                    alert(msg);
                    return false;
                }
                let catRefId = refDic[category.short_name];

                

                if(["Disposed","Lost Or Stolen"].indexOf(asset.status) == -1){
                    //we can calculate the depreciation
                    let valueDetails = Utils.getCurrentAssetValue(asset, true);
                    let depreciationAmount = valueDetails.totalDepreciation;
                    //Depreciation
                    series[depreciationIndex].data[catRefId] += depreciationAmount;
                }
                
                //purchases
                let purchaseAmount = parseFloat(asset.purchase_cost);
                series[purchaseIndex].data[catRefId] += purchaseAmount;
            }

            let indexedAssets = Utils.index(res.assets, "id");

            //impairments
            for (let index = 0; index < res.impairments.length; index++) {
                let impairment = res.impairments[index];
                let asset = indexedAssets[impairment.asset_id];
                let category = thisVm.getRootCategoryById(res.categories, asset.category_id);
                if(category == null){
                    let msg = `Error obtaining category distributiions, root category for asset (${asset.name} - ${asset.identifier_number}) cannot be found for an impairment entry`;
                    alert(msg);
                    return false;
                }
                let catRefId = refDic[category.short_name];

                let impairmentAmount = parseFloat(impairment.impairment_value_amount);
                series[impairmentIndex].data[catRefId] += impairmentAmount;
            }

            //maintenances
            for (let index = 0; index < res.maintenances.length; index++) {
                let maintenance = res.maintenances[index];
                let asset = indexedAssets[maintenance.asset_id];
                let category = thisVm.getRootCategoryById(res.categories, asset.category_id);
                if(category == null){
                    let msg = `Error obtaining category distributiions, root category for asset (${asset.name} - ${asset.identifier_number}) cannot be found for an impairment entry`;
                    alert(msg);
                    return false;
                }
                let catRefId = refDic[category.short_name];

                let maintenanceAmount = parseFloat(maintenance.total_amount);
                series[maintenanceIndex].data[catRefId] += maintenanceAmount;
            }

            //disposals
            //we dispose at the salvage amount
            for (let index = 0; index < res.disposal_assets.length; index++) {
                let disposal_asset = res.disposal_assets[index];
                let asset = indexedAssets[disposal_asset.asset_id];
                let category = thisVm.getRootCategoryById(res.categories, asset.category_id);
                if(category == null){
                    let msg = `Error obtaining category distributiions, root category for asset (${asset.name} - ${asset.identifier_number}) cannot be found for an impairment entry`;
                    alert(msg);
                    return false;
                }
                let catRefId = refDic[category.short_name];

                let disposalAmount = parseFloat(disposal_asset.salvage_amount);
                series[disposedIndex].data[catRefId] += disposalAmount;
            }


            thisVm.categoriesSeries = series;
            thisVm.categoriesChartOptions.xaxis.categories = xAxisColums;
            thisVm.renderChart = true;
        });
    },
    getRootCategoryById(categories, targetId){
        targetId = parseInt(targetId);
        for (let index = 0; index < categories.length; index++) {
            const category = categories[index];
            let catId = parseInt(category.id);
            if(catId == targetId){
                //check if this is a root category
                let parentCategoryId = parseInt(category.category_id);
                if(parentCategoryId == 0){
                    //this is a root category
                    return category;
                }else{
                    //this is a sub category
                    return this.getRootCategoryById(categories, parentCategoryId);
                }
            }
        }
        return null;
    }
  },
  mounted() {
    this.currency = JSON.parse(localStorage.getItem("config")).currency;
    this.loadDependencies();
  },
};
</script>