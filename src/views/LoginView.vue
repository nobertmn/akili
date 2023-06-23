<template>
  <FullPageContainer>
    <PartialFullScreenContentContainer>
      <div class="px-3 py-1">
        <Logo/>
      </div>
      <div class="d-flex justify-content-between align-self-stretch px-3 partial-full-height">
        <AuthPageHero 
          title="Simplified Cloud Asset Management Solution That Scales"
          sub-title="Mpola Asset Manager is a SAAS platform that manages all your distributed assets in on place even if your business has multiple branches."
          action-label="Signup To Get Started"
          :is-loading="isLoading"
        />
        <LoginForm
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

<script>
import FullPageContainer from '@/components/containers/FullPageContainer.vue'
import PartialFullScreenContentContainer from '@/components/containers/PartialFullScreenContentContainer.vue'
import Logo from '@/components/images/Logo.vue'
import AuthPageHero from '@/components/AuthPageHero.vue'
import LoginForm from '@/components/forms/LoginForm.vue'
import AuthPageFooter from '@/components/footers/AuthPageFooter.vue'


export default{
  components: {
    FullPageContainer,
    PartialFullScreenContentContainer,
    Logo,
    AuthPageHero,
    LoginForm,
    AuthPageFooter
  },
  props:{
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  methods:{
    showLoader(){
      this.$emit('on-show-loader')
    },
    hideLoader(){
      this.$emit('on-hide-loader')
    },
    handleSessionExpired(payload){
      this.$emit('on-session-expired', payload)
    }
  },
  mounted(){
    //console.log(this.$route.query['from-activate']);
  }
}
</script>

<style scoped>
    .partial-full-height{
      min-height: calc(100vh - 110px);
    }
</style>


