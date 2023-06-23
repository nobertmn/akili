
<template>
	<CardContainer
		title="Forgot Password"
		sub-title="Type in your Email Address used to Register"
	>
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
				<FullWidthButton label="Submit" @on-click="onSubmit" />
			</div>
		</form>
		<TextLink text="Remembered Your Password?" label="Sign in" url="/" />
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
		email: {
			id: "forgotpassword-email-input",
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
			formFieldErrors: {
				"forgotpassword-email-input": [],
			},
			formData: getFormData(),
			isFormSubmitting: false,
		};
	},
    methods:{
        onSubmit() {
			var vm = this;
			var validationResults = Validator.validateFormData(vm.formData);
			var isValid = validationResults.isValid;
			var formData = validationResults.formData;
			if(isValid === true){
				vm.$emit("on-show-loader");
				Http.forgotPassword(
					formData,
					(res) => {
						vm.errors = [];
						vm.$emit("on-hide-loader");
						vm.$router.push("/reset-password");
					},
					(errors) => {
						vm.errors = errors;
						vm.$emit("on-hide-loader");
					}
				);
			}else{
				vm.formData = formData;
				vm.errors = ["Please correct the error(s) and submit again"]; 
			}
		}
    }
};
</script>
