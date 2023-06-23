<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="">
        <div class="d-flex justify-content-between">
          <SelectInput
            :id="formData.parentAccountId.id"
            :label="formData.parentAccountId.label"
            :tooltip="formData.parentAccountId.tooltip"
            :errors="formData.parentAccountId.errors"
            :is-disabled="edits == null ? true : isLoading || isFormSubmitting"
            v-model="formData.parentAccountId.value"
            :items="accounts"
            :is-required="false"
            classes="ps-0 pe-1"
            :note="context == 'root' ? '(optional)' : ''"
          />

          <TextInput
            :id="formData.refNo.id"
            :label="formData.refNo.label"
            :tooltip="formData.refNo.tooltip"
            :errors="formData.refNo.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.refNo.value"
            classes="ps-1 pe-0"
          />
        </div>
        <div class="d-flex justify-content-between">
          <TextInput
            :id="formData.name.id"
            :label="formData.name.label"
            :tooltip="formData.name.tooltip"
            :errors="formData.name.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.name.value"
            classes="ps-0 pe-1"
          />

          <SelectInput
            :id="formData.type.id"
            :label="formData.type.label"
            :tooltip="formData.type.tooltip"
            :errors="formData.type.errors"
            :required="true"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.type.value"
            :items="accountTypes"
            classes="ps-1 pe-0"
          />
        </div>
        <div class="d-flex justify-content-between">
          <SelectInput
            :id="formData.group.id"
            :label="formData.group.label"
            :tooltip="formData.group.tooltip"
            :errors="formData.group.errors"
            :required="true"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.group.value"
            :items="accountGroups"
            classes="ps-0 pe-1"
          />

          <SelectInput
            :id="formData.statementType.id"
            :label="formData.statementType.label"
            :tooltip="formData.statementType.tooltip"
            :errors="formData.statementType.errors"
            :required="true"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.statementType.value"
            :items="finacialStatements"
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
import StepperContainer from "@/components/containers/StepperContainer.vue";
import Validator from "@/utils/Validator";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import Data from "@/data/";
import IconButton from "@/components/inputs/IconButton.vue";

let getFormData = function () {
  return {
    refNo: {
      id: "addaccount-number-input",
      label: "Account Number",
      tooltip: "The reference number or general ledger account number",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Account number is required",
        digitsOnly: "Only digits are allowed",
      },
      ref: "ref_no",
    },
    name: {
      id: "addaccount-name-input",
      label: "Account Name",
      tooltip: "Specify a name for the account",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Account name is required",
        maxLength: {
          value: 150,
          error: "Cannot be more than 150 letters",
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required",
        },
      },
    },
    type: {
      id: "addaccount-type-input",
      label: "Type",
      tooltip: "Select the account type",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Account type is required",
      },
    },
    group: {
      id: "addaccount-credit-account-id-input",
      label: "Group",
      tooltip: "Under what group is this account",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Account group is required",
      },
    },
    statementType: {
      id: "addaccount-statement-type-input",
      label: "Statement Type",
      tooltip: "What finacial report is this tide to",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Statement type is required",
      },
      ref: "statement_type",
    },
    description: {
      id: "addaccount-description-input",
      label: "Description",
      tooltip: "Any extra decription info for this account",
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
    parentAccountId: {
      id: "addaccount-parent-id-input",
      label: "Parent Account",
      tooltip: "Optional: Select a parent account",
      errors: [],
      value: "",
      isValid: null,
      validations: {},
      ref: "account_id",
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
    StepperContainer,
    IconButton,
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
    context: {
      type: String,
      default: "root",
    },
    parentAccount: {
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
      accountTypes: Data.accountTypes,
      accountGroups: Data.accountGroups,
      finacialStatements: Data.finacialStatements
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
      vm.fetch("accountingAddAccountDependencies", function (thisVm, res) {
        thisVm.accounts = res.accounts;

        //if its adding  a sub account
        if (thisVm.context != "root" && thisVm.parentAccount != null) {
          thisVm.formData.parentAccountId.value = parseInt(
            thisVm.parentAccount.id
          );
        }
      });
    },
    editLoadDependencies() {
      var vm = this;
      vm.fetch("accountingUpdateAccountDependencies", function (thisVm, res) {
        thisVm.accounts = res.accounts;
        thisVm.formData.parentAccountId.value = parseInt(
          thisVm.edits.account_id
        );
      });
    },
    onSubmit() {
      var vm = this;
      vm.post("accountingAddAccount", "formData", function (vm, res) {
        vm.$emit("on-success");
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update(
        "accountingUpdateCategory",
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
