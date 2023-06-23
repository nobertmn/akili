<template>
  <ModulePageContainer 
    page-title="Accounting"
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
        title: "General <br /> Journal",
        iconClass: "uil uil-notebooks",
        tooltip: "Listing of all finacial transactions",
        link: "/accounting/transactions",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "General <br /> Ledger",
        iconClass: "uil uil-grid",
        tooltip: "The general ledger",
        link: "/accounting/general-ledger",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Chart Of <br /> Accounts  ",
        iconClass: "uil uil-list-ui-alt",
        tooltip: "View the different types of maintenance works",
        link: "/accounting/chart-of-accounts",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Expenses <br /> Management",
        iconClass: "uil uil-coins",
        tooltip: "Manage non asset expenses",
        link: "/accounting/expenses",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Expense <br /> Types",
        iconClass: "uil uil-usd-square",
        tooltip: "Types of expenses",
        link: "/accounting/expense-types",
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


