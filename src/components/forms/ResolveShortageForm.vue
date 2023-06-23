<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-containerx pe-0 mb-2">
        <TextAreaInput
          :id="formData.resolveRejectionComment.id"
          :label="formData.resolveRejectionComment.label"
          :tooltip="formData.resolveRejectionComment.tooltip"
          :errors="formData.resolveRejectionComment.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.resolveRejectionComment.value"
          classes="ps-0 pe-0"
          :is-required="true"
          note="(describe) "
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
    resolveRejectionComment: {
      id: "resolve-shortage-comment-input",
      label: "How was this resolved ?",
      tooltip: "Provide a description of how this shortage was resolved",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Description is required",
        maxLength: {
          value: 500,
          error: "Cannot be more than 500 letters",
        },
        minLength: {
          value: 30,
          error: "Atleast 30 letters are required",
        },
      },
      setEmptyStringIfNull: true,
      ref: "resolve_rejection_comment"
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
        vm.update("resolveShortage", "formData", this.edits.id, function(thisVm, res){
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
