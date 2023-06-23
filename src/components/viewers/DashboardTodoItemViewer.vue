<template>
  <a
    class="d-flex flex-row align-items-center  "
    :class="viewItem.classes"
    style="padding: 5px; width: 100%; height: fit-content; margin-bottom: 2px;"
    :href="viewItem.link"
  >
    <i
      :class="viewItem.iconClass"
      class="text-black"
      style="font-size: 15px; line-height: 1"
    ></i>
    <div
      class="d-flex flex-row flex-grow-1 align-items-center justify-content-between"
      style="margin-left: 10px; margin-right: 10px"
    >
      <div
        class="text-black text-center text-truncate font-dash"
        style="font-size: 14px; "
        v-html="viewItem.label"
      >
      </div>
      <div
        class="text-black text-center text-truncate font-dash"
        style="font-weight: bold; "
        v-html="viewItem.value"
      >
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