<template>
  <CardContainer title="Sign Up" sub-title="" classes="mt--60">
    <Line />
    <FormErrors :errors="errors" />
    <form novalidate>
      <div class="form-fields-container">
        <TextInput
          :id="formData.companyName.id"
          :label="formData.companyName.label"
          :tooltip="formData.companyName.tooltip"
          :errors="formData.companyName.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.companyName.value"
        />
        <div class="same-line">
          <TextInput
            :id="formData.firstName.id"
            :label="formData.firstName.label"
            :errors="formData.firstName.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.firstName.value"
          />
          <TextInput
            :id="formData.lastName.id"
            :label="formData.lastName.label"
            :errors="formData.lastName.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.lastName.value"
          />
        </div>
        <TextInput
          :id="formData.email.id"
          :label="formData.email.label"
          :tooltip="formData.email.tooltip"
          :errors="formData.email.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.email.value"
          type="email"
        />
        <div class="same-line">
          <SelectInput
            :id="formData.country.id"
            :label="formData.country.label"
            :errors="formData.country.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.country.value"
            :items="countries"
          />
          <TextInput
            :id="formData.phoneNumber.id"
            :label="formData.phoneNumber.label"
            :errors="formData.phoneNumber.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.phoneNumber.value"
          />
        </div>

        <TextInput
          :id="formData.password.id"
          :label="formData.password.label"
          :errors="formData.password.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.password.value"
          type="password"
        >
          <template v-slot:below>
            <div class="d-flex justify-content-between align-items-center" v-if="formData.password.value.length > 0" >
              <div class="pass-strength" >
                Strength: <b class="">{{passwordStrength}}</b>
              </div>
              <div class="flex-grow-1" >
                <password-meter @score="onScore" :password="formData.password.value" />
              </div>
            </div>
          </template>
        </TextInput>
        

        <TextInput
          :id="formData.comfirmPassword.id"
          :label="formData.comfirmPassword.label"
          :errors="formData.comfirmPassword.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.comfirmPassword.value"
          type="password"
        />

        <FullWidthButton
          label="Sign up"
          @on-click="onSubmit"
          :is-disabled="isLoading || isFormSubmitting"
        />
      </div>
    </form>
    <TextLink
      text="Already Have An Account?"
      label="Sign in"
      url="/"
      :is-disabled="isLoading || isFormSubmitting"
    />
    <SimpleModal
      id="registrationSuccessModalx"
      title="Registration Was Suceessfull"
      v-model="showModal"
      :show-close-btn="false"
      ok-btn-text="Enter Account Activation Code"
      @on-ok-btn-click="onEnterActivateAcountBtnClick"
      :show-top-close-btn="false"
      ok-btn-width="300px;"
    >
      <span>
        Hello!
        <b>{{ formData.firstName.value }} {{ formData.lastName.value }}</b>
      </span>
      <div class="d-flex text-start">
        <SuccessImage />
        <div class="p-1">
          <p class="fs-5">
            <b>A four digit account activation code</b> has been sent to your
            email {{ formData.email.value }}
          </p>

          <p class="fs-5 text-primary">
            Click the button below to activate your account.
          </p>
        </div>
      </div>
    </SimpleModal>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import FullWidthButton from "@/components/inputs/FullWidthButton.vue";
import Line from "@/components/Line.vue";
import TextLink from "@/components/links/TextLink.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import SinkHallView from "@/views/SinkHallView.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import SuccessImage from "@/components/images/SuccessImage.vue";
import Http from "@/utils/Http";
import Vm from "@/utils/Vm";
import Validator from "@/utils/Validator";
import PasswordMeter from 'vue-simple-password-meter';

let getFormData = function(){
  return {
    companyName: {
      id: "signin-companyname-input",
      label: "Company Name",
      tooltip: "Provide the name of your company",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Company name is required",
        maxLength: {
          value: 150,
          error: "Cannot be more than 150 letters"
        },
        minLength: {
          value: 5,
          error: "Atleast 5 letters are required"
        }
      }
    },
    firstName: {
      id: "signin-firstname-input",
      label: "First Name",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "First name is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 letters"
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required"
        }
      }
    },
    lastName: {
      id: "signin-lastname-input",
      label: "Last Name",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Last name is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 letters"
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required"
        }
      }
    },
    email: {
      id: "signin-email-input",
      label: "Email",
      tooltip: "Please provide a valid email address.",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Email address is required",
        maxLength: {
          value: 60,
          error: "Cannot be more than 60 letters"
        },
        minLength: {
          value: 5,
          error: "Atleast 5 letters are required"
        },
        emailFormat: "Invalid email address"
      }
    },
    country: {
      id: "signin-country-input",
      label: "Country",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Country is required"
      }
    },
    phoneNumber: {
      id: "signin-phonenumber-input",
      label: "Phone number",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Phone number required",
        length: {
          value: 10,
          error: "Expected a 10 digit number"
        },
        digitsOnly: "Only digits 0-9 are allowed"
      }
    },
    password: {
      id: "signin-password-input",
      label: "Password",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: {
          trim: false,
          error: "Password is required"
        },
        maxLength: {
          value: 15,
          trim: false,
          error: "Cannot be more than 15 letters"
        },
        minLength: {
          value: 6,
          trim: false,
          error: "Atleast 6 letters are required"
        }
      }
    },
    comfirmPassword: {
      id: "signin-confirm-password-input",
      label: "Confirm Password",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: {
          trim: false,
          error: "Confirmation password is required"
        },
        maxLength: {
          value: 15,
          trim: false,
          error: "Cannot be more than 15 letters"
        },
        minLength: {
          value: 6,
          trim: false,
          error: "Atleast 6 letters are required"
        },
        sameAs: {
          value: 'password',
          error: "The two passwords are not the same"
        }
      }
    }
  };
}

export default {
  components: {
    CardContainer,
    TextInput,
    FullWidthButton,
    Line,
    TextLink,
    FormErrors,
    SinkHallView,
    SelectInput,
    SimpleModal,
    SuccessImage,
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
      formData: getFormData(),
      isFormSubmitting: false,
      showModal: false,
      passwordStrength: "",
      countries: []
    };
  },
  methods: {
    ...Vm.fetch,
    onSubmit() {
      var vm = this;
      var validationResults = Validator.validateFormData(vm.formData);
      var isValid = validationResults.isValid;
      var formData = validationResults.formData;
      if(isValid === true){
        vm.$emit("on-show-loader");
        Http.register(
          formData,
          (res) => {
            vm.errors = [];
            vm.$emit("on-hide-loader");
            vm.showModal = true;
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
    },
    onEnterActivateAcountBtnClick() {
      this.showModal = false;
      this.formData = getFormData();
      this.$router.push("/activate-account");
    },
    onScore(payload) {
      //console.log(payload.score); // from 0 to 4
      //console.log(payload.strength); // one of : 'risky', 'guessable', 'weak', 'safe' , 'secure'
      this.passwordStrength = payload.strength;
    }
  },
  mounted(){
    this.fetch("registerDependencies", function(vm, res){
      vm.countries = res.countries;
    });
  }
};
</script>

<style scoped>
  .pass-strength{
    width: 120px;
    font-size: 10px;
    /* background-color: blue; */
  }
  .po-password-strength-bar{
    margin-top: 0px;
  }
</style>
