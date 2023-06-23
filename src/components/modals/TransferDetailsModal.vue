<template>
  <SimpleModal
    id="view-transfer-details-modal"
    :title="cmptModalTitle"
    v-model="showViewDetailsModal"
    :show-close-btn="true"
    :close-btn-text="cmptCloseBtnText"
    :show-ok-btn="context != 'view'"
    :ok-btn-text="context != 'view' ? 'Submit' : 'Ok'"
    :show-top-close-btn="context == 'view'"
    :is-headless="false"
    @on-close-btn-click="onCloseBtnClick"
    @on-ok-btn-click="onOkBtnClick"
    @on-hidden="onModalHidden"
    size="lgx"
  > 
    
    <AssetTransferViewer
      :is-loading="isLoading"
      @on-show-loader="showLoader"
      @on-hide-loader="hideLoader"
      @on-session-expired="onSessionExpired"
      :views="itemToView"
      :view-context="context"
      v-if="itemToView != null"
    />
    <div v-if="context == 'reject' && itemToView != null" class="ms-2">
        <RejectTransferForm
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
        <ApproveTransferForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onApproveSuccess"
        />
    </div>
    <div v-if="context == 'issue' && itemToView != null" class="ms-2">
        <IssueTransferForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onIssueSuccess"
        />
    </div>
    <div v-if="context == 'receive' && itemToView != null" class="ms-2">
        <ReceiveTransferForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onIssueSuccess"
        />
    </div>
    <template #leftfooter="props">
        <MDBBtn
            style="height: 40px"
            v-if="itemToView != null && itemToView.status == 'pending' && context == 'view'"
            color="danger"
            @click.prevent="onClickRejectTransferBtn"
            class="ms-1 me-1 "
        >
            <i class="fas fa-times-circle"></i> Reject
        </MDBBtn>
        <MDBBtn
            style="height: 40px"
            v-if="itemToView != null && itemToView.status == 'pending' && context == 'view'"
            color="success"
            @click.prevent="onClickApproveTransferBtn"
            class="ms-1 me-1 "
        >
            <i class="far fa-check-circle"></i> Approve
        </MDBBtn>
        
        <MDBBtn
            style="height: 40px"
            v-if="itemToView != null && itemToView.status == 'approved' && context == 'view'"
            color="info"
            @click.prevent="onClickIssueTransferBtn"
            class="ms-1 me-1 "
        >
            <i class="far fa-check-circle"></i> Issue
        </MDBBtn>

        <MDBBtn
            style="height: 40px"
            v-if="itemToView != null && itemToView.status == 'issued' && context == 'view'"
            color="dark"
            @click.prevent="onClickReceiveTransferBtn"
            class="ms-1 me-1 "
        >
            <i class="far fa-check-circle"></i> Receive Transfer
        </MDBBtn>
    </template>

  </SimpleModal>
</template>

<script>
import SimpleModal from "@/components/modals/SimpleModal.vue";
import Vm from "@/utils/Vm";
import { useModelWrapper } from "@/utils/modelWrapper";
import AssetTransferViewer from "@/components/viewers/AssetTransferViewer.vue";
import RejectTransferForm from "@/components/forms/RejectTransferForm.vue";
import ApproveTransferForm from "@/components/forms/ApproveTransferForm.vue";
import IssueTransferForm from "@/components/forms/IssueTransferForm.vue";
import ReceiveTransferForm from "@/components/forms/ReceiveTransferForm.vue";
import { MDBBtn } from "mdb-vue-ui-kit";


export default {
  components: {
    SimpleModal,
    AssetTransferViewer,
    RejectTransferForm,
    ApproveTransferForm,
    IssueTransferForm,
    ReceiveTransferForm,
    MDBBtn
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
    }
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
    onRefreshList(updatedItem) {
        this.$emit('on-refresh-list', updatedItem);
    },
    onCloseBtnClick(){
        if(["reject",  "approve", "issue", "return"].indexOf(this.context) >= 0){
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
    onClickRejectTransferBtn() {
      this.context = "reject";
    },
    onRejectSuccess(updatedItem){
        this.onRefreshList(updatedItem.transfer);
    },
    onClickApproveTransferBtn(){
        this.context = "approve";
    },
    onApproveSuccess(updatedItem){
        this.onRefreshList(updatedItem.transfer);
    },
    onClickIssueTransferBtn(){
        this.context = "issue";
    },
    onIssueSuccess(updatedItem){
        this.onRefreshList(updatedItem.transfer);
    },
    onClickReceiveTransferBtn(){
        this.context = "receive";
    },
    onReceiveSuccess(updatedItem){
        this.onRefreshList(updatedItem.transfer);
    },
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
      let title = "Transfer Details";
      if (this.context == "reject") {
        title += " - Reject Form";
      } else if (this.context == "approve") {
        title += " - Approve Form";
      } else if (this.context == "issue") {
        title += " - Issue Form";
      } else if (this.context == "receive") {
        title += " - Receive Transfered Assets Form";
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