<template>
    <div
        class="left-side d-flex flex-row align-items-center"
        style="gap: 10px"
    >
        <DashboardValuePillViewer :viewItem="assetsPill" />

        <DashboardValuePillViewer :viewItem="purchaseValuePill" />

        <DashboardValuePillViewer :viewItem="assetsValuePill" />

        <DashboardValuePillViewer :viewItem="depreciationValuePill" />

        <DashboardValuePillViewer :viewItem="percentageDepValuePill" />
    </div>
</template>

<script>
import Utils from "@/utils/";
import DashboardValuePillViewer from "@/components/viewers/DashboardValuePillViewer.vue";
import Vm from "@/utils/Vm";

export default {
  components: {
    DashboardValuePillViewer,
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
      assetsPill: {
        link: "/registery/list",
        iconClass: "uil uil-building ",
        value: 0,
        label: "Available Assets",
        classes: "bg-primary",
      },
      purchaseValuePill: {
        link: "/registery/list",
        iconClass: "uil uil-bitcoin-circle",
        value: 0,
        label: "Purchase Cost",
        classes: "bg-info",
      },
      assetsValuePill: {
        link: "/registery/list",
        iconClass: "uil uil-bitcoin-circle",
        value: 0,
        label: "Value",
        classes: "bg-success",
      },
      depreciationValuePill: {
        link: "/registery/list",
        iconClass: "uil uil-bitcoin-circle",
        value: 0,
        label: "Depreciation",
        classes: "bg-warning",
      },
      percentageDepValuePill: {
        link: "/registery/list",
        iconClass: "uil uil-bitcoin-circle",
        value: 0,
        label: "% Depreciation",
        classes: "bg-danger",
      },
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadDependencies() {
      var vm = this;
      vm.fetch("dashboardDependencies", function (thisVm, res) {
        //assets count
        let availableAssetsCount = res.assets.nAvailable.length;
        thisVm.assetsPill.value =
          Utils.dashboardPillValue(availableAssetsCount);

        let assetsValue = 0;
        let purchaseCost = 0;
        for (let index = 0; index < res.assets.nAvailable.length; index++) {
          const asset = res.assets.nAvailable[index];
          let itemPurchCost = parseFloat(asset.purchase_cost);
          let currentValue = Utils.getCurrentAssetValue(asset);
          assetsValue += currentValue;
          purchaseCost += itemPurchCost;
        }
        //assets value
        thisVm.assetsValuePill.value = Utils.dashboardPillValue(assetsValue);
        //assets purchase cost
        thisVm.purchaseValuePill.value = Utils.dashboardPillValue(purchaseCost);
        //assets depreciation
        let depreciationAmount = purchaseCost - assetsValue;
        thisVm.depreciationValuePill.value =
          Utils.dashboardPillValue(depreciationAmount);
        //percentage depreciation
        let percentageDep = (depreciationAmount / purchaseCost) * 100;
        thisVm.percentageDepValuePill.value = percentageDep.toFixed(2);
      });
    },
  },
  mounted() {
    this.currency = JSON.parse(localStorage.getItem("config")).currency;
    this.loadDependencies();
  },
};
</script>


