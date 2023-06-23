<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-90">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="mb-1">Asset Acquisitions </h4>
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
              <i class="fas fa-plus"></i> Make New Order
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
            <span
              class="outdated"
              v-if="
                props.row.status == 'pending' &&
                (parseFloat(props.row.required_date_time)*1000) < timeNow
              "
            >
              Outdated
            </span>
            <span v-else>
              {{ props.row.status }}
            </span>
          </div>
          <div
            v-else-if="props.column.field == 'required_date'"
            class="d-flex justify-content-end"
          >
            {{props.row.required_date}}
          </div>
          <div
            v-else-if="props.column.field == 'no_of_items'"
            class="d-flex justify-content-center"
          >
            {{comma(props.row.no_of_items)}}
          </div>
          <div
            v-else-if="props.column.field == 'total_amount'"
            class="d-flex justify-content-end"
          >
            {{comma(props.row.total_amount)}}
          </div>
          <template v-else>
            {{ props.formattedRow[props.column.field] }}
          </template>
        </template>
      </vue-good-table>
    </div>

    <PurchaseOrderDetailsModal
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
      :id="toBeEdited ? 'add-order-modal' : 'add-order-modal'"
      :title="toBeEdited ? 'Edit Assets Purchase Form' : 'Create New Assets Purchase Form'"
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
      <AddPurchaseOrderForm
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
import AddPurchaseOrderForm from "@/components/forms/AddPurchaseOrderForm.vue";
import DeleteConcentForm from "@/components/forms/DeleteConcentForm.vue";
import PurchaseOrderDetailsModal from "@/components/modals/PurchaseOrderDetailsModal.vue";


export default {
  components: {
    Button,
    IconButton,
    SimpleModal,
    AddPurchaseOrderForm,
    DeleteConcentForm,
    PurchaseOrderDetailsModal
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
          label: "Order Number",
          field: "order_number",
        },
        {
          label: "Branch",
          field: "branch.name",
        },
        {
          label: "Supplier",
          field: "supplier.name",
        },
        {
          label: "Required Date",
          field: "required_date",
        },
        {
          label: "Items",
          field: "no_of_items",
        },
        {
          label: "Total Amount",
          field: "total_amount",
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
      vm.fetch("purchaseOrderDependencies", function (thisVm, res) {
        thisVm.rows = res.acquisitionOrders;
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