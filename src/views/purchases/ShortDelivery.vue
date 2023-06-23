<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-90">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="mb-1">Asset's Not Delivered</h4>
      </div>

      <vue-good-table
        :columns="columns"
        :rows="rows"
        styleClass="vgt-table striped"
        :line-numbers="true"
        max-height="500px"
        :fixed-header="true"
        compactMode
      >
        <template #table-row="props">
          <span
            v-if="props.column.field == 'btn'"
            class="d-flex justify-content-end"
          >
            <!-- <IconButton
              kind="btn-success"
              classes="p-4px mr-4px"
              @on-click="onClickViewTableBtn(props.row)"
            >
              <i class="fas fa-eye"></i>
            </IconButton> -->
            <IconButton
              kind="btn-warning"
              classes="p-4px mr-4px"
              @on-click="onClickResolveTableBtn(props.row)"
              :is-disabled="props.row.is_rejected_resolved.toString() == '1'"
            >
              <i class="fas fa-edit"></i>
            </IconButton>
          </span>
          <div
            v-else-if="props.column.field == 'is_rejected_resolved'"
            class="d-flex justify-content-end"
          >
            <span v-if="props.row.is_rejected_resolved.toString() == '0'" class="acquisition-receive-item-status-pending">
              unresolved
            </span>
            <span v-else >
              fixed
            </span>
          </div>
        </template>
      </vue-good-table>
    </div>

    <SimpleModal
      id="resolve-shortage-modal"
      title="Mark Shortage As Resolved"
      v-model="showFormModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      :ok-btn-text="toBeEdited ? 'Save' : 'Submit'"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showFormModal = false"
      @on-ok-btn-click="onClickModalOkBtn"
      size="md"
    >
      <ResolveShortageForm
        :is-loading="isLoading"
        @on-show-loader="showLoader"
        @on-hide-loader="hideLoader"
        @on-session-expired="onSessionExpired"
        @on-success="onFormSuccess"
        :pst="pst"
        :edits="toBeEdited"
      />
    </SimpleModal>
  </div>
</template>

<script>
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import IconButton from "@/components/inputs/IconButton.vue";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import ResolveShortageForm from "@/components/forms/ResolveShortageForm.vue";


export default {
  components: {
      IconButton,
      SimpleModal,
      ResolveShortageForm
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      columns: [
        {
          label: "Item Name",
          field: "name",
        },
        {
          label: "Order Number",
          field: "acquisition_order.order_number",
        },
        // {
        //   label: "Grn Number",
        //   field: "acquisition_order.grn_number",
        // },
        // {
        //   label: "Pkg Label",
        //   field: "receive_package_identity_label",
        // },
        {
          label: "Ordered QTY",
          field: "quantity",
          type: "number",
          tdClass: "pe-3"
        },
        {
          label: "Received QTY",
          field: "quantity_delivered",
          type: "number",
          tdClass: "pe-3"
        },
        {
          label: "Balance QTY",
          field: "quantity_rejected",
          type: "number",
          tdClass: "pe-3"
        },
        {
          label: "Is Resolved",
          field: "is_rejected_resolved",
          type: "number"
        },
        {
          label: "",
          field: "btn",
        },
      ],
      rows: [],
      showFormModal: false,
      pst: 0,
      toBeEdited: null,
      itemToView: null,
      showViewDetailsModal: false,
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadDependencies(callBack) {
      var vm = this;
      if(typeof callBack == 'undefined'){
        callBack = function(){};
      }
      vm.fetch("assetShortagesDependencies", function (thisVm, res) {
        thisVm.rows = res.orderItems;
        callBack();
      });
    },
    onClickViewTableBtn(item){
      this.itemToView = item;
      this.showViewDetailsModal = true;
    },
    onClickResolveTableBtn(item) {
      this.toBeEdited = item;
      this.itemToView = null;
      this.showFormModal = true;
    },
    onClickModalOkBtn() {
      this.pst += 1;
    },
    onFormSuccess() {
      this.toBeEdited = null;
      this.itemToView = null;
      this.showFormModal = false;
      this.loadDependencies();
    },
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>