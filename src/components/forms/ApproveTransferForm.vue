<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-containerx pe-0 mb-2">
        <TextAreaInput
          :id="formData.approvalNotes.id"
          :label="formData.approvalNotes.label"
          :tooltip="formData.approvalNotes.tooltip"
          :errors="formData.approvalNotes.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.approvalNotes.value"
          classes="ps-0 pe-0"
          :is-required="false"
        />
      </div>
    </form>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Validator from "@/utils/Validator";
import Http from "@/utils/Http";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

let getFormData = function () {
  return {
    approvalNotes: {
      id: "approvetransfer-reason-input",
      label: "Any Approval Remarks:",
      tooltip: "If you want, you can provide more info along your approval of this asset transfer",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 500,
          error: "Cannot be more than 500 letters",
        }
      },
      setEmptyStringIfNull: true,
      ref: "approval_notes"
    }
  };
};
export default {
  components: {
    CardContainer,
    TextAreaInput,
    FormErrors,
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
    };
  },
  watch: {
    pst(val) {
        this.onSaveEdits();
    },
  },
  methods: {
    ...Vm.update,
    ...Vm.loaders,
    onSaveEdits() {
        var vm = this;
        vm.update("approveTransfer", "formData", this.edits.id, function(thisVm, res){
            thisVm.$emit("on-success", res);
        });
    },
  },
  mounted() {
    if (this.edits != null) {
        this.formData = Utils.fillValues(this.formData, this.edits);
    }
  },
};
</script>
