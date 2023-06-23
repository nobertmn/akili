<template>
  <ModulePageContainer 
    page-title="System Reports"
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
        title: "Asset's <br/> Register",
        iconClass: "uil uil-building",
        tooltip: "The asset register report",
        link: "/reports/register",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Acquisitions <br/> Report",
        iconClass: "uil uil-file-plus-alt",
        tooltip: "The acquisitions report",
        link: "/reports/acquisitions",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Maintenance <br/> Report",
        iconClass: "uil uil-wrench",
        tooltip: "View Asset Maintenace Report",
        link: "/reports/maintenace",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Impairments <br/> Report",
        iconClass: "uil uil-image-broken",
        tooltip: "View Impairments report",
        link: "/reports/impairments",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Balance <br/> Sheet",
        iconClass: "uil uil-balance-scale",
        tooltip: "Balance sheets report",
        link: "/reports/balance-sheet",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Income <br/> Statement",
        iconClass: "uil uil-chart-line",
        tooltip: "Income Statements Report",
        link: "/reports/income-statement",
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


