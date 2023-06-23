<template>
  <SimpleModal
    id="view-asset-maintenance-details-modal"
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
    size="lgx2"
  > 
    <AssetMaintenanceViewer
      :is-loading="isLoading"
      @on-show-loader="showLoader"
      @on-hide-loader="hideLoader"
      @on-session-expired="onSessionExpired"
      :views="itemToView"
      :view-context="context"
      v-if="itemToView != null"
    />

    <div v-if="context == 'reject' && itemToView != null" class="ms-2">
        <RejectAssetMaintenanceForm
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
        <ApproveAssetMaintenanceForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onApproveSuccess"
        />
    </div>
    <div v-if="context == 'recall' && itemToView != null" class="ms-2">
        <RecallAssetForMaintenanceForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onRecallSuccess"
        />
    </div>
    <div v-if="context == 'return' && itemToView != null " class="ms-2">
        <ReturnAssetForMaintenanceForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onReturnSuccess"
        />
    </div>
    <div v-if="context == 'schedule' && itemToView != null" class="ms-2">
        <ScheduleAssetMaintenanceForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onScheduleWorksSuccess"
        />
    </div>
    <div v-if="context == 'budget reject' && itemToView != null" class="ms-2">
        <RejectBudgetAssetMaintenanceForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onRejectMaintenanceBudgetSuccess"
        />
    </div>
    <div v-if="context == 'budget approve' && itemToView != null" class="ms-2">
        <ApproveBudgetAssetMaintenanceForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onApproveBudgetSuccess"
        />
    </div>
    <div v-if="context == 'finish' && itemToView != null" class="ms-2">
        <FinishAssetMaintenanceForm
            :edits="itemToView"
            :is-loading="isLoading"
            :pst="pst"
            @on-show-loader="showLoader"
            @on-hide-loader="hideLoader"
            @on-session-expired="onSessionExpired"
            @on-success="onFinishMaintenanceSuccess"
        />
    </div>

    <template #leftfooter="props">
        <MDBBtn
            style="height: 40px"
            v-if="itemToView != null && itemToView.status == 'pending' && context == 'view'"
            color="danger"
            @click.prevent="onClickRejectAssetMaintenanceBtn"
            class="ms-1 me-1 "
        >
            <i class="fas fa-times-circle"></i> Reject
        </MDBBtn>
        <MDBBtn
            style="height: 40px"
            v-if="itemToView != null && itemToView.status == 'pending' && context == 'view'"
            color="success"
            @click.prevent="onClickApproveAssetMaintenanceBtn"
            class="ms-1 me-1 "
        >
            <i class="far fa-check-circle"></i> Approve
        </MDBBtn>

        <MDBBtn
            style="height: 40px"
            v-if="itemToView != null && itemToView.status == 'approved' && context == 'view'"
            color="info"
            @click.prevent="onClickRecallAssetForMaintenanceWorksBtn"
            class="ms-1 me-1 "
        >
            <i class="far fa-check-circle"></i> Recall Asset
        </MDBBtn>

        <MDBBtn
            style="height: 40px"
            v-if="itemToView != null && itemToView.status == 'recalled' && context == 'view' "
            color="info"
            @click.prevent="onClickReturnAssetForMaintenanceWorksBtn"
            class="ms-1 me-1 "
        >
            <i class="far fa-check-circle"></i> Return Asset
        </MDBBtn>
        
        <MDBBtn
            style="height: 40px"
            v-if="itemToView != null && itemToView.status == 'returned' && context == 'view'"
            color="info"
            @click.prevent="onClickScheduleAssetsMaintenanceWorksBtn"
            class="ms-1 me-1 "
        >
            <i class="far fa-check-circle"></i> Schedule Maintenance Works
        </MDBBtn>

        <MDBBtn
            style="height: 40px"
            v-if="itemToView != null && itemToView.status == '' && context == 'view'"
            color="info"
            @click.prevent="onClickApproveMaintenanceBudgetBtn"
            class="ms-1 me-1 "
        >
            <i class="far fa-check-circle"></i> Approve Maintenance Budget
        </MDBBtn>

        <MDBBtn
            style="height: 40px"
            v-if="itemToView != null && itemToView.status == 'budgeted' && context == 'view'"
            color="danger"
            @click.prevent="onClickRejectMaintenanceBudgetBtn"
            class="ms-1 me-1 "
        >
            <i class="fas fa-times-circle"></i> Reject Maintenance Budget
        </MDBBtn>
        <MDBBtn
            style="height: 40px"
            v-if="itemToView != null && itemToView.status == 'budgeted' && context == 'view'"
            color="info"
            @click.prevent="onClickApproveMaintenanceBudgetBtn"
            class="ms-1 me-1 "
        >
            <i class="far fa-check-circle"></i> Approve Maintenance Budget
        </MDBBtn>

        <MDBBtn
            style="height: 40px"
            v-if="itemToView != null && itemToView.status == 'budget approved' && context == 'view'"
            color="info"
            @click.prevent="onClickFinishMaintenanceBtn"
            class="ms-1 me-1 "
        >
            <i class="far fa-check-circle"></i> Finish Maintenance
        </MDBBtn>
    </template>
  </SimpleModal>
</template> 

<script>
import SimpleModal from "@/components/modals/SimpleModal.vue";
import Vm from "@/utils/Vm";
import { useModelWrapper } from "@/utils/modelWrapper";
import AssetMaintenanceViewer from "@/components/viewers/AssetMaintenanceViewer.vue";
import RejectAssetMaintenanceForm from "@/components/forms/RejectAssetMaintenanceForm.vue";
import ApproveAssetMaintenanceForm from "@/components/forms/ApproveAssetMaintenanceForm.vue";
import RecallAssetForMaintenanceForm from "@/components/forms/RecallAssetForMaintenanceForm.vue";
import ReturnAssetForMaintenanceForm from "@/components/forms/ReturnAssetForMaintenanceForm.vue";
import ScheduleAssetMaintenanceForm from "@/components/forms/ScheduleAssetMaintenanceForm.vue";
import ApproveBudgetAssetMaintenanceForm from "@/components/forms/ApproveBudgetAssetMaintenanceForm.vue";
import RejectBudgetAssetMaintenanceForm from "@/components/forms/RejectBudgetAssetMaintenanceForm.vue";
import FinishAssetMaintenanceForm from "@/components/forms/FinishAssetMaintenanceForm.vue";
import { MDBBtn } from "mdb-vue-ui-kit";


export default {
  components: {
    SimpleModal,
    RejectAssetMaintenanceForm,
    AssetMaintenanceViewer,
    ApproveAssetMaintenanceForm,
    RecallAssetForMaintenanceForm,
    ReturnAssetForMaintenanceForm,
    ScheduleAssetMaintenanceForm,
    RejectBudgetAssetMaintenanceForm,
    ApproveBudgetAssetMaintenanceForm,
    FinishAssetMaintenanceForm,
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
        if(["reject",  "approve", "schedule", "recall", "return", "budget approve","budget reject"].indexOf(this.context) >= 0){
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
    onClickRejectAssetMaintenanceBtn() {
      this.context = "reject";
    },
    onRejectSuccess(updatedItem){
        this.onRefreshList(updatedItem.maintenance);
    },
    onClickApproveAssetMaintenanceBtn(){
        this.context = "approve";
    },
    onApproveSuccess(updatedItem){
        this.onRefreshList(updatedItem.maintenance);
    },
    onClickRecallAssetForMaintenanceWorksBtn(){
      this.context = "recall";
    },
    onRecallSuccess(updatedItem){
      this.onRefreshList(updatedItem.maintenance);
    },
    onClickReturnAssetForMaintenanceWorksBtn(){
      this.context = "return";
    },
    onReturnSuccess(updatedItem){
        this.onRefreshList(updatedItem.maintenance);
    },
    onClickScheduleAssetsMaintenanceWorksBtn(){
        this.context = "schedule";
    },
    onScheduleWorksSuccess(updatedItem){
        this.onRefreshList(updatedItem.maintenance);
    },
    onClickRejectMaintenanceBudgetBtn(){
      this.context = "budget reject";
    },
    onRejectMaintenanceBudgetSuccess(updatedItem){
        this.onRefreshList(updatedItem.maintenance);
    },
    onClickApproveMaintenanceBudgetBtn(){
        this.context = "budget approve";
    },
    onApproveBudgetSuccess(updatedItem){
        this.onRefreshList(updatedItem.maintenance);
    },
    onClickFinishMaintenanceBtn(){
      this.context = "finish";
    },
    onFinishMaintenanceSuccess(updatedItem){
        this.onRefreshList(updatedItem.maintenance);
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
      let title = "Asset Maintenance Details";
      if (this.context == "reject") {
        title += " - Reject Form";
      } else if (this.context == "approve") {
        title += " - Approve Form";
      } else if (this.context == "recall") {
        title += " - Recall Asset For Maintenance Works Form";
      } else if (this.context == "return") {
        title += " - Return Asset For Maintenance Works Form";
      } else if (this.context == "schedule") {
        title += " - Schedule Works Form";
      } else if (this.context == "approve budget") {
        title += " - Approve Scheduled Works Form";
      } else if (this.context == "reject budget") {
        title += " - Reject Scheduled Works Form";
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