<template>
  <CardContainer :hasShadow="false" :show-title="false" :show-sub-title="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-containerx pe-1">
        <TextInput
          :id="formData.recalledAssetReturnDate.id"
          :label="formData.recalledAssetReturnDate.label"
          :tooltip="formData.recalledAssetReturnDate.tooltip"
          :errors="formData.recalledAssetReturnDate.errors"
          :is-disabled="isLoading || isFormSubmitting"
          type="date"
          v-model="formData.recalledAssetReturnDate.value"
          classes="ps-0 pe-0 w-25"
        />

        <TextAreaInput
          :id="formData.recalledNotes.id"
          :label="formData.recalledNotes.label"
          :tooltip="formData.recalledNotes.tooltip"
          :errors="formData.recalledNotes.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.recalledNotes.value"
          classes="ps-0 pe-0 w-50"
          :is-required="false"
          rows="2"
        />
      </div>
    </form>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

let getFormData = function () {
  return {
    recalledAssetReturnDate: {
      id: "ecallasset-return-date-input",
      label: "Return Asset Date",
      tooltip: "The date when the asset needs to be returned to the store",
      value: "",
      isValid: null,
      validations: {
        required: "Date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "recalled_asset_return_date",
    },
    recalledNotes: {
      id: "recallasset-notes-input",
      label: "Any Recall Remarks:",
      tooltip:
        "You may indicated more details, why the asset is being recalled",
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
      ref: "recalled_notes",
    },
  };
};
export default {
  components: {
    CardContainer,
    TextAreaInput,
    FormErrors,
    TextInput,
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
      vm.update(
        "recallAssetForMaintenance",
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
  },
};
</script>
