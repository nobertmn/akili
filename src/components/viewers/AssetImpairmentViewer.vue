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
            Type:
          </div>
          <span class="text-uppercase">
            {{ viewItem.type }}
          </span>
        </div>
        <div>
          <span class="text-muted me-1">OCCURED DATE:</span>
          {{ viewItem.occured_date }}
        </div>
      </div>

      <h4 class="mt-1 border-bottom border-top pb-1 pt-1 mt-2 text-uppercase">
        <b class="text-muted me-2">RE:</b>
        <span v-if="viewContext == 'reject'">REJECTING - </span>
        <span v-if="viewContext == 'approve'">APPROVING - </span>
        <span v-else>
           Impairment Of Assets -  {{ viewItem.asset.name }} <i class="text-muted">{{ viewItem.asset.identifier_number }}</i>
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
          <ImpairmentDetailsTabViewer :view-item="viewItem" />
        </div>
        <div v-if="activePageIndex == 1" style="min-height: 400px" class="py-1">
            <div class="d-flex flex-row justify-content-start flex-wrap">
                <div 
                  v-for="(supportDocument, docIndex) in impairmentSupportDocuments"
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
import ImpairmentDetailsTabViewer from "@/components/viewers/ImpairmentDetailsTabViewer.vue";
import MarkedAssetItem from "@/components/viewers/MarkedAssetItem.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

export default {
  components: {
    CardContainer,
    StepperContainer,
    ImpairmentDetailsTabViewer,
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
          title: "Impairment Details",
          number: 1,
          canSkip: false,
        },
        {
          title: "Supporting Docs",
          number: 2,
          canSkip: false,
        },
      ],
      activePageIndex: 0,
      viewItem: null,
      impairmentSupportDocuments: [],
      iconRefs: Utils.fileTypeIconRef(),
    };
  },
  methods: {
    ...Vm.fetch,
    ...Vm.loaders,
    loadDependencies() {
      let vm = this;
      vm.fetchItem("impairmentDetails", vm.viewItem, function (thisVm, res) {
        thisVm.viewItem = res.impairment;
        thisVm.impairmentSupportDocuments = res.impairmentSupportDocuments;
         //supporting documents tab title count
        var num = thisVm.impairmentSupportDocuments.length;
        thisVm.pages[1].title += num>0?` (${num})`:'';
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
        if (['approve', 'reject'].indexOf(this.viewContext) >= 0) {
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

