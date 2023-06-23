<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-100 px-1">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="mb-1">Expense Entries</h4>
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
        <template #table-actions >
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="d-flex align-items-center me-2 ">
              &nbsp;
            </div>
            <IconButton
              kind="btn-primary"
              classes="p-8px mr-4px"
              :is-disabled="isLoading"
              @click="onClickAddBtn"
            >
              <i class="fas fa-plus"></i> Record Expense
            </IconButton>
          </div>
        </template>
        <template #table-row="props">
          <span
            v-if="props.column.field == 'btn'"
            class="d-flex justify-content-end"
          >
            <IconButton
              kind="btn-warning"
              classes="p-4px mr-4px"
              @on-click="onClickEditTableBtn(props.row)"
            >
              <i class="fas fa-edit"></i>
            </IconButton>
            <IconButton
              kind="btn-danger"
              classes="p-4px"
              @on-click="onClickDeleteTableBtn(props.row)"
            >
              <i class="fas fa-times-circle"></i>
            </IconButton>
          </span>
          <span
            v-else-if="props.column.field == 'expense_category.name'"
          >
            {{ props.row.expense_category.name }}
            <ToolTip class="ms-1" style="margin-top: 2px;" :text="props.row.description" v-if="props.row.description != null && props.row.description.toString().length > 0" /> 
          </span>
          <span
            v-else-if="props.column.field == 'debit_account.name'"
            class="d-flex justify-content-end text-sm"
            style="padding-top: 3px;"
          >
            {{ props.row.debit_account.ref_no + ' - ' + props.row.debit_account.name  }}
          </span>
          <span
            v-else-if="props.column.field == 'credit_account.name'"
            class="d-flex justify-content-end text-sm"
            style="padding-top: 3px;"
          >
            {{ props.row.credit_account.ref_no + ' - ' + props.row.credit_account.name }}
          </span>
        </template>
      </vue-good-table>
    </div>

    <SimpleModal
      :id="toBeEdited ? 'edit-expense-modal' : 'add-expense-modal'"
      :title="toBeEdited ? 'Edit Expense' : 'Record New Expense'"
      v-model="showFormModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      :ok-btn-text="toBeEdited ? 'Save' : 'Submit'"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showFormModal = false"
      @on-ok-btn-click="onClickModalOkBtn"
      size="lg"
    >
      <AddExpenseForm
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
      id="delete-expense-modal"
      title="Delete Expense"
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
        :seed="{ expense: [itemToDelete.id] }"
        :pst="pst"
        :title="`This will remove <b>${itemToDelete.name}</b>, are you sure ?`"
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
import IconButton from "@/components/inputs/IconButton.vue";
import AddExpenseForm from "@/components/forms/AddExpenseForm.vue";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import DeleteConcentForm from "@/components/forms/DeleteConcentForm.vue";
import ToolTip from '@/components/ToolTip.vue'

export default {
  components: {
      IconButton,
      AddExpenseForm,
      SimpleModal,
      DeleteConcentForm,
      ToolTip
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
          field: "issued_date",
        },
        {
          label: "Amount",
          field: "amount",
          type: "number",
          formatFn: function(value){
            return Utils.comma(value);
          },
        },
        {
          label: "Name",
          field: "expense_category.name",
        },
        {
          label: "Branch",
          field: "branch.name",
        },
        {
          label: "Debit",
          field: "debit_account.name",
          sortable: false,
          thClass: 'text-end',
        },
        {
          label: "Credit",
          field: "credit_account.name",
          sortable: false,
          thClass: 'text-end',
        },
        {
          label: "",
          field: "btn",
          sortable: false
        },
      ],
      rows: [],
      showFormModal: false,
      pst: 0,
      toBeEdited: null,
      showDeleteComfirmModal: false,
      itemToDelete: null,
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.delete,
    ...Vm.loaders,
    loadDependencies() {
      var vm = this;
      vm.fetch("accountingExpensesDependencies", function (thisVm, res) {
        thisVm.rows = res.expenses;
      });
    },
    onClickAddBtn() {
      this.toBeEdited = null;
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
      this.toBeEdited = item;
      this.showFormModal = true;
    },
    onClickDeleteTableBtn(item) {
      this.itemToDelete = item;
      this.showDeleteComfirmModal = true;
    },
    onDeleteSuccess() {
      this.itemToDelete = null;
      this.showDeleteComfirmModal = false;
      this.loadDependencies();
    },
    onClickDeleteModalOkBtn() {
      this.pst += 1;
    },
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>