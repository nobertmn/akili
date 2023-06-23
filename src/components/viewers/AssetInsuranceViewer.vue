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
            POLICY NUMBER:
          </div>
          <span class="text-uppercase">
            <b :class="'request-status-' + viewItem.policy_number">{{
              viewItem.policy_number
            }}</b>
          </span>
        </div>
        <div>
          <span class="text-muted me-1">ASSET INSURANCE</span>
        </div>
      </div>

      <div class="d-flex justify-content-between">
        <div class="flex-grow-1">
          <div
            class="inline-block text-muted me-1"
            style="min-width: 146px; display: inline-block"
          >
            SUPPLIER:
          </div>
          <span class="text-uppercase">
            {{ viewItem.supplier.name }}
          </span>
        </div>
        <div>
          <span class="text-muted me-1">#:</span>
          {{ viewItem.supplier.primary_contact }}
        </div>
      </div>

      <h4 class="mt-1 border-bottom border-top pb-1 pt-1 mt-2 text-uppercase">
        <b class="text-muted me-2">RE:</b>
        <span>
          Insucance for Assets - {{ viewItem.asset.name }}
          <i class="text-muted">{{ viewItem.asset.identifier_number }}</i>
        </span>
      </h4>

      <div>
        <div  class="py-1 w-50">
            <div class="text-start px-1 d-flex justify-content-between">
                <span>
                    START DATE #:
                    <b class="ms-1 text-uppercase"> {{ viewItem.start_date }}</b>
                </span>
                <span>
                    END DATE #:
                    <b class="ms-1 text-uppercase"> {{ viewItem.end_date }}</b>
                </span>
            </div>
        </div>
        <div  class="py-1 w-50">
            <div class="text-start px-1 d-flex justify-content-between">
                <span>
                    PREMIUM #:
                    <b class="ms-1 text-uppercase"> {{  comma(viewItem.premium) }}</b>
                </span>
                <span>
                    DEDUCTIBLE #:
                    <b class="ms-1 text-uppercase"> {{ comma(viewItem.deducatables)  }}</b>
                </span>
            </div>
        </div>
        <div class="d-flex flex-row">
            <div class="m-2 w-50">
                <div class="mb-2">
                    <h5>Coverage</h5>
                    <div class="p-1 bg-light">
                        {{viewItem.coverage}}
                    </div>
                </div>

                <div>
                    <h5>Limitations</h5>
                    <div class="p-1 bg-light">
                        {{viewItem.limitation}}
                    </div>
                </div>
            </div>
            <div class="m-2">
                <h5>Support Documents</h5>
                <div class="d-flex flex-row justify-content-start flex-wrap">
                    <div
                    v-for="(supportDocument, docIndex) in insuranceSupportDocuments"
                    :key="docIndex"
                    class="d-flex bg-light p-1 has-support-doc-download-btn"
                    style="margin: 5px; 5px; 0px; 0px;"
                    @click.prevent="onClickDownloadDoc(supportDocument)"
                    >
                    <div>
                        <span>
                        <i
                            :class="iconRefs[supportDocument.type]"
                            style="font-size: 50px"
                        ></i>
                        </span>
                    </div>
                    <div style="width: 150px; padding: 0px 5px 0px 5px">
                        {{ supportDocument.name }}
                    </div>
                    <div class="support-doc-download-btn">
                        <i class="far fa-arrow-alt-circle-down"></i>
                    </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

export default {
  components: {
    CardContainer
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
    }
  },
  data() {
    return {
      viewItem: null,
      insuranceSupportDocuments: [],
      iconRefs: Utils.fileTypeIconRef(),
    };
  },
  methods: {
    ...Vm.fetch,
    ...Vm.loaders,
    loadDependencies() {
      let vm = this;
      vm.fetchItem("insuranceDetails", vm.viewItem, function (thisVm, res) {
        thisVm.viewItem = res.insurance;
        thisVm.insuranceSupportDocuments = res.insuranceSupportDocuments;
        //supporting documents tab title count
        var num = thisVm.insuranceSupportDocuments.length;
        thisVm.pages[1].title += num > 0 ? ` (${num})` : "";
      });
    },
    phpTimeToDateStr(phpTime) {
      if (typeof phpTime == "undefined" || !phpTime) {
        return "- - - - - - - - -";
      }
      return Utils.phpTimeToJsDateString(phpTime);
    },
    onClickDownloadDoc(supportDocument) {
      let vm = this;
      vm.downloadFile(supportDocument.link);
    },
    comma(value){
        return Utils.comma(value);
    }
  },
  mounted() {
    this.viewItem = {
      ...this.views,
    };
    this.loadDependencies();
  },
};
</script>

