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
    approvalNotes: {
      id: "approvedisposal-reason-input",
      label: "Any Approval Remarks:",
      tooltip: "If you want, you can provide more info along your approval of this asset disposal",
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
      disposalAssets: [],
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
      vm.fetchItem("disposalDetails", vm.edits, function (thisVm, res) {
          console.log("disposalDetails", res);
        thisVm.disposalAssets = res.disposalAssets;
      });
    },
    onSaveEdits() {
        var vm = this;
        vm.update("approveDisposal", "formData", this.edits.id, function(thisVm, res){
            thisVm.$emit("on-success", res);
        });
    },
  },
  mounted() {
    if (this.edits != null) {
        this.formData = Utils.fillValues(this.formData, this.edits);
    }
    this.viewItem = {
      ...this.views,
    };
    this.loadDependencies();
  }
};
</script>
