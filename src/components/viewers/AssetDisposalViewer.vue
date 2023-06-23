<template>
  <CardContainer
    :hasShadow="false"
    :show-title="false"
    :show-sub-title="false"
    classes="mb-0"
  >
    <div
      class="d-flex flex-column w-100 pt-0 pb-0 ps-1 pe-1"
      v-if="viewItem != null"
      :style="cmptStyle"
    >
      <div class="d-flex justify-content-between">
        <div class="flex-grow-1">
          <div
            class="inline-block text-muted me-1"
            style="min-width: 146px; display: inline-block"
          >
            STATUS:
          </div>
          <span class="text-uppercase">
            <b :class="'request-status-' + viewItem.status">{{
              viewItem.status
            }}</b>
          </span>
        </div>
        <div>
          <span class="text-muted me-1">POSTED DATE:</span>
          {{ phpTimeToDateStr(viewItem.time_inserted) }}
        </div>
      </div>

      <div class="d-flex justify-content-between">
        <div class="flex-grow-1">
          <div
            class="inline-block text-muted me-1"
            style="min-width: 146px; display: inline-block"
          >
            No. OF ASSETS:
          </div>
          <span class="text-uppercase">
            {{ viewItem.no_of_assets }}
          </span>
        </div>
        <div>
          <span class="text-muted me-1">SCHEDULED DATE:</span>
          {{ viewItem.scheduled_disposal_date }}
        </div>
        <div v-if="viewItem.status == 'disposed'" class="ms-2">
          <span class="text-muted me-1">DISPOSAL DATE:</span>
          {{ viewItem.disposal_date }}
        </div>
      </div>

      <h4 class="mt-1 border-bottom border-top pb-1 pt-1 mt-2 text-uppercase">
        <b class="text-muted me-2">RE:</b>
        <span v-if="viewContext == 'reject'">REJECTING - </span>
        <span v-if="viewContext == 'approve'">APPROVING - </span>
        <span v-if="viewContext == 'dispose'">DISPOSING -  </span>
        <span v-if="viewItem.title.length > 0">{{ viewItem.title }}</span>
        <span v-else>
           Disposal Of Assets from {{ viewItem.branch.name }}
        </span>
      </h4>

      <StepperContainer
        :is-tabs-mode="true"
        :is-verticle="true"
        :pages="pages"
        :active-page="activePageIndex"
        :is-disabled="isLoading"
        @on-page-change="onPageChange"
        v-if="viewContext == 'view'"
      >
        <div v-if="activePageIndex == 0" style="min-height: 400px" class="py-1">
          <DisposalDetailsTabViewer :view-item="viewItem" />
        </div>
        <div v-if="activePageIndex == 1" style="min-height: 400px" class="p-1">
            <div class="p-1">
                <MarkedAssetItem 
                    v-for="(disposalAsset, index) in disposalAssets"
                    :key="index"
                    :views="disposalAsset"
                    :show-delete-btn="false"
                />
            </div>
        </div>
        <div v-if="activePageIndex == 2" style="min-height: 400px" class="py-1">
            <div class="d-flex flex-row justify-content-start flex-wrap">
                <div 
                  v-for="(supportDocument, docIndex) in disposalSupportDocuments"
                  :key="docIndex"
                  class=" d-flex bg-light p-1 has-support-doc-download-btn"
                  style="margin: 5px; 5px; 0px; 0px;"
                  @click.prevent="onClickDownloadDoc(supportDocument)"
                  >
                  <div >
                    <span>
                      <i :class="iconRefs[supportDocument.type]" style="font-size:50px;" ></i>  
                    </span>
                  </div>
                  <div style="width:150px; padding: 0px 5px 0px 5px; ">
                    {{supportDocument.name}}
                  </div>
                  <div class="support-doc-download-btn">
                    <i class="far fa-arrow-alt-circle-down"></i>
                  </div>
                </div>
                
              </div>
        </div>
      </StepperContainer>
    </div>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import StepperContainer from "@/components/containers/StepperContainer.vue";
import DisposalDetailsTabViewer from "@/components/viewers/DisposalDetailsTabViewer.vue";
import MarkedAssetItem from "@/components/viewers/MarkedAssetItem.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

export default {
  components: {
    CardContainer,
    StepperContainer,
    DisposalDetailsTabViewer,
    MarkedAssetItem
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
    views: {
      type: Object,
      default: function () {
        return null;
      },
    },
    viewContext: {
      type: String,
      default: "view",
    },
  },
  data() {
    return {
      pages: [
        {
          title: "Transfer Details",
          number: 1,
          canSkip: false,
        },
        {
          title: "Selected Assets",
          number: 2,
          canSkip: false,
        },
        {
          title: "Supporting Docs",
          number: 3,
          canSkip: false,
        },
      ],
      activePageIndex: 0,
      viewItem: null,
      disposalAssets: [],
      disposalSupportDocuments: [],
      iconRefs: Utils.fileTypeIconRef(),
    };
  },
  methods: {
    ...Vm.fetch,
    ...Vm.loaders,
    loadDependencies() {
      let vm = this;
      vm.fetchItem("disposalDetails", vm.viewItem, function (thisVm, res) {
        thisVm.viewItem = res.disposal;
        thisVm.disposalAssets = res.disposalAssets;
        thisVm.disposalSupportDocuments = res.disposalSupportDocuments;
        //selected assets tab title count
        var numAsets = thisVm.disposalAssets.length;
        thisVm.pages[1].title += numAsets>0?` (${numAsets})`:'';
        //supporting documents tab title count
        var num = thisVm.disposalSupportDocuments.length;
        thisVm.pages[2].title += num>0?` (${num})`:'';
      });
    },
    onPageChange(page) {
      this.activePageIndex = parseInt(page);
    },
    phpTimeToDateStr(phpTime) {
        if(typeof phpTime == 'undefined' || !phpTime){
            return "- - - - - - - - -";
        }
      return Utils.phpTimeToJsDateString(phpTime);
    },
    onClickDownloadDoc(supportDocument) {
      let vm = this;
      vm.downloadFile(supportDocument.link);
    },
  },
  computed: {
    cmptStyle() {
      let s = "min-height: 500px;";
      if (this.viewContext != "view") {
        s = "min-height: 170px;";
        if (['approve', 'reject', 'issue', 'receive'].indexOf(this.viewContext) >= 0) {
          s = "min-height: 116px;";
        }
      }
      return s;
    },
  },
  mounted() {
    this.viewItem = {
      ...this.views,
    };
    this.loadDependencies();
  },
};
</script>

