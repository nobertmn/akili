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
        <SelectInput
          :id="formData.as.id"
          :label="formData.as.label"
          :errors="formData.as.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.as.value"
          :items="roles"
          classes="ps-0 pe-0 mb-2"
        />
      </div>
    </form>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import FullWidthButton from "@/components/inputs/FullWidthButton.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Validator from "@/utils/Validator";
import Http from "@/utils/Http";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

let getFormData = function () {
  return {
    name: {
      id: "adduser-name-input",
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
      id: "adduser-email-input",
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
    },
    as: {
      id: "adduser-roleid-input",
      label: "System Role",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Select a user role",
      },
      ref: "role_id",
    },
  };
};
export default {
  components: {
    CardContainer,
    TextInput,
    SelectInput,
    FullWidthButton,
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
      roles: [],
    };
  },
  watch: {
    pst(val) {
      if (this.edits == null) {
        this.onSubmit();
      } else {
        this.onSaveEdits();
      }
    },
  },
  methods: {
    ...Vm.fetch,
    ...Vm.post,
    loadDependencies() {
      this.fetch("addUsersDependencies", function (vm, res) {
        vm.roles = res.roles;
      });
    },
    onSubmit() {
        var vm = this;
        var validationResults = Validator.validateFormData(vm.formData);
        var isValid = validationResults.isValid;
        var formData = validationResults.formData;
        if (isValid === true) {
            vm.errors = [];
            vm.$emit("on-show-loader");
            Http.inviteUser(
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
            vm.errors = ["Please correct the error(s) and submit again"];
        }
    },
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
    if (this.edits != null) {
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
    }
    this.loadDependencies();
  },
};
</script>
