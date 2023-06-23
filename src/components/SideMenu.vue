<template>
  <div
    class="main-menu menu-fixed menu-light menu-accordion menu-shadow"
    :class="{ expanded: expanded }"
    @mouseover="expandMenu"
    @mouseout="shrinkMenu"
    data-scroll-to-active="true"
  >
    <div class="navbar-header">
      <ul class="nav navbar-nav flex-row">
        <li class="nav-item me-auto">
          <Logo :inworkspace="true" />
        </li>
        <!--!-->
        <li class="nav-item nav-toggle">
          <a class="nav-link modern-nav-toggle pe-0"
            ><i
              class="d-none d-xl-block collapse-toggle-icon uil uil-record-audio"
            ></i
          ></a>
        </li>
      </ul>
    </div>
    <!--!-->
    <div class="shadow-bottom"></div>
    <div class="main-menu-content ps">
      <ul
        class="navigation navigation-main"
        id="main-menu-navigation"
        data-menu="menu-navigation"
      >
        <li
          v-for="(option, index) in menuOptions"
          :key="index"
          :id="option.id"
          class="nav-item"
          :class="{ active: option.isActive }"
        >
          <a class="d-flex align-items-center" :href="option.link"
            ><i :class="option.iconClass"></i
            ><!--!-->
            <span class="menu-title text-truncate" :data-i18n="option.title">{{
              option.title
            }}</span></a
          >
        </li>
      </ul>
      <div class="ps__rail-x" style="left: 0px; bottom: 0px">
        <div
          class="ps__thumb-x"
          tabindex="0"
          style="left: 0px; width: 0px"
        ></div>
      </div>
      <div class="ps__rail-y" style="top: 0px; right: 0px">
        <div
          class="ps__thumb-y"
          tabindex="0"
          style="top: 0px; height: 0px"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/images/Logo.vue";
import Utils from "@/utils";

export default {
  components: {
    Logo,
  },
  mounted() {},
  data() {
    return {
      expanded: false,
      menuOptions: [],
      indexedRoles: {},
    };
  },
  methods: {
    expandMenu() {
      this.expanded = true;
      this.$emit("resize", "menu-expanded");
    },
    shrinkMenu() {
      this.expanded = false;
      this.$emit("resize", "menu-shrinked");
    },
    yieldMenuOption(options, option) {
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
    setMenuOptions() {
      let options = [];
      options = this.yieldMenuOption(options, {
        title: "Dashboard",
        iconClass: "uil uil-home-alt",
        link: "/dashboard",
        id: "menu-item-dashboard",
        roleIds: [1],
      });
      options = this.yieldMenuOption(options, {
        title: "Notifications",
        iconClass: "uil uil-bell",
        link: "/notifications",
        id: "menu-item-notifications",
        roleIds: [1],
      });
      options = this.yieldMenuOption(options, {
        title: "Register",
        iconClass: "uil uil-building",
        link: "/registery",
        id: "menu-item-register",
        roleIds: [1],
      });
      options = this.yieldMenuOption(options, {
        title: "Purchases",
        iconClass: "uil uil-tag-alt",
        link: "/purchases",
        id: "menu-item-purchases",
        roleIds: [1],
      });
      // options = this.yieldMenuOption(options, {
      //   title: "Sales",
      //   iconClass: "uil uil-money-bill",
      //   link: "/sales",
      //   id: "menu-item-sales",
      //   roleIds: [1]
      // });
      options = this.yieldMenuOption(options, {
        title: "Operations",
        iconClass: "uil uil-wrench",
        link: "/maintenance",
        id: "menu-item-operations",
        roleIds: [1],
      });
      options = this.yieldMenuOption(options, {
        title: "Accounts",
        iconClass: "uil uil-invoice",
        link: "/accounting",
        id: "menu-item-accounts",
        roleIds: [1],
      });
      options = this.yieldMenuOption(options, {
        title: "Reports",
        iconClass: "uil uil-chart-line",
        link: "/reports",
        id: "menu-item-reports",
        roleIds: [1],
      });
      options = this.yieldMenuOption(options, {
        title: "Settings",
        iconClass: "uil uil-bright",
        link: "/settings",
        id: "menu-item-settings",
        roleIds: [1],
      });
      options = this.yieldMenuOption(options, {
        title: "Security",
        iconClass: "uil uil-lock",
        link: "/security",
        id: "menu-item-security",
        roleIds: [1],
      });
      this.menuOptions = options;
    },
  },
  mounted() {
    this.indexedRoles = Utils.getIndexedUserRoles();
    this.setMenuOptions();
  },
};
</script>



