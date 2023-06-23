<template>
  <ModulePageContainer 
    page-title="System Notifications"
    :sub-menu-items="subMenuItems" 
    :user="user"
    >
    <RouterView 
      :is-loading="isLoading"
      @on-show-loader="showLoader" 
      @on-hide-loader="hideLoader" 
      @on-session-expired="onSessionExpired"
      :user="user"
    />
  </ModulePageContainer>
</template>

<script>
import { RouterView } from 'vue-router'
import ModulePageContainer from "@/components/containers/ModulePageContainer.vue";
import Utils from "@/utils"
import Vm from "@/utils/Vm";

export default {
  components: {
    ModulePageContainer,
    RouterView
  },
  props:{
    isLoading: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: function(){
        return Utils.defaultUser();
      }
    }
  },
  data(){
    return {
      subMenuItems: [{
        title: "Notifications <br />",
        iconClass: "uil uil-bell",
        tooltip: "A listing of all your notifications",
        link: "/notifications/alerts",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Messages <br /> (sms, emails)",
        iconClass: "uil uil-envelope-info",
        tooltip: "A listing of all messages",
        link: "/notifications/messages",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Disposal <br /> Bucket",
        iconClass: "uil uil-trash",
        tooltip: "Assets that have been marked and are awaiting disposal",
        link: "/notifications/disposal",
        id: "menu-item-dashboard",
        roleIds: [1]
      }]
    }
  },
  methods:{
    ...Vm.loaders
  },
  mounted() {

  },
};
</script>


