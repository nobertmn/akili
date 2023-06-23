<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-container pe-3">
        <TextInput
          :id="formData.newPassword.id"
          :label="formData.newPassword.label"
          :tooltip="formData.newPassword.tooltip"
          type="password"
          :errors="formData.newPassword.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.newPassword.value"
          classes="ps-0 pe-0"
        />
        <TextInput
          :id="formData.comfirmNewPassword.id"
          :label="formData.comfirmNewPassword.label"
          :tooltip="formData.comfirmNewPassword.tooltip"
          type="password"
          :errors="formData.comfirmNewPassword.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.comfirmNewPassword.value"
          classes="ps-0 pe-0"
        />
        <TextInput
          :id="formData.oldPassword.id"
          :label="formData.oldPassword.label"
          :tooltip="formData.oldPassword.tooltip"
          type="password"
          :errors="formData.oldPassword.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.oldPassword.value"
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
    newPassword: {
      id: "editpassword-new-password-input",
      label: "New Password",
      tooltip: "Enter a new password",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "New Password is required",
        maxLength: {
          value: 15,
          error: "Cannot be more than 15 letters",
        },
        minLength: {
          value: 6,
          error: "Atleast 6 letters are required",
        },
      },
    },
    comfirmNewPassword: {
      id: "editpassword-comfirm-password-input",
      label: "Comfirm New Password",
      tooltip: "Enter the new password again",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Comfirm New Password is required",
        maxLength: {
          value: 15,
          error: "Cannot be more than 15 letters",
        },
        minLength: {
          value: 6,
          error: "Atleast 6 letters are required",
        },
        sameAs:{
            value: "newPassword",
            error: "New password must same as comfirm password",
        }
      },
    },
    oldPassword: {
      id: "editpassword-old-password-input",
      label: "Current Password",
      tooltip: "Enter the new password that you are currently using",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Current Password is required",
        maxLength: {
          value: 15,
          error: "Cannot be more than 15 letters",
        },
        minLength: {
          value: 6,
          error: "Atleast 6 letters are required",
        }
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
    ...Vm.update,
    ...Vm.loaders,
    onSaveEdits() {
        var vm = this;
        vm.update("updatePassword", "formData", vm.edits.id, function (thisVm, res) {
            vm.$emit("on-success");
        });
    },
  }
};
</script>
