<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="">
        <div class="d-flex justify-content-between">
          <SelectInput
            :id="formData.expenseCategoryId.id"
            :label="formData.expenseCategoryId.label"
            :tooltip="formData.expenseCategoryId.tooltip"
            :errors="formData.expenseCategoryId.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.expenseCategoryId.value"
            :items="expenseCategories"
            classes="ps-0 pe-1"
          />

          <SelectInput
            :id="formData.branchId.id"
            :label="formData.branchId.label"
            :tooltip="formData.branchId.tooltip"
            :errors="formData.branchId.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.branchId.value"
            :items="branches"
            classes="ps-1 pe-0"
          />
        </div>
        <div class="d-flex justify-content-between">
          <TextInput
            :id="formData.amount.id"
            :label="formData.amount.label"
            :tooltip="formData.amount.tooltip"
            :errors="formData.amount.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.amount.value"
            classes="ps-0 pe-1"
          />

          <TextInput
            :id="formData.issuedDate.id"
            :label="formData.issuedDate.label"
            :errors="formData.issuedDate.errors"
            :is-disabled="isLoading || isFormSubmitting"
            type="date"
            v-model="formData.issuedDate.value"
            classes="ps-1 pe-0"
          />
        </div>
        <div class="d-flex justify-content-between">
          <SelectInput
            :id="formData.debitAccountId.id"
            :label="formData.debitAccountId.label"
            :tooltip="formData.debitAccountId.tooltip"
            :errors="formData.debitAccountId.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.debitAccountId.value"
            :items="accounts"
            classes="ps-0 pe-1"
          />

          <SelectInput
            :id="formData.creditAccountId.id"
            :label="formData.creditAccountId.label"
            :tooltip="formData.creditAccountId.tooltip"
            :errors="formData.creditAccountId.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.creditAccountId.value"
            :items="accounts"
            classes="ps-1 pe-0"
          />
        </div>
        <TextAreaInput
          :id="formData.description.id"
          :label="formData.description.label"
          :tooltip="formData.description.tooltip"
          :errors="formData.description.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.description.value"
          classes="ps-0 pe-0"
          :is-required="false"
          rows="2"
        />
      </div>
    </form>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import IconButton from "@/components/inputs/IconButton.vue";

let getFormData = function () {
  return {
    expenseCategoryId: {
      id: "addexpense-category-input",
      label: "Category",
      tooltip: "Select the expense category",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Category is required",
      },
      ref: "expense_category_id",
    },
    branchId: {
      id: "addexpense-branch-input",
      label: "Branch",
      tooltip: "Select the branch",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Branch is required",
      },
      ref: "branch_id",
    },
    amount: {
      id: "add-expense-amount-input",
      label: "Amount",
      tooltip: "The amount of money spend",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Amount required",
        numeric: "expected a number",
      },
    },
    issuedDate: {
      id: "add-expense-issued-date-input",
      label: "Isuued Date",
      tooltip: "When did this expense happen",
      value: "",
      isValid: null,
      validations: {
        required: "Date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "issued_date",
    },
    description: {
      id: "addexpense-description-input",
      label: "Description",
      tooltip: "Any extra decription info for this expense",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 500,
          error: "Cannot be more than 500 letters",
        },
      },
      setEmptyStringIfNull: true,
    },
    debitAccountId: {
      id: "add-expense-debit-account-id-input",
      label: "Debit Account",
      tooltip: "Select the debit account",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Debit account is required",
      },
      ref: "debit_account_id",
    },
    creditAccountId: {
      id: "addepense-credit-account-id-input",
      label: "Credit Account",
      tooltip: "Select the credit account",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Credit account is required",
      },
      ref: "credit_account_id",
    },
  };
};
export default {
  components: {
    CardContainer,
    TextInput,
    FormErrors,
    SelectInput,
    TextAreaInput,
    IconButton
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
    pst: {
      type: Number,
      default: 0,
    },
    edits: {
      type: Object,
      default: function () {
        return null;
      },
    },
  },
  data() {
    return {
      errors: [],
      formData: getFormData(),
      isFormSubmitting: false,
      accounts: [],
      branches: [],
      expenseCategories: [],
    };
  },
  watch: {
    pst(val) {
      if (this.edits == null) {
        this.onSubmit();
      } else {
        this.onSaveEdits();
      }
    },
  },
  methods: {
    ...Vm.fetch,
    ...Vm.post,
    ...Vm.update,
    loadDependencies() {
      if (this.edits != null) {
        this.editLoadDependencies();
      } else {
        this.postLoadDependencies();
      }
    },
    postLoadDependencies() {
      var vm = this;
      vm.fetch("addExpensesDependencies", function (thisVm, res) {
        thisVm.branches = res.branches;
        thisVm.expenseCategories = res.expenseCategories;
        thisVm.accounts = res.accounts;
      });
    },
    editLoadDependencies() {
      var vm = this;
      vm.fetch("updateExpenseDependencies", function (thisVm, res) {
        thisVm.branches = res.branches;
        thisVm.expenseCategories = res.expenseCategories;
        thisVm.accounts = res.accounts;

        thisVm.formData.debitAccountId.value = parseInt(
          thisVm.edits.debit_account_id
        );
        thisVm.formData.creditAccountId.value = parseInt(
          thisVm.edits.credit_account_id
        );
        thisVm.formData.expenseCategoryId.value = parseInt(
          thisVm.edits.expense_category_id
        );
        thisVm.formData.branchId.value = parseInt(thisVm.edits.branch_id);
      });
    },
    onSubmit() {
      var vm = this;
      vm.post("addExpense", "formData", function (vm, res) {
        vm.$emit("on-success");
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update(
        "updateExpense",
        "formData",
        this.edits.id,
        function (vm, res) {
          vm.$emit("on-success");
        }
      );
    },
  },
  mounted() {
    if (this.edits != null) {
      this.formData = Utils.fillValues(this.formData, this.edits);
    }
    this.loadDependencies();
  },
};
</script>
