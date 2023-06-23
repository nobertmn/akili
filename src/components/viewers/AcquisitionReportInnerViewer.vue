<template>
  <div class="d-flex  py-2" v-if="item != null">
    <div class="w-100" >
        <div class="bg-primary p-1 round text-white mb-1 fs-6"  v-if="item.id.indexOf('ord') == 0" >
            <b>Purchase Order Details</b>
        </div>
        <AssetPurchaseOrderViewer
            v-if="item.id.indexOf('ord') == 0"
            :is-loading="isLoading"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            :views="item.acquisitionOrder"
        />
        <div class="bg-primary p-1 round text-white mb-1 fs-6"  v-if="orderRecordedAssets.length > 0" >
            <b>Recorded ({{orderRecordedAssets.length}}) Asset{{orderRecordedAssets.length > 1?'s':''}} On {{orderRecordedAssets[0].recorded_date}}</b>
        </div>
        <div class="d-flex " v-if="orderRecordedAssets.length > 0" >
            <AcqRptRecordedAssetsViewer
                :rows="orderRecordedAssets"
            />
        </div>
    </div>
  </div>
</template>

<script>
import Utils from "@/utils/";
import Vm from "@/utils/Vm";
import AssetPurchaseOrderViewer from "@/components/viewers/AssetPurchaseOrderViewer.vue";
import AcqRptRecordedAssetsViewer from "@/components/viewers/AcqRptRecordedAssetsViewer.vue";

export default {
  components: {
    AssetPurchaseOrderViewer,
    AcqRptRecordedAssetsViewer
  },
  props: {
    item: {
      type: Object,
      default: function () {
        return null;
      },
    }
  },
  data() {
    return {
      orderRecordedAssets: []
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadDependencies() {
      let vm = this;
      vm.fetchItem("acquisitionReportRecordedItemsDetails", vm.item.level3Data[0], function (thisVm, res) {
        thisVm.orderRecordedAssets = res.orderRecordedAssets;
      });
    },
    comma(value) {
      return Utils.comma(value);
    }
  },
  mounted() {
    if(this.item.level3Data && this.item.level3Data.length > 0){
        this.loadDependencies();
    }
  },
};
</script>