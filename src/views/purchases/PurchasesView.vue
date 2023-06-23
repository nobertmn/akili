<template>
  <ModulePageContainer 
    page-title="Asset's Purchasing"
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
        title: "Asset <br /> Acquisitions",
        iconClass: "uil uil-file-plus-alt",
        tooltip: "How assets are acquired into the company/organisation",
        link: "/purchases/list",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Asset <br /> Recording",
        iconClass: "uil uil-file-bookmark-alt",
        tooltip: "Inputing acquired assets into the assets registry",
        link: "/purchases/recording",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Delivery <br /> Shortages",
        iconClass: "uil uil-folder-slash",
        tooltip: "Alisting of asset acquisations that were not delivered",
        link: "/purchases/short-delivery",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Suppliers <br /> Address Book",
        iconClass: "uil uil-user-plus",
        tooltip: "A listing of your suppliers info",
        link: "/purchases/suppliers",
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


