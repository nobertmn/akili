<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-container pe-3">
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
          :id="formData.email.id"
          :label="formData.email.label"
          type="email"
          :tooltip="formData.email.tooltip"
          :errors="formData.email.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.email.value"
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
    name: {
      id: "editprofile-name-input",
      label: "Name",
      tooltip: "The first and last names of the user",
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
    email: {
      id: "editprofile-email-input",
      label: "Email",
      tooltip: "Please provide a valid email address.",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Email address is required",
        maxLength: {
          value: 60,
          error: "Cannot be more than 60 letters",
        },
        minLength: {
          value: 5,
          error: "Atleast 5 letters are required",
        },
        emailFormat: "Invalid email address",
      },
    }
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
    onSaveEdits() {
        var vm = this;
        var validationResults = Validator.validateFormData(vm.formData);
        var isValid = validationResults.isValid;
        var formData = validationResults.formData;
        if (isValid === true) {
            vm.errors = [];
            vm.$emit("on-show-loader");
            Http.editUserProfile(
            formData,
            (res) => {
                vm.$emit("on-hide-loader");
                vm.$emit("on-success");
            },
            (errors) => {
                vm.errors = errors;
                vm.$emit("on-hide-loader");
            }
            );
        } else {
            vm.formData = formData;
            vm.errors = ["Please correct the error(s) and save again"];
        }
    },
  },
  mounted() {
    this.formData = Utils.fillValues(this.formData, this.edits);
    this.formData["prevEmail"] = {
        id: "adduser-prevemail-input",
        label: "",
        tooltip: "",
        errors: [],
        value: this.edits.email,
        isValid: null,
        validations: {
        },
    };
    this.formData["userId"] = {
        id: "adduser-prevemail-input",
        label: "",
        tooltip: "",
        errors: [],
        value: this.edits.id,
        isValid: null,
        validations: {
        },
    };
    this.formData["tenant"] = {
        id: "adduser-prevemail-input",
        label: "",
        tooltip: "",
        errors: [],
        value: this.edits.tenant_of,
        isValid: null,
        validations: {
        },
    };
  },
};
</script>
