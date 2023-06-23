<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-containerx pe-0 mb-2 w-50">
        <SelectInput
          :id="formData.finishedCondition.id"
          :label="formData.finishedCondition.label"
          :errors="formData.finishedCondition.errors"
          :tooltip="formData.finishedCondition.tooltip"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.finishedCondition.value"
          :items="conditionItems"
          classes="ps-0 pe-0 w-50"
        />

        <TextAreaInput
          :id="formData.performedNotes.id"
          :label="formData.performedNotes.label"
          :tooltip="formData.performedNotes.tooltip"
          :errors="formData.performedNotes.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.performedNotes.value"
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
import Data from "@/data/";

let getFormData = function () {
  return {
    finishedCondition: {
      id: "finish-maintenance-condition-input",
      label: "Asset's Condition",
      tooltip: "In what condition is the asset after maintenace work",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Condition is required",
      },
      ref: "finished_condition",
    },
    performedNotes: {
      id: "finish-maintenance-notes-input",
      label: "Any Finishing Remarks:",
      tooltip: "Any notes on finishing the maintenance",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 300,
          error: "Cannot be more than 300 letters",
        }
      },
      setEmptyStringIfNull: true,
      ref: "performed_notes",
    }
  };
};
export default {
  components: {
    CardContainer,
    TextAreaInput,
    SelectInput,
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
      conditionItems: Utils.toValueLabelList(Data.conditions, "value", "label"),
      asset: null
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
      var vm = this;
      vm.fetch("finishAssetMaintenanceDependencies", function (thisVm, res) {
        thisVm.asset = res.asset;
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update(
        "finishAssetMaintenance",
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
