<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="">
        <TextInput
          :id="formData.name.id"
          :label="formData.name.label"
          :tooltip="formData.name.tooltip"
          :errors="formData.name.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.name.value"
          classes="ps-0 pe-0"
        />

        <TextInput
          :id="formData.lifeTimeIncreaseDays.id"
          :label="formData.lifeTimeIncreaseDays.label"
          :tooltip="formData.lifeTimeIncreaseDays.tooltip"
          :errors="formData.lifeTimeIncreaseDays.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.lifeTimeIncreaseDays.value"
          classes="ps-0 pe-0"
        />

        <SelectInput
          :id="formData.debitAccountId.id"
          :label="formData.debitAccountId.label"
          :tooltip="formData.debitAccountId.tooltip"
          :errors="formData.debitAccountId.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.debitAccountId.value"
          :items="accounts"
          classes="ps-0 pe-0"
        />

        <SelectInput
          :id="formData.creditAccountId.id"
          :label="formData.creditAccountId.label"
          :tooltip="formData.creditAccountId.tooltip"
          :errors="formData.creditAccountId.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.creditAccountId.value"
          :items="accounts"
          classes="ps-0 pe-0"
        />

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

let getFormData = function () {
  return {
    name: {
      id: "add-work-type-name-input",
      label: "Maintenance Work Name",
      tooltip: "Specify a name for the maintenance work",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Maintenance work name is required",
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
    lifeTimeIncreaseDays: {
      id: "add-work-type-days-input",
      label: "Gained Days",
      tooltip:
        "How many days will this work increase the life time of the asset",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Days gained is required",
        digitsOnly: "Only digits are allowed",
      },
      ref: "life_time_increase_days",
    },
    debitAccountId: {
      id: "add-work-type-debit-account-input",
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
      id: "add-work-type-credit-account-input",
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
    description: {
      id: "add-work-type-description-input",
      label: "Description",
      tooltip: "Any extra decription info for this maintenance work",
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
  };
};
export default {
  components: {
    CardContainer,
    TextInput,
    FormErrors,
    SelectInput,
    TextAreaInput
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
    }
  },
  data() {
    return {
      errors: [],
      formData: getFormData(),
      isFormSubmitting: false,
      accounts: [],
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
      vm.fetch("addWorkTypesDependencies", function (thisVm, res) {
        thisVm.accounts = res.accounts;
      });
    },
    editLoadDependencies() {
      var vm = this;
      vm.fetch("updateWorkTypesDependencies", function (thisVm, res) {
        thisVm.accounts = res.accounts;
        //select the debit, credit, accounts where necessary
        thisVm.formData.debitAccountId.value = parseInt(
          thisVm.edits.debit_account_id
        );
        thisVm.formData.creditAccountId.value = parseInt(
          thisVm.edits.credit_account_id
        );
      });
    },
    onSubmit() {
      var vm = this;
      vm.post("addWorkType", "formData", function (vm, res) {
        vm.$emit("on-success");
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update(
        "updateWorkType",
        "formData",
        this.edits.id,
        function (vm, res) {
          vm.$emit("on-success");
        }
      );
    }
  },
  mounted() {
    if (this.edits != null) {
      this.formData = Utils.fillValues(this.formData, this.edits);
    }
    this.loadDependencies();
  },
};
</script>
