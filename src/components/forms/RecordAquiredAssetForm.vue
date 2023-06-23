<template>
  <div class="d-flex flex-row justify-content-between">
    <div class="p-1 me-1">
        <AcquiredItemViewer :views="edits" />
    </div>
    <div class="flex-grow-1">
      <AddAssetForm
        :is-loading="isLoading"
        @on-show-loader="showLoader"
        @on-hide-loader="hideLoader"
        @on-session-expired="onSessionExpired"
        @on-success="onFormSuccess"
        :pst="pst"
        :acquired-item="edits"
      />
    </div>
  </div>
</template>

<script>
import AddAssetForm from "@/components/forms/AddAssetForm.vue";
import AcquiredItemViewer from "@/components/viewers/AcquiredItemViewer.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils";

export default {
  components: {
    AddAssetForm,
    AcquiredItemViewer
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    classes: {
      type: String,
      default: "",
    },
    pst: {
      type: Number,
      default: 0,
    },
    edits: {
      type: Object,
      default: function () {
        return null;
      },
    },
  },
  data() {
    return {
      basicInfo: [],
    };
  },
  methods: {
    ...Vm.loaders,
    onFormSuccess() {
      this.$emit("on-success");
    },
  },
  mounted() {
  },
};
</script>