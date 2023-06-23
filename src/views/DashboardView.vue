<template>
  <FullPageContainer>
    <PartialFullScreenContentContainer>
      <SideMenu @resize="onMenuResize" />
      <div :class="'workspace-wrapper ' + menuSizeClass">
        <div class="workspace">
          <div class="worspace-page-header" style="margin-bottom: 0px">
            <DashboardPillsWidget :user="user" />

            <UserTopRightHeaderViewer :user="user" />
          </div>

          <div class="d-flex">
            <DepDistPortfolioWidget :user="user" />

            <CallToActionWidget :user="user" />
          </div>

          <div class="d-flex">
            <CategoriesDistWidget 
              :user="user" 
              @on-session-expired="onSessionExpired"
            />
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
import Utils from "@/utils/";
import DashboardPillsWidget from "@/components/dashboard/DashboardPillsWidget.vue";
import DepDistPortfolioWidget from "@/components/dashboard/DepDistPortfolioWidget.vue";
import CallToActionWidget from "@/components/dashboard/CallToActionWidget.vue";
import CategoriesDistWidget from "@/components/dashboard/CategoriesDistWidget.vue";
import UserTopRightHeaderViewer from "@/components/viewers/UserTopRightHeaderViewer.vue";
import Vm from "@/utils/Vm";

export default {
  components: {
    FullPageContainer,
    PartialFullScreenContentContainer,
    WorkspaceFooter,
    SideMenu,

    UserTopRightHeaderViewer,
    DashboardPillsWidget,
    DepDistPortfolioWidget,
    CallToActionWidget,
    CategoriesDistWidget,
  },
  props: {
    user: {
      type: Object,
      default: function () {
        return Utils.defaultUser();
      },
    },
  },
  data() {
    return {
      menuSizeClass: "menu-shrinked",
    };
  },
  methods: {
    ...Vm.loaders,
    onMenuResize(cls) {
      this.menuSizeClass = cls;
    },
  },
};
</script>

<style scoped>
.partial-full-height {
  min-height: calc(100vh - 110px);
}
</style>


