<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-90">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="mb-1">Asset's Awaiting Recording</h4>
      </div>

      <vue-good-table
        :columns="columns"
        :rows="rows"
        styleClass="vgt-table striped"
        :line-numbers="true"
        max-height="500px"
        :fixed-header="true"
        compactMode
      >
        <template #table-row="props">
          <span
            v-if="props.column.field == 'btn'"
            class="d-flex justify-content-end"
          >
            <IconButton
              kind="btn-success"
              classes="p-4px mr-4px"
              @on-click="onClickViewTableBtn(props.row)"
            >
              <i class="fas fa-eye"></i>
            </IconButton>
            <IconButton
              kind="btn-warning"
              classes="p-4px mr-4px"
              @on-click="onClickRecordTableBtn(props.row)"
              :is-disabled="props.row.status == 'finished'"
            >
              <i class="fas fa-edit"></i>
            </IconButton>
          </span>
          <span
            v-else-if="props.column.field == 'status'"
            class="d-flex justify-content-end"
            :class="'acquisition-receive-item-status-' + props.row.status"
          >
             {{ props.row.status }}
          </span>
        </template>
      </vue-good-table>
    </div>

    <SimpleModal
      id="record-asset-view-modal"
      title="Recorded Acquired Asset Details"
      v-model="showViewDetailsModal"
      :show-close-btn="true"
      close-btn-text="Close"
      :show-ok-btn="false"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showViewDetailsModal = false"
      size="lgx2"
    >
      <AssetRecodingViewer
        :is-loading="isLoading"
        @on-show-loader="showLoader"
        @on-hide-loader="hideLoader"
        @on-session-expired="onSessionExpired"
        @on-refresh-list="onRefreshList"
        :views="itemToView"
      />
    </SimpleModal>

    <SimpleModal
      id="record-asset-modal"
      title="Record Acquired Asset"
      v-model="showFormModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      :ok-btn-text="toBeEdited ? 'Save' : 'Submit'"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showFormModal = false"
      @on-ok-btn-click="onClickModalOkBtn"
      size="lgx2"
    >
      <RecordAquiredAssetForm
        :is-loading="isLoading"
        @on-show-loader="showLoader"
        @on-hide-loader="hideLoader"
        @on-session-expired="onSessionExpired"
        @on-success="onFormSuccess"
        :pst="pst"
        :edits="toBeEdited"
      />
    </SimpleModal>
  </div>
</template>

<script>
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import IconButton from "@/components/inputs/IconButton.vue";
import RecordAquiredAssetForm from "@/components/forms/RecordAquiredAssetForm.vue";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import AssetRecodingViewer from "@/components/viewers/AssetRecodingViewer.vue";


export default {
  components: {
      SimpleModal,
      IconButton,
      RecordAquiredAssetForm,
      AssetRecodingViewer
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      columns: [
        {
          label: "Item Name",
          field: "name",
        },
        {
          label: "Order Number",
          field: "acquisition_order.order_number",
        },
        {
          label: "Grn Number",
          field: "acquisition_order.grn_number",
        },
        {
          label: "Pkg Label",
          field: "receive_package_identity_label",
        },
        {
          label: "Received",
          field: "quantity_delivered",
          type: "number",
          tdClass: "pe-3"
        },
        {
          label: "Recorded",
          field: "quantity_recorded",
          type: "number",
          tdClass: "pe-3"
        },
        {
          label: "Remaining",
          field: "quantity_remaining",
          type: "number",
          tdClass: "pe-3"
        },
        {
          label: "Status",
          field: "status",
          type: "number"
          
        },
        {
          label: "",
          field: "btn",
        },
      ],
      rows: [],
      showFormModal: false,
      pst: 0,
      toBeEdited: null,
      itemToView: null,
      showViewDetailsModal: false,
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadDependencies(callBack) {
      var vm = this;
      if(typeof callBack == 'undefined'){
        callBack = function(){};
      }
      vm.fetch("assetRecordingsDependencies", function (thisVm, res) {
        thisVm.rows = res.orderItems;
        callBack();
      });
    },
    onClickViewTableBtn(item){
      this.itemToView = item;
      this.showViewDetailsModal = true;
    },
    onClickRecordTableBtn(item) {
      this.toBeEdited = item;
      this.itemToView = null;
      this.showFormModal = true;
    },
    onClickModalOkBtn() {
      this.pst += 1;
    },
    onFormSuccess() {
      this.toBeEdited = null;
      this.itemToView = null;
      this.showFormModal = false;
      this.loadDependencies();
    },
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>