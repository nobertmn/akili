<template>
  <a
    class="d-flex flex-row align-items-center rounded "
    :class="viewItem.classes"
    style="padding: 5px; width: fit-content; height: 100%"
    :href="viewItem.link"
  >
    <i
      :class="viewItem.iconClass"
      class="text-white"
      style="font-size: 35px; line-height: 1"
    ></i>
    <div
      class="d-flex flex-column align-items-center"
      style="margin-left: 10px; margin-right: 10px"
    >
      <div
        class="text-white text-center text-truncate font-dash"
        style="font-size: 25px; line-height: 0.9; margin-bottom: 3px;"
      >
        {{viewItem.value}}
      </div>
      <div
        class="text-white text-center text-truncate font-dash"
        style="font-weight: bold; line-height: 0.9"
      >
        {{viewItem.label}}
      </div>
    </div>
  </a>
</template>

<script >
import Utils from "@/utils/";
export default {
  props: {
    viewItem: {
      type: Object,
      default: function () {
        return {
            link: "",
            iconClass: "",
            value: "",
            label: "",
            classes: "bg-primary"
        };
      },
    },
  },
  methods: {
    comma(val) {
      return Utils.comma(val);
    },
  },
};
</script>