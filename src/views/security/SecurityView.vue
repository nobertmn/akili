<template>
  <ModulePageContainer 
    page-title="System Security"
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
        title: "Account <br/> Profile",
        iconClass: "uil uil-selfie",
        tooltip: "Manage Your Bio Data",
        link: "/security/profile",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "System <br/> Users",
        iconClass: "uil uil-users-alt",
        tooltip: "Manage System Users",
        link: "/security/users",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Role <br/> Permissions",
        iconClass: "uil uil-key-skeleton",
        tooltip: "View Permissions Assigned to User Groups",
        link: "/security/permissions",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "User <br/> Roles",
        iconClass: "uil uil-unlock",
        tooltip: "View Application User Groups",
        link: "/security/roles",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Audit Trails <br/> System Logs",
        iconClass: "uil uil-list-ul",
        tooltip: "View User and System Activites",
        link: "/security/logs",
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


