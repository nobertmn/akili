<template>
  <ModulePageContainer 
    page-title="Asset's Register"
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
        title: "List of <br /> Assets",
        iconClass: "uil uil-clipboard-alt",
        tooltip: "A listing of all your assets",
        link: "/registery/list",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Batch <br /> Upload",
        iconClass: "uil uil-file-upload-alt",
        tooltip: "Upload assets via excell",
        link: "/registery/batch",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Asset <br /> Requisitions",
        iconClass: "uil uil-archive-alt",
        tooltip: "Requesting for acquisation of assets",
        link: "/registery/requisitions",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Transfers <br /> Of Assets",
        iconClass: "uil uil-exchange",
        tooltip: "Manage the process of asset relocations",
        link: "/registery/transfers",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Disposal <br /> Of Assets",
        iconClass: "uil uil-trash-alt",
        tooltip: "Disposing off of assets",
        link: "/registery/disposal",
        id: "menu-item-dashboard",
        roleIds: [1]
      },{
        title: "Asset <br /> Categories",
        iconClass: "uil uil-sitemap",
        tooltip: "Heirrachies Of Assets",
        link: "/registery/categories",
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


