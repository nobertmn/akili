<template>
  <SimpleModal
    id="view-warranty-details-modal"
    :title="cmptModalTitle"
    v-model="showViewDetailsModal"
    :show-close-btn="true"
    :close-btn-text="cmptCloseBtnText"
    :show-ok-btn="context != 'view'"
    :ok-btn-text="context != 'view' ? 'Submit' : 'Ok'"
    :show-top-close-btn="context == 'view'"
    :is-headless="false"
    @on-close-btn-click="onCloseBtnClick"
    @on-ok-btn-click="onOkBtnClick"
    @on-hidden="onModalHidden"
    size="lgx"
  > 
    <AssetWarrantyViewer
      :is-loading="isLoading"
      @on-show-loader="showLoader"
      @on-hide-loader="hideLoader"
      @on-session-expired="onSessionExpired"
      :views="itemToView"
      :view-context="context"
      v-if="itemToView != null"
    />
  </SimpleModal>
</template>

<script>
import SimpleModal from "@/components/modals/SimpleModal.vue";
import Vm from "@/utils/Vm";
import { useModelWrapper } from "@/utils/modelWrapper";
import AssetWarrantyViewer from "@/components/viewers/AssetWarrantyViewer.vue";
import { MDBBtn } from "mdb-vue-ui-kit";


export default {
  components: {
    SimpleModal,
    AssetWarrantyViewer,
    MDBBtn
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    itemToView: {
      type: Object,
      default: function () {
        return null;
      },
    }
  },
  data() {
    return {
      showViewDetailsModal: false,
      context: "view",
      pst: 0,
    };
  },
  watch: {
    modelValue(val) {
      if (val == true) {
        this.context = "view";
        this.showViewDetailsModal = true;
      }else{

      }
    },
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    onRefreshList(updatedItem) {
        this.$emit('on-refresh-list', updatedItem);
    },
    onCloseBtnClick(){
        this.showViewDetailsModal = false;
        this.onCloseBtnClickSetup();
    },
    onModalHidden(){
        if(this.context == 'reject'
        || this.context == 'approve'){
        }else{
            this.onModalHiddenSetup();
        } 
    }
  },
  setup(props, { emit }) {
    return {
      inputDataModel: useModelWrapper(props, emit),
      onCloseBtnClickSetup() {
        props.inputDataModel = false;
        emit("on-close-btn-click");
      },
      onOkBtnClickSetup() {
        if (props.closeOnOkBtnClick == true) {
          props.inputDataModel = false;
          props.showViewDetailsModal = false;
        }
        emit("on-ok-btn-click");
      },
      onModalHiddenSetup() {
        props.inputDataModel = false;
        props.showViewDetailsModal = false;
        emit("on-close-btn-click");
      },
    };
  },
  computed: {
    cmptModalTitle() {
      let title = "Asset Warranty Details";
      return title;
    },
    cmptCloseBtnText() {
      let text = "Close";
      if (this.context != "view") {
        text = "Cancel";
      }
      return text;
    },
  },
};
</script>