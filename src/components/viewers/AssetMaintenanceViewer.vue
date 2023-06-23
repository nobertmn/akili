<template>
  <CardContainer
    :hasShadow="false"
    :show-title="false"
    :show-sub-title="false"
    classes="mb-0"
  >
    <div
      class="d-flex flex-column w-100 pt-0 pb-0 ps-1 pe-1 scroll-550px"
      v-if="viewItem != null"
      :style="cmptStyle"
    >
      <div class="d-flex justify-content-between" v-if="viewContext != 'schedule'">
        <div class="flex-grow-1">
          <div
            class="inline-block text-muted me-1"
            style="min-width: 146px; display: inline-block"
          >
            STATUS:
          </div>
          <span class="text-uppercase">
            <b :class="'mntn request-status-' + viewItem.status">{{
              viewItem.status
            }}</b>
          </span>
        </div>
        <div>
          <span class="text-muted me-1">POSTED DATE:</span>
          {{ phpTimeToDateStr(viewItem.time_inserted) }}
        </div>
      </div>

      <div class="d-flex justify-content-between" v-if="viewContext != 'schedule'">
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
          <span class="text-muted me-1">SCHEDULED DATE:</span>
          {{ viewItem.scheduled_maintenance_date }}
        </div>
        <div v-if="viewItem.status == 'finished'" class="ms-2">
          <span class="text-muted me-1">PERFORMED DATE:</span>
          {{ viewItem.performed_maintenance_date }}
        </div>
      </div>

      <h4 class="mt-1 border-bottom border-top pb-1 pt-1 mt-2 text-uppercase">
        <b class="text-muted me-2">RE:</b>
        <span v-if="viewContext == 'reject'">REJECTING - </span>
        <span v-if="viewContext == 'approve'">APPROVING - </span>
        <span v-if="viewContext == 'recall'">RECALL ASSET FOR - </span>
        <span v-if="viewContext == 'return'">RETURN ASSET FOR - </span>
        <span v-if="viewContext == 'schedule'">SCHEDULE WORKS - </span>
        <span v-if="viewContext == 'approve budget'">APPROVING BUDGET - </span>
        <span v-if="viewContext == 'reject budget'">REJECTING BUDGET - </span>
        <span>
          MAINTENANCE  #<b
            >{{ viewItem.id }}-{{ viewItem.asset.name }}</b
          >
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
          <MaintenanceDetailsTabViewer :view-item="viewItem" />
        </div>
        <div v-if="activePageIndex == 1" style="min-height: 400px" class="py-1">
          <div class="d-flex flex-row justify-content-start flex-wrap">
            <div
              v-for="(supportDocument, docIndex) in maintenanceSupportDocuments"
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
        <div v-if="activePageIndex == 2" style="min-height: 400px" class="p-1">
          <vue-good-table
            :columns="performedWorksColumns"
            :rows="performedWorks"
            styleClass="vgt-table striped"
            :line-numbers="true"
            max-height="500px"
            compactModex
          >
            <template #table-actions>
              <div
                class="d-flex justify-content-between align-items-center w-100"
              >
                <div class="d-flex align-items-center me-2">&nbsp;</div>
                <div class="pe-2">
                  <b class="me-2"
                    >Total Days Gained: &nbsp;&nbsp;&nbsp;{{ comma(viewItem.total_life_time_gained_days) }}</b
                  >

                  <b>Total Cost: &nbsp;&nbsp;&nbsp;{{ comma(viewItem.total_amount) }}</b>
                </div>
              </div>
            </template>
          </vue-good-table>
        </div>
      </StepperContainer>
    </div>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import StepperContainer from "@/components/containers/StepperContainer.vue";
import MaintenanceDetailsTabViewer from "@/components/viewers/MaintenanceDetailsTabViewer.vue";
import MarkedAssetItem from "@/components/viewers/MarkedAssetItem.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import ToolTip from "@/components/ToolTip.vue";

let getFormData = Utils.getReceivePurchaseOrderFormDataFactory();
let getOrderItemFormData = Utils.getOrderItemFormDataFactory();

export default {
  components: {
    CardContainer,
    StepperContainer,
    MaintenanceDetailsTabViewer,
    MarkedAssetItem,
    ToolTip,
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
          title: "Maintenance Details",
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
      performedWorksColumns: [
        {
          label: "Name",
          field: "name",
          sortable: false,
        },
        {
          label: "Quantity",
          field: "quantity",
          type: "number",
          thClass:"text-end",
          tdClass:"pe-2",
          sortable: false,
          formatFn: function (value) {
            return Utils.comma(value);
          },
        },
        {
          label: "Unit Cost",
          field: "unit_cost",
          type: "number",
          sortable: false,
          thClass:"text-end",
          tdClass:"pe-2",
          formatFn: function (value) {
            return Utils.comma(value);
          },
        },
        {
          label: "Total Amount",
          field: "line_total_amount",
          type: "number",
          thClass:"text-end",
          tdClass:"pe-2",
          sortable: false,
          formatFn: function (value) {
            return Utils.comma(value);
          },
        }
      ],

      viewItem: null,
      performedWorks: [],
      maintenanceSupportDocuments: [],

      iconRefs: Utils.fileTypeIconRef(),
      orderItemColumns: [
        {
          label: "Item",
          field: "name",
        },
        {
          label: "Qty",
          field: "quantity",
          type: "number",
          formatFn: function (value) {
            return Utils.comma(value);
          },
          width: "100px",
        },
        {
          label: "Unit",
          field: "unit_price",
          type: "number",
          formatFn: function (value) {
            return Utils.comma(value);
          },
        },
        {
          label: "Total",
          field: "line_total_amount",
          type: "number",
          formatFn: function (value) {
            return Utils.comma(value);
          },
        },
      ],
      grnFormData: null,
      grnFormDataItems: null,
      receivedBy: "", //will be provided later
    };
  },
  methods: {
    ...Vm.fetch,
    ...Vm.loaders,
    loadDependencies() {
      let vm = this;
      vm.fetchItem("maintenanceDetails", vm.viewItem, function (thisVm, res) {
        console.log("Here t");
        thisVm.viewItem = res.maintenance;
        thisVm.performedWorks = res.performedWorks;
        thisVm.maintenanceSupportDocuments = res.maintenanceSupportDocuments;
        
        //supporting documents tab title count
        var num = thisVm.maintenanceSupportDocuments.length;
        thisVm.pages[1].title += num > 0 ? ` (${num})` : "";

        let status = res.maintenance.status;
        //if its at the status of works
        if(['budgeted', 'budget approved', 'budget rejected', 'finished'].indexOf(status) >= 0){
            thisVm.pages =  thisVm.pages.concat([
                {
                    title: "Works Schedule",
                    number: 3,
                    canSkip: false,
                }
            ]);

            //scheduled works items tab title count
            var numWorks = res.performedWorks.length;
            thisVm.pages[2].title += numWorks > 0 ? ` (${numWorks})` : "";
        }
      });
    },
    onPageChange(page) {
      this.activePageIndex = parseInt(page);
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
    comma(value) {
      return Utils.comma(value);
    },
  },
  computed: {
    cmptStyle() {
      let s = "min-height: 500px;";
      if (this.viewContext != "view") {
        s = "min-height: 170px;";
        if (
          ["approve", "reject", "issue", "receive"].indexOf(this.viewContext) >=
          0
        ) {
          s = "min-height: 116px;";
        }
        if (["schedule"].indexOf(this.viewContext) >= 0) {
          s = "min-height: 50px;";
        }
      }
      return s;
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