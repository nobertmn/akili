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
      <div 
        class="d-flex justify-content-between"
        v-if="viewContext != 'receive'"
        >
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

      <div 
        class="d-flex justify-content-between"
        v-if="viewContext != 'receive'"
        >
        <div class="flex-grow-1">
          <div
            class="inline-block text-muted me-1"
            style="min-width: 146px; display: inline-block"
          >
            No. OF ITEMS:
          </div>
          <span class="text-uppercase">
            {{ viewItem.no_of_items }}
          </span>
        </div>
        <div>
          <span class="text-muted me-1">REQUIRED DATE:</span>
          {{ viewItem.required_date }}
        </div>
        <div v-if="viewItem.status == 'delivered'" class="ms-2">
          <span class="text-muted me-1">DELIVERY DATE:</span>
          {{ viewItem.delivery_date }}
        </div>
      </div>

      <h4 class="mt-1 border-bottom border-top pb-1 pt-1 mt-2 text-uppercase">
        <b class="text-muted me-2">RE:</b>
        <span v-if="viewContext == 'reject'">REJECTING - </span>
        <span v-if="viewContext == 'approve'">APPROVING - </span>
        <span v-if="viewContext == 'receive'">DELIVERY -  </span>
        <span> ACQUISITION ORDER #<b>{{viewItem.order_number}}</b></span>
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
          <PurchaseOrderDetailsTabViewer :view-item="viewItem" />
        </div>
        <div v-if="activePageIndex == 1" style="min-height: 400px" class="p-1">
            <div class="p-1x">
                <vue-good-table
                  :columns="orderItemColumns"
                  :rows="orderItems"
                  styleClass="vgt-table striped"
                  :line-numbers="true"
                  max-height="500px"
                >
                  <template #table-actions>
                    <div
                      class="d-flex justify-content-between align-items-center w-100 "
                    >
                      <div class="d-flex align-items-center me-2">&nbsp;</div>
                      <div class="pe-2">
                          <b>Total Amount: &nbsp;&nbsp;&nbsp;{{comma(viewItem.total_amount)}}</b>
                      </div>
                    </div>
                  </template>
                  <template #table-row="props">
                    <span
                      v-if="props.column.field == 'name'"
                      class="d-flex justify-content-start"
                    >
                        {{props.row.name}}
                        <ToolTip class="ms-1" style="margin-top: 2px;" :text="props.row.specifications" v-if="props.row.specifications.length > 0" />   
                    </span>
                  </template>
                </vue-good-table>
            </div>
        </div>
        <div v-if="activePageIndex == 2" style="min-height: 400px" class="py-1">
            <div class="d-flex flex-row justify-content-start flex-wrap">
                <div 
                  v-for="(supportDocument, docIndex) in orderSupportDocuments"
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
        <div v-if="activePageIndex == 3" style="min-height: 400px" class="py-1">
            <GRNViewer 
                :views="grnFormData" 
                :rows="grnFormDataItems" 
                :order="viewItem"
                v-if="grnFormData != null"
              />
        </div>
      </StepperContainer>
    </div>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import StepperContainer from "@/components/containers/StepperContainer.vue";
import PurchaseOrderDetailsTabViewer from "@/components/viewers/PurchaseOrderDetailsTabViewer.vue";
import MarkedAssetItem from "@/components/viewers/MarkedAssetItem.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import ToolTip from '@/components/ToolTip.vue';
import GRNViewer from '@/components/viewers/GRNViewer.vue';

let getFormData = Utils.getReceivePurchaseOrderFormDataFactory();
let getOrderItemFormData = Utils.getOrderItemFormDataFactory();

export default {
  components: {
    CardContainer,
    StepperContainer,
    PurchaseOrderDetailsTabViewer,
    MarkedAssetItem,
    ToolTip,
    GRNViewer
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
          title: "Order Details",
          number: 1,
          canSkip: false,
        },
        {
          title: "Order Items",
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
      orderItems: [],
      orderSupportDocuments: [],
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
          formatFn: function(value){
            return Utils.comma(value);
          },
          width: "100px"
        },
        {
          label: "Unit",
          field: "unit_price",
          type: "number",
          formatFn: function(value){
            return Utils.comma(value);
          },
        },
        {
          label: "Total",
          field: "line_total_amount",
          type: "number",
          formatFn: function(value){
            return Utils.comma(value);
          },
        }
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
      vm.fetchItem("purchaseOrderDetails", vm.viewItem, function (thisVm, res) {
        thisVm.viewItem = res.acquisitionOrder;
        thisVm.orderItems = res.orderItems;
        thisVm.orderSupportDocuments = res.orderSupportDocuments;
        //purchase items tab title count
        var numAsets = thisVm.orderItems.length;
        thisVm.pages[1].title += numAsets>0?` (${numAsets})`:'';
        //supporting documents tab title count
        var num = thisVm.orderSupportDocuments.length;
        thisVm.pages[2].title += num>0?` (${num})`:'';


        //grn preview
        console.log("thisVm.viewItem.status", thisVm.viewItem.status);
        if(thisVm.viewItem.status == "delivered"){
          thisVm.pages = [...thisVm.pages.concat({
            title: "GRN Preview",
            number: 4,
            canSkip: false,
          })];

          let newForm = getFormData();
          let receivePurchaseOrderFormData = Utils.fillValues(newForm, thisVm.viewItem);
          thisVm.grnFormData = receivePurchaseOrderFormData;
          var tempItemsFormData = [];
          for (let index = 0; index < thisVm.orderItems.length; index++) {
            const orderItem = thisVm.orderItems[index];
            let newForm = getOrderItemFormData();
            let entryItem = Utils.fillValues(newForm, orderItem);
            tempItemsFormData.push(entryItem);
          }
          thisVm.grnFormDataItems = tempItemsFormData
        }
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
    comma(value){
        return Utils.comma(value);
    }
  },
  computed: {
    cmptStyle() {
      let s = "min-height: 500px;";
      if (this.viewContext != "view") {
        s = "min-height: 170px;";
        if (['approve', 'reject', 'issue', 'receive'].indexOf(this.viewContext) >= 0) {
          s = "min-height: 116px;";
        }
        if (['receive'].indexOf(this.viewContext) >= 0) {
          s = "min-height: 50px;";
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