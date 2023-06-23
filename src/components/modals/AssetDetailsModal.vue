<template>
  <SimpleModal
    id="view-requisition-modal"
    :title="cmptModalTitle"
    v-model="showViewDetailsModal"
    :show-close-btn="true"
    :close-btn-text="cmptCloseBtnText"
    :show-ok-btn="context!='view'"
    :ok-btn-text="context!='view'?'Submit':'Ok'"
    :show-top-close-btn="context=='view'"
    :is-headless="false"
    @on-close-btn-click="onCloseBtnClick"
    @on-ok-btn-click="onOkBtnClick"
    @on-hidden="onModalHidden"
    size="lg"
  >
    <AssetRequisitionViewer
      :is-loading="isLoading"
      @on-show-loader="showLoader"
      @on-hide-loader="hideLoader"
      @on-session-expired="onSessionExpired"
      :views="itemToView"
      :view-context="context"
      v-if="itemToView != null"
    />
    <div v-if="context == 'reject' && itemToView != null" class="ms-2">
        <RejectRequisitionForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onRejectSuccess"
        />
    </div>
    <div v-if="context == 'approve' && itemToView != null" class="ms-2">
        <ApproveRequisitionForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onApproveSuccess"
        />
    </div>
    <div v-if="context == 'collect' && itemToView != null" class="ms-2">
        <CollectRequisitionForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onCollectSuccess"
        />
    </div>
    <div v-if="context == 'return' && itemToView != null" class="ms-2">
        <ReturnRequisitionedAssetForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onCollectSuccess"
        />
    </div>
    <template #leftfooter="props">
      <MDBBtn
        style="height: 40px"
        v-if="itemToView != null && itemToView.status == 'pending' && context == 'view'"
        color="danger"
        @click.prevent="onClickRejectRequisitionBtn"
        class="ms-1 me-1 "
      >
        <i class="fas fa-times-circle"></i> Reject
      </MDBBtn>

      <MDBBtn
        style="height: 40px"
        v-if="itemToView != null && itemToView.status == 'pending' && context == 'view'"
        color="success"
        @click.prevent="onClickApproveRequisitionBtn"
        class="ms-1 me-1 "
      >
        <i class="far fa-check-circle"></i> Approve
      </MDBBtn>

      <MDBBtn
        style="height: 40px"
        v-if="itemToView != null && itemToView.status == 'approved' && context == 'view'"
        color="info"
        @click.prevent="onClickAllocateRequisitionBtn"
        class="ms-1 me-1 "
      >
        <i class="far fa-check-circle"></i> Allocate
      </MDBBtn>

      <MDBBtn
        style="height: 40px"
        v-if="itemToView != null && itemToView.status == 'collected' && context == 'view'"
        color="dark"
        @click.prevent="onClickReturnRequisitionBtn"
        class="ms-1 me-1 "
      >
        <i class="far fa-check-circle"></i> Return Asset
      </MDBBtn>
    </template>
  </SimpleModal>
</template>

<script>
import SimpleModal from "@/components/modals/SimpleModal.vue";
import AssetRequisitionViewer from "@/components/viewers/AssetRequisitionViewer.vue";
import RejectRequisitionForm from "@/components/forms/RejectRequisitionForm.vue";
import ApproveRequisitionForm from "@/components/forms/ApproveRequisitionForm.vue";
import CollectRequisitionForm from "@/components/forms/CollectRequisitionForm.vue";
import ReturnRequisitionedAssetForm from "@/components/forms/ReturnRequisitionedAssetForm.vue";
import IconButton from "@/components/inputs/IconButton.vue";
import Vm from "@/utils/Vm";
import { useModelWrapper } from "@/utils/modelWrapper";
import { MDBBtn } from "mdb-vue-ui-kit";

export default {
  components: {
    IconButton,
    SimpleModal,
    AssetRequisitionViewer,
    MDBBtn,
    RejectRequisitionForm,
    ApproveRequisitionForm,
    CollectRequisitionForm,
    ReturnRequisitionedAssetForm
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    itemToView: {
      type: Object,
      default: function () {
        return null;
      },
    },
  },
  data() {
    return {
      showViewDetailsModal: false,
      context: "view",
      pst: 0,
    };
  },
  watch: {
    modelValue(val) {
      if (val == true) {
        this.context = "view";
        this.showViewDetailsModal = true;
      }else{

      }
    },
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    onClickRejectRequisitionBtn() {
      this.context = "reject";
    },
    onRefreshList(updatedItem) {
        this.$emit('on-refresh-list', updatedItem);
    },
    onCloseBtnClick(){
        if(["reject",  "approve", "collect", "return"].indexOf(this.context) >= 0){
            //get out of the reject form context
            this.context = "view";
        }else{
            this.showViewDetailsModal = false;
            this.onCloseBtnClickSetup();
        }
    },
    onModalHidden(){
        if(this.context == 'reject'
        || this.context == 'approve'){
        }else{
            this.onModalHiddenSetup();
        } 
    },
    onOkBtnClick() {
        this.pst += 1;
    },
    onRejectSuccess(updatedItem){
        this.onRefreshList(updatedItem.requisition);
    },
    onClickApproveRequisitionBtn(){
        this.context = "approve";
    },
    onApproveSuccess(updatedItem){
        this.onRefreshList(updatedItem.requisition);
    },
    onClickAllocateRequisitionBtn(){
        this.context = "collect";
    },
    onCollectSuccess(updatedItem){
        this.onRefreshList(updatedItem.requisition);
    },
    onClickReturnRequisitionBtn(){
      this.context = "return";
    }
  },
  setup(props, { emit }) {
    return {
      inputDataModel: useModelWrapper(props, emit),
      onCloseBtnClickSetup() {
        props.inputDataModel = false;
        emit("on-close-btn-click");
      },
      onOkBtnClickSetup() {
        if (props.closeOnOkBtnClick == true) {
          props.inputDataModel = false;
          props.showViewDetailsModal = false;
        }
        emit("on-ok-btn-click");
      },
      onModalHiddenSetup() {
        props.inputDataModel = false;
        props.showViewDetailsModal = false;
        emit("on-close-btn-click");
      },
    };
  },
  computed: {
    cmptModalTitle() {
      let title = "Requisition Details";
      if (this.context == "reject") {
        title += " - Reject Form";
      }else if (this.context == "approve") {
        title += " - Approve Form";
      }else if (this.context == "collect") {
        title += " - Allocate Asset Form";
      }else if (this.context == "return") {
        title += " - Return Asset Form";
      }
      return title;
    },
    cmptCloseBtnText() {
      let text = "Close";
      if (this.context != "view") {
        text = "Cancel";
      }
      return text;
    },
  },
};
</script>