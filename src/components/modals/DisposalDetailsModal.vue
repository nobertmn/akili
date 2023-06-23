<template>
  <SimpleModal
    id="view-disposal-details-modal"
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
    <AssetDisposalViewer
      :is-loading="isLoading"
      @on-show-loader="showLoader"
      @on-hide-loader="hideLoader"
      @on-session-expired="onSessionExpired"
      :views="itemToView"
      :view-context="context"
      v-if="itemToView != null"
    />
    <div v-if="context == 'reject' && itemToView != null" class="ms-2">
        <RejectDisposalForm
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
        <ApproveDisposalForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onApproveSuccess"
        />
    </div>
    <div v-if="context == 'dispose' && itemToView != null" class="ms-2">
        <DisposeOffAssetsForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onDisposeSuccess"
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
            @click.prevent="onClickDisposeAssetsBtn"
            class="ms-1 me-1 "
        >
            <i class="far fa-check-circle"></i> Dispose
        </MDBBtn>
    </template>

  </SimpleModal>
</template>

<script>
import SimpleModal from "@/components/modals/SimpleModal.vue";
import Vm from "@/utils/Vm";
import { useModelWrapper } from "@/utils/modelWrapper";
import AssetDisposalViewer from "@/components/viewers/AssetDisposalViewer.vue";
import RejectDisposalForm from "@/components/forms/RejectDisposalForm.vue";
import ApproveDisposalForm from "@/components/forms/ApproveDisposalForm.vue";
import DisposeOffAssetsForm from "@/components/forms/DisposeOffAssetsForm.vue";
import { MDBBtn } from "mdb-vue-ui-kit";


export default {
  components: {
    SimpleModal,
    AssetDisposalViewer,
    ApproveDisposalForm,
    DisposeOffAssetsForm,
    RejectDisposalForm,
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
        this.onRefreshList(updatedItem.disposal);
    },
    onClickApproveTransferBtn(){
        this.context = "approve";
    },
    onApproveSuccess(updatedItem){
        this.onRefreshList(updatedItem.disposal);
    },
    onClickDisposeAssetsBtn(){
        this.context = "dispose";
    },
    onDisposeSuccess(updatedItem){
        this.onRefreshList(updatedItem.disposal);
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
      let title = "Disposal Details";
      if (this.context == "reject") {
        title += " - Reject Form";
      } else if (this.context == "approve") {
        title += " - Approve Form";
      } else if (this.context == "dispose") {
        title += " - Disposal Form";
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