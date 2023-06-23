<template>
  <div
    class="right-side d-flex flex-column align-items-end justify-content-between"
  >
    <a
      class="ripple-surface d-flex flex-row align-items-center"
      href="javascript:void(0)"
      @click="onClickSignOut"
    >
      sign out &nbsp;
      <i class="uil uil-sign-out-alt text-danger"></i>
    </a>
    <a
      type="button"
      class="ripple-surface"
      style="color: unset"
      href="/security/profile"
    >
      <div class="d-flex">
        <div
          class="d-flex flex-column justify-content-end align-items-end px-1"
        >
          <span class="fw-bolder text-capitalize">{{ user?.name }}</span>
          <span class="">
            {{
              user.user_roles && user.user_roles.length > 0
                ? user.user_roles[0].role.name
                : ""
            }}
          </span>
        </div>
        <div class="d-flex align-items-center">
          <!-- Avatar -->
          <img
            :src="
              user.avatar && user.avatar.length > 0
                ? user.avatar
                : defaultAvatar
            "
            class="rounded-circle"
            height="40"
            width="40"
            alt=""
            loading="lazy"
          />
        </div>
      </div>
    </a>
  </div>
</template>


<script>
import Utils from "@/utils/";
import Http from "@/utils/Http";

export default {
  components: {},
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
      defaultAvatar: Utils.defaultUser().avatar,
    };
  },
  methods: {
    onClickSignOut() {
      Http.logout();
      this.$router.push("/");
    },
  },
};
</script>