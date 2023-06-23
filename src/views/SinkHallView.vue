<script setup>
import FullPageContainer from '@/components/containers/FullPageContainer.vue'
import PartialFullScreenContentContainer from '@/components/containers/PartialFullScreenContentContainer.vue'
import Logo from '@/components/images/Logo.vue'
import AuthPageHero from '@/components/AuthPageHero.vue'
import SinkForm from '@/components/forms/SinkForm.vue'
import AuthPageFooter from '@/components/footers/AuthPageFooter.vue'
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
        />
        <SinkForm />
      </div>
    </PartialFullScreenContentContainer>
    <AuthPageFooter /> 
  </FullPageContainer>
</template>


