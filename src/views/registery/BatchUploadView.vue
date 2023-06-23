<template>
    <div>
        <OnboardingStep6Form 
            :is-in-registry="true"
        />
    </div>
</template>

<script>
import OnboardingStep6Form from "@/components/forms/OnboardingStep6Form.vue";

export default {
  components: {
      OnboardingStep6Form
  }
}
</script>