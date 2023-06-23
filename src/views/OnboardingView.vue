<template>
  <FullPageContainer>
    <PartialFullScreenContentContainer>
        <div class="px-3 py-1 d-flex justify-content-between w-100 align-items-center">
            <Logo/>
            <div class="text-center">
                <h4 class="fw-bolder">On Boarding</h4>
                <span>Complete these initial setup configurations to get started</span>
            </div>
            <div>&nbsp;</div>
        </div>
        <div class="d-flex justify-content-center align-self-stretch px-3 partial-full-height">
            <StepperContainer 
                :pages="pages" 
                :disableAllTabNavigation="true"
                :emit-only="true"
                @on-next="onClickNextBtn"
                @on-skip="onClickSkipBtn"
                @on-previous="onClickPreviousBtn"
                @on-finish="onClickFinishBtn"
                :show-previous-btn="true"
                :active-page="activePageIndex"
                :is-disabled="isLoading"
                :is-finish-button-disabled="isFinishButtonDisabled">
                <component 
                    :is="'OnboardingStep'+(activePageIndex+1)+'Form'" 
                    :is-loading="isLoading"
                    @on-show-loader="showLoader" 
                    @on-hide-loader="hideLoader" 
                    @on-session-expired="onSessionExpired"
                    :on-next-click="nextClickTally"
                    :on-skip-click="skipClickTally"
                    :on-finish-click="finishClickTally"
                    @on-proceed-to-next="onProceedToNext"
                    @on-hide-next-button="onHideNextBtn"
                    @on-disable-finish-button="onDisableFinishButton"
                    @on-enable-finish-button="onEnableFinishButton"
                />
            </StepperContainer>
        </div>
    </PartialFullScreenContentContainer>
    <WorkspaceFooter /> 
  </FullPageContainer>
</template>

<script>
import FullPageContainer from '@/components/containers/FullPageContainer.vue'
import PartialFullScreenContentContainer from '@/components/containers/PartialFullScreenContentContainer.vue'
import Logo from '@/components/images/Logo.vue'
import WorkspaceFooter from '@/components/footers/WorkspaceFooter.vue'
import StepperContainer from '@/components/containers/StepperContainer.vue'
import OnboardingStep1Form from '@/components/forms/OnboardingStep1Form.vue'
import OnboardingStep2Form from '@/components/forms/OnboardingStep2Form.vue'
import OnboardingStep3Form from '@/components/forms/OnboardingStep3Form.vue'
import OnboardingStep4Form from '@/components/forms/OnboardingStep4Form.vue'
import OnboardingStep6Form from '@/components/forms/OnboardingStep6Form.vue'
import OnboardingStep5Form from '@/components/forms/OnboardingStep5Form.vue'
import {
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardTitle,
    MDBCardText,
    MDBBtn
} from "mdb-vue-ui-kit";

export default{
    components: {
        FullPageContainer,
        PartialFullScreenContentContainer,
        Logo,
        WorkspaceFooter,
        StepperContainer,
        OnboardingStep1Form,
        OnboardingStep2Form,
        OnboardingStep3Form,
        OnboardingStep4Form,
        OnboardingStep6Form,
        OnboardingStep5Form,
        MDBCard,
        MDBCardBody,
        MDBCardHeader,
        MDBCardTitle,
        MDBCardText,
        MDBBtn
    },
    props: {
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            pages: [{
                title: "Branches",
                number: 1,
                canSkip: false
            },{
                title: "Company Sites",
                number: 2,
                canSkip: true
            },{
                title: "System Users",
                number: 3,
                canSkip: false
            },{
                title: "Chart Of Accounts",
                number: 4,
                canSkip: true
            },{
                title: "Asset Categories",
                number: 5,
                canSkip: false
            },{
                title: "Upload Assets",
                number: 6,
                canSkip: false
            }],
            activePageIndex: 0,
            currentStep: 0,
            nextClickTally: 0,
            skipClickTally: 0,
            finishClickTally: 0,
            isFinishButtonDisabled: false
        }
    },
    methods:{
        showLoader(){
            this.$emit('on-show-loader');
        },
        hideLoader(){
            this.$emit('on-hide-loader');
        },
        onClickNextBtn(currentStep){
            this.currentStep = currentStep;
            this.nextClickTally += 1;
        },
        onClickSkipBtn(currentStep){
            this.currentStep = currentStep;
            this.skipClickTally += 1;
        },
        onProceedToNext(){
            var newPageIndex = this.currentStep.activePageIndex + 1;
            if(newPageIndex >= this.pages.length){
                newPageIndex = this.pages.length - 1;
            }
            this.activePageIndex = newPageIndex;
        },
        onClickPreviousBtn(currentStep){
            var newPageIndex = currentStep.activePageIndex - 1;
            if(newPageIndex <= 0){
                newPageIndex = 0;
            }
            this.activePageIndex = newPageIndex;
            this.currentStep = currentStep;
        },
        onSessionExpired(payload){
            this.$emit('on-session-expired', payload);
        },
        onClickFinishBtn(currentStep){
            this.currentStep = currentStep;
            this.finishClickTally += 1;
        },
        onDisableFinishButton(){
            this.isFinishButtonDisabled = true;
        },
        onEnableFinishButton(){
            this.isFinishButtonDisabled = false;
        },
    },
    mounted(){
        if(this.$route.params.step){
            var step = parseInt(this.$route.params.step);
            this.activePageIndex = step - 1;
            this.currentStep = step - 1;
        }
    }
}
</script>



<style scoped>
    .partial-full-height{
      min-height: calc(100vh - 110px);
    }
</style>