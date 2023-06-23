<script setup>
import FullPageContainer from '@/components/containers/FullPageContainer.vue'
import PartialFullScreenContentContainer from '@/components/containers/PartialFullScreenContentContainer.vue'
import Logo from '@/components/images/Logo.vue'
import AuthPageHero from '@/components/AuthPageHero.vue'
import AuthPageFooter from '@/components/footers/AuthPageFooter.vue'
import ResetPasswordForm from '@/components/forms/ResetPasswordForm.vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['on-show-loader', 'on-hide-loader'])
function showLoader(){
  emit('on-show-loader')
}
function hideLoader(){
  emit('on-hide-loader')
}
</script>

<template>
  <FullPageContainer>
    <PartialFullScreenContentContainer>
      <div class="px-3 py-1">
        <Logo/>
      </div>
      <div class="d-flex justify-content-between align-self-stretch px-3">
        <AuthPageHero 
          title="Simplified Cloud Asset Management Solution That Scales"
          sub-title="Mpola Asset Manager is a SAAS platform that manages all your distributed assets in on place even if your business has multiple branches."
          action-label="Signup To Get Started"
          :is-loading="isLoading"
        />
        <ResetPasswordForm 
          :is-loading="isLoading"
          @on-show-loader="showLoader" 
          @on-hide-loader="hideLoader"
        />
      </div>
    </PartialFullScreenContentContainer>
    <AuthPageFooter />
  </FullPageContainer>
</template>

<style scoped>
    .partial-full-height{
      min-height: calc(100vh - 110px);
    }
</style>



