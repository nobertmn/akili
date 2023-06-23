<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-containerx pe-0 mb-2">
        <TextAreaInput
          :id="formData.rejectedNotes.id"
          :label="formData.rejectedNotes.label"
          :tooltip="formData.rejectedNotes.tooltip"
          :errors="formData.rejectedNotes.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.rejectedNotes.value"
          classes="ps-0 pe-0"
          :is-required="true"
        />
      </div>
    </form>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

let getFormData = function () {
  return {
    rejectedNotes: {
      id: "rejectacquisiation-reason-input",
      label: "Reason For Rejection",
      tooltip: "Please provide a detailed reason for rejecting this acquisition order",
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
      ref: "rejected_notes"
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
        vm.update("rejectPurchaseOrder", "formData", this.edits.id, function(thisVm, res){
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
