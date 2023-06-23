<template>
  <div class="d-flex flex-row justify-content-between">
    <div class="p-1 me-1">
        <AcquiredItemViewer :views="views" />
    </div>
    <div class="flex-grow-1">
      <RecordedOrderAssetViewer 
        v-for="(orderRecordedAsset, index) in orderRecordedAssets"
        :key="index"
        :views="orderRecordedAsset"
      />
    </div>
  </div>
</template>

<script>
import AddAssetForm from "@/components/forms/AddAssetForm.vue";
import AcquiredItemViewer from "@/components/viewers/AcquiredItemViewer.vue";
import RecordedOrderAssetViewer from "@/components/viewers/RecordedOrderAssetViewer.vue"
import Vm from "@/utils/Vm";
import Utils from "@/utils";

export default {
  components: {
    AddAssetForm,
    AcquiredItemViewer,
    RecordedOrderAssetViewer
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    classes: {
      type: String,
      default: "",
    },
    pst: {
      type: Number,
      default: 0,
    },
    views: {
      type: Object,
      default: function () {
        return null;
      },
    },
  },
  data() {
    return {
      orderRecordedAssets: [],
    };
  },
  methods: {
    ...Vm.fetch,
    ...Vm.loaders,
    loadDependencies() {
      var vm = this;
      vm.fetchItem("recordedAssetsListDetails", vm.views, function (thisVm, res) {
        thisVm.orderRecordedAssets = res.orderRecordedAssets;
      });
    },
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>