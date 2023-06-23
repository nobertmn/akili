<template>
  <ModulePageContainer 
    page-title="Assets Operations & Maintenance (O&M) "
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
        title: "Maintenance <br /> Activities",
        iconClass: "uil uil-calender",
        tooltip: "The full schedule of maintenance",
        link: "/maintenance/schedule",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Upcoming <br /> Works",
        iconClass: "uil uil-calendar-alt",
        tooltip: "View future upcoming scheduled maintenance works",
        link: "/maintenance/upcoming",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Shedule Work <br /> Types ",
        iconClass: "uil uil-wrench",
        tooltip: "View the different types of maintenance works",
        link: "/maintenance/works",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Impairments <br /> Management",
        iconClass: "uil uil-image-broken",
        tooltip: "View the different types of maintenance works",
        link: "/maintenance/impairments",
        id: "menu-item-dashboard",
        roleIds: [1]
      }
      ,{
        title: "Insurance <br /> Management",
        iconClass: "uil uil-shield-check",
        tooltip: "View the different insurance covers on the assets",
        link: "/maintenance/insurance",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Warranty <br /> Management",
        iconClass: "uil uil-award-alt",
        tooltip: "View the different warranties on the assets",
        link: "/maintenance/warranties",
        id: "menu-item-dashboard",
        roleIds: [1]
      }
      ]
    }
  },
  methods:{
    ...Vm.loaders
  },
  mounted() {

  },
};
</script>


