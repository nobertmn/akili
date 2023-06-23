<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-90">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="mb-1">Asset Impairments</h4>
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
        <template #table-actions>
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="d-flex align-items-center me-2">
              &nbsp;
            </div>
            <IconButton
              kind="btn-primary"
              classes="p-8px mr-4px"
              :is-disabled="isLoading"
              @click="onClickAddBtn"
            >
              <i class="fas fa-plus"></i> Report New Impairment
            </IconButton>
          </div>
        </template>
        <template #emptystate>
          {{
            isLoading
              ? "Loading..."
              : rows.length == 0
              ? "There are no uploaded records"
              : ""
          }}
        </template>

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
              @on-click="onClickEditTableBtn(props.row)"
              :is-disabled="props.row.status != 'pending'"
            >
              <i class="fas fa-edit"></i>
            </IconButton>
            <IconButton
              kind="btn-danger"
              classes="p-4px"
              @on-click="onClickDeleteTableBtn(props.row)"
              :is-disabled="['pending', 'rejected'].indexOf(props.row.status) < 0"
            >
              <i class="fas fa-times-circle"></i>
            </IconButton>
          </span>
          <div
            v-else-if="props.column.field == 'status'"
            class="d-flex justify-content-end"
            :class="'request-status-' + props.row.status"
          >
            {{ props.row.status }}
          </div>
        </template>
      </vue-good-table>
    </div>

    <ImpairmentDetailsModal
      v-model="showViewDetailsModal"
      :is-loading="isLoading"
      :item-to-view="itemToView"
      @on-close-btn-click="showViewDetailsModal = false"
      @on-show-loader="showLoader"
      @on-hide-loader="hideLoader"
      @on-session-expired="onSessionExpired"
      @on-refresh-list="onRefreshList"
    />

    <SimpleModal
      :id="toBeEdited ? 'edit-impairment-modal' : 'add-impairment-modal'"
      :title="toBeEdited ? 'Edit Assets Impairment Form' : 'Report New Assets Impairment Form'"
      v-model="showFormModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      :ok-btn-text="toBeEdited ? 'Save' : 'Submit'"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showFormModal = false"
      @on-ok-btn-click="onClickModalOkBtn"
      size="lgx"
    >
      <AddAssetImpairmentForm
        :is-loading="isLoading"
        @on-show-loader="showLoader"
        @on-hide-loader="hideLoader"
        @on-session-expired="onSessionExpired"
        @on-success="onFormSuccess"
        :pst="pst"
        :edits="toBeEdited"
      />
    </SimpleModal>

    <SimpleModal
      id="delete-purchase-order-modal"
      title="Delete Assets Purchase Order Comfirmation"
      v-model="showDeleteComfirmModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      ok-btn-text="Delete"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showDeleteComfirmModal = false"
      @on-ok-btn-click="onClickDeleteModalOkBtn"
      okBtnColor="danger"
      okBtnWidth="120px"
      size="md"
      close-btn-text="cancel"
    >
      <DeleteConcentForm
        :is_loading="isLoading"
        :seed="{ acquisition_order: [itemToDelete.id] }"
        :pst="pst"
        :title="'This will remove order #' + itemToDelete.order_number"
        sub-title="Related Records To Be Removed:"
        @on-delete-success="onDeleteSuccess"
        @on-hide-loader="$emit('on-hide-loader')"
        @on-show-loader="$emit('on-show-loader')"
      />
    </SimpleModal>
  </div>
</template>

<script>
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import Button from "@/components/inputs/Button.vue";
import IconButton from "@/components/inputs/IconButton.vue";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import AddAssetImpairmentForm from "@/components/forms/AddAssetImpairmentForm.vue";
import DeleteConcentForm from "@/components/forms/DeleteConcentForm.vue";
import ImpairmentDetailsModal from "@/components/modals/ImpairmentDetailsModal.vue";


export default {
  components: {
    Button,
    IconButton,
    SimpleModal,
    AddAssetImpairmentForm,
    DeleteConcentForm,
    ImpairmentDetailsModal
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
          label: "Date",
          field: "occured_date",
        },
        {
          label: "Type",
          field: "type",
        },
        {
          label: "Identity",
          field: "asset.identifier_number",
        },
        {
          label: "Asset Name",
          field: "asset.name",
        },
        {
          label: "Value Amount",
          field: "impairment_value_amount",
          type: "number",
          tdClass: "pe-2",
          formatFn: function (value) {
            return Utils.comma(value);
          },
        },
        {
          label: "Status",
          field: "status",
        },
        {
          label: "",
          field: "btn",
        },
      ],
      rows: [],
      timeNow: new Date().getTime(),
      showFormModal: false,
      pst: 0,
      toBeEdited: null,
      showDeleteComfirmModal: false,
      itemToDelete: null,
      itemToView: null,
      showViewDetailsModal: false
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.delete,
    loadDependencies(callBack) {
      var vm = this;
      if(typeof callBack == 'undefined'){
        callBack = function(){};
      }
      vm.fetch("impairmentsDependencies", function (thisVm, res) {
        thisVm.rows = res.impairments;
        callBack();
      });
    },
    onClickAddBtn() {
      this.toBeEdited = null;
      this.itemToDelete = null;
      this.showFormModal = true;
    },
    onClickModalOkBtn() {
      this.pst += 1;
    },
    onFormSuccess() {
      this.showFormModal = false;
      this.loadDependencies();
    },
    onClickEditTableBtn(item) {
      //fetch assets extra fields
      this.toBeEdited = item;
      this.itemToDelete = null;
      this.showFormModal = true;
    },
    onClickDeleteTableBtn(item) {
      this.itemToDelete = item;
      this.toBeEdited = null;
      this.showDeleteComfirmModal = true;
    },
    onClickDeleteModalOkBtn() {
      this.pst += 1;
    },
    onDeleteSuccess() {
      this.itemToDelete = null;
      this.showDeleteComfirmModal = false;
      this.loadDependencies();
    },
    onClickViewTableBtn(item){
      this.itemToView = item;
      this.showViewDetailsModal = true;
    },
    onRefreshList(currentViewedItem){
      let vm = this;
      let temp = {... currentViewedItem};
      vm.showViewDetailsModal = false;
      vm.itemToView = null;
      vm.loadDependencies(function(){
        vm.itemToView = temp;
        vm.showViewDetailsModal = true;
      });
    },
    comma(amount) {
      return Utils.comma(amount);
    }
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>