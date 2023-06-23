<template>
  <CardContainer :title="title" :sub-title="subTitle" :hasShadow="!isHeadless">
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
          :id="formData.password.id"
          :label="formData.password.label"
          type="password"
          :errors="formData.password.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.password.value"
        />
        <FullWidthButton @on-click="onSubmit" label="Sign in" />
      </div>
    </form>
    <br />
    <TextLink
      text="Forgot Your Password?"
      label="Reset Password"
      url="/forgot-password"
    />
    <TextLink
      text="New on our platform?"
      label="Create an Account"
      url="/register"
    />
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import FullWidthButton from "@/components/inputs/FullWidthButton.vue";
import Line from "@/components/Line.vue";
import TextLink from "@/components/links/TextLink.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Validator from "@/utils/Validator";
import Http from "@/utils/Http";

let getFormData = function () {
  return {
    email: {
      id: "login-email-input",
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
    password: {
      id: "login-password-input",
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
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    isHeadless: {
      type: Boolean,
      default: false,
    },
    classes: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "Sign In",
    },
    subTitle: {
      type: String,
      default: "Login to access your account",
    },
  },
  data() {
    return {
      errors: [],
      formData: getFormData(),
      isFormSubmitting: false,
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
        Http.login(
          formData,
          (res) => {
            vm.errors = [];
            vm.$emit("on-hide-loader");
            if(vm.isHeadless){
              vm.$emit("on-success");
            }else if(res._f_login.config.onboarding_step1_branches == "pending"){
              vm.$router.push("/onboarding/1");
            }else if(res._f_login.config.onboarding_step2_sites == "pending"){
              vm.$router.push("/onboarding/2");
            }else if(res._f_login.config.onboarding_step3_system_users == "pending"){
              vm.$router.push("/onboarding/3");
            }else if(res._f_login.config.onboarding_step4_chart_of_accounts == "pending"){
              vm.$router.push("/onboarding/4");
            }else if(res._f_login.config.onboarding_step5_asset_categories == "pending"){
              vm.$router.push("/onboarding/5");
            }else if(res._f_login.config.onboarding_step6_upload_assets == "pending"){
              vm.$router.push("/onboarding/6");
            }else{
              vm.$router.push("/dashboard");
            }
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
  },
};
</script>
