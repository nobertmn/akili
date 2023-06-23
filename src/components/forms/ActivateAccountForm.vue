<template>
  <CardContainer
    title="Activate Account"
    sub-title="Enter your account activation code"
  >
    <Line />
    <FormErrors :errors="errors" />
    <form novalidate>
      <div class="form-fields-container">
        <TextInput
          :id="formData.code.id"
          :label="formData.code.label"
          :tooltip="formData.code.tooltip"
          :errors="formData.code.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.code.value"
        />
        <FullWidthButton
          label="Submit"
          @on-click="onSubmit"
          :is-disabled="isLoading || isFormSubmitting"
        />
      </div>
    </form>
    <br />
    <TextLink
      text="Remembered Your Password?"
      label="Sign in"
      url="/"
      :is-disabled="isLoading || isFormSubmitting"
    />
    <TextLink
      text="New on our platform?"
      label="Create an Account"
      url="/register"
      :is-disabled="isLoading || isFormSubmitting"
    />
  </CardContainer>
</template>

<script>
import CardContainer from "@/components/containers/CardContainer.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import FullWidthButton from "@/components/inputs/FullWidthButton.vue";
import Line from "@/components/Line.vue";
import TextLink from "@/components/links/TextLink.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Http from "@/utils/Http";
import Validator from "@/utils/Validator";

let getFormData = function () {
	return {
		code: {
			id: "activationcode-input",
			label: "Activation Code",
			tooltip: "Please provide the activation code sent.",
			errors: [],
			value: "",
			isValid: null,
			validations: {
				required: "Activation Code is required",
				length: {
					value: 4,
					error: "Expected a 4 digit number",
				},
				digitsOnly: "Only digits are allowed",
			}
		}
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
  },
  data() {
    return {
      errors: [],
      formData: getFormData(),
      isFormSubmitting: false
    };
  },
  methods: {
    onSubmit() {
      var vm = this;
	  vm.$router.push("/?from-activate=true");
      var validationResults = Validator.validateFormData(vm.formData);
      var isValid = validationResults.isValid;
      var formData = validationResults.formData;
      if (isValid === true) {
        vm.$emit("on-show-loader");
        Http.activate(
          formData,
          (res) => {
            vm.errors = [];
			vm.formData = getFormData();
            vm.$emit("on-hide-loader");
			
          },
          (errors) => {
            vm.errors = errors;
            vm.$emit("on-hide-loader");
          }
        );
      } else {
        vm.formData = formData;
        vm.errors = ["Please provide the corrent code and submit again"];
      }
    },
  },
};
</script>
