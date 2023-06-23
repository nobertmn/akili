<script setup>
import FullPageContainer from '@/components/containers/FullPageContainer.vue'
import PartialFullScreenContentContainer from '@/components/containers/PartialFullScreenContentContainer.vue'
import Logo from '@/components/images/Logo.vue'
import AuthPageHero from '@/components/AuthPageHero.vue'
import RegisterForm from '@/components/forms/RegisterForm.vue'
import AuthPageFooter from '@/components/footers/AuthPageFooter.vue'

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
function handleSessionExpired(payload){
  emit('on-session-expired', payload)
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
          sub-title="Its better to focus on delivering business value to your clients rather 
                than the management of assets."
          action-label="Signin To Login"
          :is-loading="isLoading"
        />
        <RegisterForm 
          :is-loading="isLoading"
          @on-show-loader="showLoader" 
          @on-hide-loader="hideLoader" 
          @on-session-expired="handleSessionExpired"
        />
      </div>
    </PartialFullScreenContentContainer>
    <AuthPageFooter />
  </FullPageContainer>
</template>


