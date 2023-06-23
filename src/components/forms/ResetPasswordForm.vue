<template>
  <CardContainer title="Reset Password" sub-title="Type in New Password">
    <Line />
    <FormErrors :errors="errors" />
    <form novalidate>
      <div class="form-fields-container">
        <TextInput
          :id="formData.email.id"
          :label="formData.email.label"
          type="email"
          :tooltip="formData.email.tooltip"
          :errors="formData.email.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.email.value"
        />
        <TextInput
          :id="formData.passwordResetCode.id"
          :label="formData.passwordResetCode.label"
          :tooltip="formData.passwordResetCode.tooltip"
          :errors="formData.passwordResetCode.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.passwordResetCode.value"
          type="number"
        />
        <TextInput
          :id="formData.password.id"
          :label="formData.password.label"
          :errors="formData.password.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.password.value"
          type="password"
        />
        <TextInput
          :id="formData.confirmNewPassword.id"
          :label="formData.confirmNewPassword.label"
          :errors="formData.confirmNewPassword.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.confirmNewPassword.value"
          type="password"
        >
          <template v-slot:below>
            <div
              class="d-flex justify-content-between align-items-center"
              v-if="formData.password.value.length > 0"
            >
              <div class="pass-strength">
                Strength: <b class="">{{ passwordStrength }}</b>
              </div>
              <div class="flex-grow-1">
                <password-meter
                  @score="onScore"
                  :password="formData.password.value"
                />
              </div>
            </div>
          </template>
        </TextInput>
        <FullWidthButton
          label="Submit"
          @on-click="onSubmit"
          :is-disabled="isLoading || isFormSubmitting"
        />
      </div>
    </form>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import FullWidthButton from "@/components/inputs/FullWidthButton.vue";
import Line from "@/components/Line.vue";
import TextLink from "@/components/links/TextLink.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Http from "@/utils/Http";
import PasswordMeter from 'vue-simple-password-meter';
import Validator from "@/utils/Validator";

let getFormData = function () {
  return {
    email: {
      id: "password-reset-email-input",
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
    passwordResetCode: {
      id: "password-reset-code-input",
      label: "Password Reset Code",
      tooltip: "Please provide the Password Reset code sent.",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Password Reset Code is required",
        length: {
          value: 4,
          error: "Expected a 4 digit number",
        },
        digitsOnly: "Only digits are allowed",
      },
    },
    password: {
      id: "password-reset-input",
      label: "Password",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: {
          trim: false,
          error: "Password is required",
        },
        maxLength: {
          value: 15,
          trim: false,
          error: "Cannot be more than 15 letters",
        },
        minLength: {
          value: 6,
          trim: false,
          error: "Atleast 6 letters are required",
        },
      },
    },
    confirmNewPassword: {
      id: "reset-confirm-password-input",
      label: "Comfirm Password",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: {
          trim: false,
          error: "Confirmation password is required",
        },
        maxLength: {
          value: 15,
          trim: false,
          error: "Cannot be more than 15 letters",
        },
        minLength: {
          value: 6,
          trim: false,
          error: "Atleast 6 letters are required",
        },
        sameAs: {
          value: "password",
          error: "The two passwords are not the same",
        },
      },
    },
  };
};
export default {
  components: {
    CardContainer,
    TextInput,
    FullWidthButton,
    Line,
    TextLink,
    FormErrors,
    PasswordMeter
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      errors: [],
      formFieldErrors: {
        "password-reset-code-input": [],
        "new-password-input": [],
        "reset-confirm-password-input": [],
      },
      formData: getFormData(),
      isFormSubmitting: false,
      passwordStrength: "",
    };
  },
  methods: {
    onSubmit() {
      var vm = this;
      var validationResults = Validator.validateFormData(vm.formData);
      var isValid = validationResults.isValid;
      var formData = validationResults.formData;
      if (isValid === true) {
        vm.$emit("on-show-loader");
        Http.passwordResetCode(
          formData,
          (res) => {
            vm.errors = [];
            vm.$emit("on-hide-loader");
            this.$router.push("/");
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
    onScore(payload) {
      //console.log(payload.score); // from 0 to 4
      //console.log(payload.strength); // one of : 'risky', 'guessable', 'weak', 'safe' , 'secure'
      this.passwordStrength = payload.strength;
    }
  },
};
</script>
