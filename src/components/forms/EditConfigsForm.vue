<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-container pe-3">
        <TextInput
          :id="formData.upcomingrepair.id"
          :label="formData.upcomingrepair.label"
          :tooltip="formData.upcomingrepair.tooltip"
          :errors="formData.upcomingrepair.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.upcomingrepair.value"
          classes="ps-0 pe-0"
        />
        <TextInput
          :id="formData.missedrepair.id"
          :label="formData.missedrepair.label"
          :tooltip="formData.missedrepair.tooltip"
          :errors="formData.missedrepair.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.missedrepair.value"
          classes="ps-0 pe-0"
        />
        <TextInput
          :id="formData.depreciation.id"
          :label="formData.depreciation.label"
          :tooltip="formData.depreciation.tooltip"
          :errors="formData.depreciation.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.depreciation.value"
          classes="ps-0 pe-0"
        />
        <TextInput
          :id="formData.currency.id"
          :label="formData.currency.label"
          :tooltip="formData.currency.tooltip"
          :errors="formData.currency.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.currency.value"
          classes="ps-0 pe-0"
        />
      </div>
    </form>
  </CardContainer>
</template>

<script>
import CardContainer from "@/components/containers/CardContainer.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Validator from "@/utils/Validator";
import Http from "@/utils/Http";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

let getFormData = function () {
  return {
    upcomingrepair: {
      id: "editconfigs-upcomingrepair-input",
      label: "Alert Upcoming Maintanance",
      tooltip: "How many days before scheduled maintanance to alert",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Required",
        digitsOnly: "Only numbers 0 to 9 are allowed",
        maxLength: {
          value: 4,
          error: "Cannot be more than 3 letters",
        },
        minLength: {
          value: 1,
          error: "Atleast 1 letters is required",
        },
        minValue:{
            value: 0,
            error: "Cannot be less than 0",
        },
        maxValue:{
            value: 365,
            error: "Cannot be more than 360",
        }
      },
    },
    missedrepair: {
      id: "editconfigs-missedrepair-input",
      label: "Alert Missed Maintanance",
      tooltip: "How many days after scheduled maintanance to alert",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Required",
        digitsOnly: "Only numbers 0 to 9 are allowed",
        maxLength: {
          value: 4,
          error: "Cannot be more than 3 letters",
        },
        minLength: {
          value: 1,
          error: "Atleast 1 letters is required",
        },
        minValue:{
            value: 0,
            error: "Cannot be less than 0",
        },
        maxValue:{
            value: 365,
            error: "Cannot be more than 360",
        }
      },
    },
    depreciation: {
      id: "editconfigs-missedrepair-input",
      label: "Alert Deprecation Assets (%)",
      tooltip: "At what percentage of depreciation to notify",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Required",
        digitsOnly: "Only numbers 0 to 9 are allowed",
        maxLength: {
          value: 3,
          error: "Cannot be more than 3 letters",
        },
        minLength: {
          value: 1,
          error: "Atleast 1 letters is required",
        },
        minValue:{
            value: 0,
            error: "Cannot be less than 0%",
        },
        maxValue:{
            value: 100,
            error: "Cannot be more than 100%",
        }
      },
    },
    currency: {
      id: "editconfigs-currency-input",
      label: "Currency",
      tooltip: "What currency to represent figures in",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Required",
        maxLength: {
          value: 3,
          error: "Cannot be more than 3 letters",
        },
        minLength: {
          value: 2,
          error: "Atleast 2 letters is required",
        }
      },
    },
  };
};
export default {
  components: {
    CardContainer,
    TextInput,
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
        vm.update("updateConfigs", "formData", 1, function (thisVm, res) {
            vm.$emit("on-success");
        });
    }
  },
  mounted() {
    this.formData = Utils.fillValues(this.formData, this.edits);
  },
};
</script>
