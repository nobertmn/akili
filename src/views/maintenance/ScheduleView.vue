<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-90">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="mb-1" v-if="usage==''">Asset Maintenance Activities</h4>
        <h4 class="mb-1" v-if="usage=='upcoming'">Upcoming Maintenance Works</h4>
      </div>

      <vue-good-table
        :columns="columns"
        :rows="rows"
        styleClass="vgt-table striped"
        :line-numbers="true"
        max-height="400px"
        :fixed-header="true"
        compactMode
      >
        <template #table-actions v-if="usage==''">
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="d-flex align-items-center me-2">&nbsp;</div>
            <IconButton
              kind="btn-primary"
              classes="p-8px mr-4px"
              :is-disabled="isLoading"
              @click="onClickAddBtn"
              
            >
              <i class="fas fa-plus"></i> Schedule New Maintenance
            </IconButton>
          </div>
        </template>

        <template #table-row="props">
          <span
            v-if="props.column.field == 'btn'"
            class="d-flex justify-content-end"
          >
            <IconButton
              kind="btn-success"
              classes="p-4px mr-4px"
              @on-click="onClickViewTableBtn(props.row)"
            >
              <i class="fas fa-eye"></i>
            </IconButton>
            <IconButton
              kind="btn-warning"
              classes="p-4px mr-4px"
              @on-click="onClickEditTableBtn(props.row)"
              :is-disabled="
                (['pending', 'budgeted'].indexOf(props.row.status) < 0)
              "
            >
              <i class="fas fa-edit"></i>
            </IconButton>
            <IconButton
              kind="btn-danger"
              classes="p-4px"
              @on-click="onClickDeleteTableBtn(props.row)"
              :is-disabled="
                (['pending', 'rejected'].indexOf(props.row.status) < 0)
              "
            >
              <i class="fas fa-times-circle"></i>
            </IconButton>
          </span>

          <div
            v-else-if="props.column.field == 'status'"
            class="d-flex justify-content-end"
            :class="'mntn request-status-' + props.row.status"
          >
            {{ props.row.status }}
          </div>
        </template>
      </vue-good-table>
    </div>

    <AssetMaintenanceDetailsModal
      v-model="showViewDetailsModal"
      :is-loading="isLoading"
      :item-to-view="itemToView"
      @on-close-btn-click="showViewDetailsModal = false"
      @on-show-loader="showLoader"
      @on-hide-loader="hideLoader"
      @on-session-expired="onSessionExpired"
      @on-refresh-list="onRefreshList"
    />

    <SimpleModal
      :id="toBeEdited ? 'edit-maintenance-modal' : 'add-maintenance-modal'"
      :title="
        toBeEdited
          ? 'Edit Assets Maintenance Schedule'
          : 'Schedule Asset For Maintenance'
      "
      v-model="showFormModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      :ok-btn-text="toBeEdited ? 'Save' : 'Submit'"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showFormModal = false"
      @on-ok-btn-click="onClickModalOkBtn"
      size="lg"
    >
      <AddAssetMaintenanceForm
        :is-loading="isLoading"
        @on-show-loader="showLoader"
        @on-hide-loader="hideLoader"
        @on-session-expired="onSessionExpired"
        @on-success="onFormSuccess"
        :pst="pst"
        :edits="toBeEdited"
      />
    </SimpleModal>

    <SimpleModal
      id="delete-maintenace-modal"
      title="Delete Assets Maintenace Comfirmation"
      v-model="showDeleteComfirmModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      ok-btn-text="Delete"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showDeleteComfirmModal = false"
      @on-ok-btn-click="onClickDeleteModalOkBtn"
      okBtnColor="danger"
      okBtnWidth="120px"
      size="md"
      close-btn-text="cancel"
    >
      <DeleteConcentForm
        :is_loading="isLoading"
        :seed="{ maintenance: [itemToDelete.id] }"
        :pst="pst"
        :title="'This will remove the maintenace #' + itemToDelete.id"
        sub-title="Related Records To Be Removed:"
        @on-delete-success="onDeleteSuccess"
        @on-hide-loader="$emit('on-hide-loader')"
        @on-show-loader="$emit('on-show-loader')"
      />
    </SimpleModal>

  </div>
</template>

<script>
import Vm from "@/utils/Vm";
import IconButton from "@/components/inputs/IconButton.vue";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import AddAssetMaintenanceForm from "@/components/forms/AddAssetMaintenanceForm.vue";
import AssetMaintenanceDetailsModal from "@/components/modals/AssetMaintenanceDetailsModal.vue";
import DeleteConcentForm from "@/components/forms/DeleteConcentForm.vue";

export default {
  components: {
    IconButton,
    SimpleModal,
    AddAssetMaintenanceForm,
    AssetMaintenanceDetailsModal,
    DeleteConcentForm
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    usage: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      columns: [
        {
          label: "Identity",
          field: "asset.identifier_number",
        },
        {
          label: "Asset Name",
          field: "asset.name",
        },
        {
          label: "Scheduled Date",
          field: "scheduled_maintenance_date",
        },
        {
          label: "Performed Date",
          field: "performed_maintenance_date",
        },
        // {
        //   label: "Previous Date",
        //   field: "last_maintenance_date",
        // },
        // {
        //   label: "Next Date",
        //   field: "next_maintenance_date",
        // },
        {
          label: "Status",
          field: "status",
          thClass: "text-end"
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
      showDeleteComfirmModal: false,
      itemToDelete: null,
      itemToView: null,
      showViewDetailsModal: false,
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.delete,
    loadDependencies(callBack) {
      var vm = this;
      if (typeof callBack == "undefined") {
        callBack = function () {};
      }
      vm.fetch("maintenanceScheduleDependencies", function (thisVm, res) {
        thisVm.rows = res.maintenances;
        callBack();
      });
    },
    onClickAddBtn() {
      this.toBeEdited = null;
      this.itemToDelete = null;
      this.showFormModal = true;
    },
    onClickModalOkBtn() {
      this.pst += 1;
    },
    onFormSuccess() {
      this.showFormModal = false;
      this.loadDependencies();
    },
    onClickEditTableBtn(item) {
      //fetch assets extra fields
      this.toBeEdited = item;
      this.itemToDelete = null;
      this.showFormModal = true;
    },
    onClickDeleteTableBtn(item) {
      this.itemToDelete = item;
      this.toBeEdited = null;
      this.showDeleteComfirmModal = true;
    },
    onClickDeleteModalOkBtn() {
      this.pst += 1;
    },
    onDeleteSuccess() {
      this.itemToDelete = null;
      this.showDeleteComfirmModal = false;
      this.loadDependencies();
    },
    onClickViewTableBtn(item) {
      this.itemToView = item;
      this.showViewDetailsModal = true;
    },
    onRefreshList(currentViewedItem) {
      let vm = this;
      let temp = { ...currentViewedItem };
      vm.showViewDetailsModal = false;
      vm.itemToView = null;
      vm.loadDependencies(function () {
        vm.itemToView = temp;
        vm.showViewDetailsModal = true;
      });
    },
    comma(amount) {
      return Utils.comma(amount);
    },
    phpTimeToDateStr(phpTime) {
      return Utils.phpTimeToJsDateString(phpTime);
    },
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>