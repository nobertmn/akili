<template>
    <IssueTransferForm
        context='receive'
        :edits="edits"
        :is-loading="isLoading"
        :pst="pst"
        @on-show-loader="showLoader"
        @on-hide-loader="hideLoader"
        @on-session-expired="onSessionExpired"
        @on-success="onIssueSuccess"
    />
</template>

<script >
import IssueTransferForm from "@/components/forms/IssueTransferForm.vue";
import Vm from "@/utils/Vm";
export default {
  components: {
    IssueTransferForm
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
    }
  },
  data() {
    return {
    };
  },
  methods: {
    ...Vm.loaders,
    onIssueSuccess(res){
        this.$emit("on-success", res);
    }
  }
};
</script>
