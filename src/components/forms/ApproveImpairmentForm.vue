<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-containerx pe-0 mb-2 w-75" >
        <div class="d-flex flex-row">
          <SelectInput
            :id="formData.debitAccountId.id"
            :label="formData.debitAccountId.label"
            :tooltip="formData.debitAccountId.tooltip"
            :errors="formData.debitAccountId.errors"
            :required="true"
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
            :required="true"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.creditAccountId.value"
            :items="accounts"
            classes="ps-1 pe-0"
          />
        </div>

        <TextAreaInput
          :id="formData.approvalNotes.id"
          :label="formData.approvalNotes.label"
          :tooltip="formData.approvalNotes.tooltip"
          :errors="formData.approvalNotes.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.approvalNotes.value"
          classes="ps-0 pe-0"
        />
      </div>
    </form>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

let getFormData = function () {
  return {
    approvalNotes: {
      id: "approve-impairment-reason-input",
      label: "Any Approval Remarks:",
      tooltip:
        "If you want, you can provide more info along your approval of this asset disposal",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Reason is required",
        maxLength: {
          value: 500,
          error: "Cannot be more than 500 letters",
        },
        minLength: {
          value: 50,
          error: "Atleast 50 letters are required",
        },
      },
      ref: "approval_notes",
    },
    debitAccountId: {
      id: "approve-impairment-debit-input",
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
      id: "approve-impairment-credit-input",
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
    TextAreaInput,
    FormErrors,
    SelectInput
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
    };
  },
  watch: {
    pst(val) {
      this.onSaveEdits();
    },
  },
  methods: {
    ...Vm.fetch,
    ...Vm.update,
    ...Vm.loaders,
    loadDependencies() {
      let vm = this;
      vm.fetch("approveImpairmentsDependencies", function(thisVm, res){
          thisVm.accounts = res.accounts;
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update(
        "approveImpairment",
        "formData",
        this.edits.id,
        function (thisVm, res) {
          thisVm.$emit("on-success", res);
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
