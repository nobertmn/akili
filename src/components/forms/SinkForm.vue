<template>
    <CardContainer title="Sign In" sub-title="Login to access your account">
        <Line />
        <FormErrors :errors="errors" />
        <form novalidate>
            <div class="form-fields-container">
                <SelectInput 
                    id="login-email-input" 
                    label="Email"  
                    tooltip="Please provide the email address that was used to register."
                    :errors="formFieldErrors['login-email-input']"
                    :is-disabled="isPageLoading || isFormSubmitting"
                    :items="options"
                    v-model="formData.email" />
                <TextInput 
                    id="login-password-input" 
                    label="Password"  
                    type="password"
                    :errors="formFieldErrors['login-password-input']" 
                    v-model="formData.password" />
                <FullWidthButton @on-click="submit" label="Sign in"  />
            </div>
        </form>
        <br/>
        <TextLink text="Forgot Your Password?" label="Reset Password" url="/forgot-password" />
        <TextLink text="New on our platform?" label="Create an Account" url="/register" />
    </CardContainer>
</template>

<script >
import CardContainer from '@/components/containers/CardContainer.vue'
import TextInput from '@/components/inputs/TextInput.vue'
import SelectInput from '@/components/inputs/SelectInput.vue'
import FullWidthButton from '@/components/inputs/FullWidthButton.vue'
import Line from '@/components/Line.vue'
import TextLink from '@/components/links/TextLink.vue'
import FormErrors from '@/components/forms/FormErrors.vue' 

export default{
    components: {
        CardContainer,
        TextInput,
        FullWidthButton,
        Line,
        TextLink,
        FormErrors,
        SelectInput
    },
    props: {
        isPageLoading: {
            type: Boolean,
            default: false
        }, 
    },
    data(){
        return {
            errors: [],
            formFieldErrors: {
                'login-email-input': [],
                'login-password-input': []
            },
            formData: {
                email: "",
                password: ""
            },
            isFormSubmitting: false,
            options: [
                {
                    value: "Cars",
                    label: "Yellow Cars"
                }
            ]
        }
    },
    methods:{
        submit(){
            this.errors = ["This sample error"]
        }
    }
}
</script>
