<template>
  <FullPageContainer>
    <PartialFullScreenContentContainer>
      <SideMenu @resize="onMenuResize" />
      <div :class="'workspace-wrapper ' + menuSizeClass">
        <div class="workspace">
          <div class="worspace-page-header">
            <div class="left-side">
              <div class="module-nav">
                <div class="module-name-title">
                  {{pageTitle}}
                </div>
              </div>
              <div class="sub-menu-wrapper">
                <SubMenuItem
                  v-for="(subMenuItem, index) in subMenuOptions"
                  :key="index"
                  :item="subMenuItem"
                />
              </div>
            </div>
            <UserTopRightHeaderViewer :user="user" />
          </div>
          <div class="worspace-page-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </PartialFullScreenContentContainer>
    <WorkspaceFooter />
  </FullPageContainer>
</template>

<script>
import FullPageContainer from "@/components/containers/FullPageContainer.vue";
import PartialFullScreenContentContainer from "@/components/containers/PartialFullScreenContentContainer.vue";
import WorkspaceFooter from "@/components/footers/WorkspaceFooter.vue";
import SideMenu from "@/components/SideMenu.vue";
import SubMenuItem from "@/components/SubMenuItem.vue";
import UserTopRightHeaderViewer from "@/components/viewers/UserTopRightHeaderViewer.vue";
import Utils from "@/utils/";
import Http from "@/utils/Http";
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBIcon
} from 'mdb-vue-ui-kit';
import { ref } from 'vue';

export default {
  components: {
    FullPageContainer,
    PartialFullScreenContentContainer,
    WorkspaceFooter,
    SideMenu,
    SubMenuItem,
    UserTopRightHeaderViewer,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBIcon
  },
  props: {
    subMenuItems: {
      type: Array,
      default: [],
    },
    pageTitle:{
      type: String,
      default: ""
    },
    user: {
      type: Object,
      default: function(){
        return Utils.defaultUser()
      }
    }
  },
  data() {
    return {
      menuSizeClass: "menu-shrinked",
      indexedRoles: {},
      dropdown6: ref(false)
    };
  },
  methods: {
    onMenuResize(cls) {
      this.menuSizeClass = cls;
    },
    yieldSubMenuOption(options, option) {
      let path = this.$route.path;
      var canAccessMenuItem = false;
      for (let index = 0; index < option.roleIds.length; index++) {
        const roleId = parseInt(option.roleIds[index]);
        if (Object.hasOwnProperty.call(this.indexedRoles, roleId)) {
          canAccessMenuItem = true;
          break;
        }
      }
      if (canAccessMenuItem) {
        options.push({
          ...option,
          isActive: path.indexOf(option.link) == 0,
        });
      }
      return options;
    },
  },
  computed: {
    subMenuOptions() {
      var options = [];
      for (let index = 0; index < this.subMenuItems.length; index++) {
        const subMenuItem = this.subMenuItems[index];
        options = this.yieldSubMenuOption(options, subMenuItem);
      }
      return options;
    },
  },
  mounted() {
    this.indexedRoles = Utils.getIndexedUserRoles();
  },
};
</script>

<style scoped>
.partial-full-height {
  min-height: calc(100vh - 110px);
}
</style>


