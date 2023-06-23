<template>
  <ModulePageContainer 
    page-title="System Settings &amp; Configurations"
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
        title: "General <br /> Configs",
        iconClass: "uil uil-cog",
        tooltip: "Manage general configurations",
        link: "/settings/configs",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Company <br /> Branches",
        iconClass: "uil uil-sitemap",
        tooltip: "Manage company branches",
        link: "/settings/branches",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Company <br /> Sites",
        iconClass: "uil uil-map-pin-alt",
        tooltip: "Manage company locations/sites",
        link: "/settings/sites",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "System <br/> Departments",
        iconClass: "uil uil-briefcase-alt",
        tooltip: "Avalilabe System Departments",
        link: "/settings/deparmtents",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Asset <br/> Custodians",
        iconClass: "uil uil-users-alt",
        tooltip: "People who are asssinged assets, custodians are not necessarily system users",
        link: "/settings/custodians",
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


