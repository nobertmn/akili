<template>
  <div class="w-100">
    <ScheduleView 
      :is-loading="isLoading"
      @on-show-loader="showLoader" 
      @on-hide-loader="hideLoader" 
      @on-session-expired="onSessionExpired"
      :user="user"
      usage="upcoming"
    />
  </div>
</template>

<script>
import ScheduleView from "@/views/maintenance/ScheduleView.vue";
import Vm from "@/utils/Vm";

export default {
  components: {
    ScheduleView
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...Vm.loaders
  }
};
</script>