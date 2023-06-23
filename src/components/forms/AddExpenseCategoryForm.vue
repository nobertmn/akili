<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-containerx pe-3x">

        <TextInput
          :id="formData.name.id"
          :label="formData.name.label"
          :tooltip="formData.name.tooltip"
          :errors="formData.name.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.name.value"
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
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import SearchSelectInput from "@/components/inputs/SearchSelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

let getFormData = function () {
  return {
    name: {
      id: "addexpense-category-name-input",
      label: "Name",
      tooltip: "The name of the expense category",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Name is required",
        maxLength: {
          value: 60,
          error: "Cannot be more than 60 letters",
        },
        minLength: {
          value: 5,
          error: "Atleast 5 letters are required",
        },
      },
    },
    description: {
      id: "addexpense-category-description-input",
      label: "Description",
      tooltip: "Any extra decription info for this expense category",
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
    SearchSelectInput,
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
    },
  },
  data() {
    return {
      errors: [],
      formData: getFormData(),
      isFormSubmitting: false
    };
  },
  watch: {
    pst(val) {
      if (this.edits == null) {
        this.onSubmit();
      } else {
        this.onSaveEdits();
      }
    }
  },
  methods: {
    ...Vm.fetch,
    ...Vm.post,
    ...Vm.update,
    onSubmit() {
        var vm = this;
        vm.post("addExpenseCategory", "formData", function(vm, res){
            vm.$emit("on-success");
        });
    },
    onSaveEdits() {
        var vm = this;
        vm.update("updateExpenseCategory", "formData", this.edits.id, function(vm, res){
            vm.$emit("on-success");
        });
    }
  },
  mounted() {
    if (this.edits != null) {
        this.formData = Utils.fillValues(this.formData, this.edits,);
    }
  },
};
</script>
