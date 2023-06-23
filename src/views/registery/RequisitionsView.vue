<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-90">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="mb-1">Requisitions For Assets </h4>
        <!-- nyd: add boxes that when clicked they switch on to filter by status -->
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
        <template #table-actions>
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="d-flex align-items-center me-2">
              <h5 class="me-2 mb-0">
                Pending: <b>{{ counts.pending }}</b>
              </h5>
              <h5 class="me-2 mb-0">
                Approved: <b>{{ counts.approved }}</b>
              </h5>
              <h5 class="me-2 mb-0">
                Collected: <b>{{ counts.collected }}</b>
              </h5>
              <h5 class="me-2 mb-0">
                Rejected: <b>{{ counts.rejected }}</b>
              </h5>
            </div>
            <IconButton
              kind="btn-primary"
              classes="p-8px mr-4px"
              :is-disabled="isLoading"
              @click="onClickAddBtn"
            >
              <i class="fas fa-plus"></i> Make Requisition
            </IconButton>
          </div>
        </template>
        <template #emptystate>
          {{
            isLoading
              ? "Loading..."
              : rows.length == 0
              ? "There are no uploaded records"
              : ""
          }}
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
              :is-disabled="props.row.status != 'pending'"
            >
              <i class="fas fa-edit"></i>
            </IconButton>
            <IconButton
              kind="btn-danger"
              classes="p-4px"
              @on-click="onClickDeleteTableBtn(props.row)"
            >
              <i class="fas fa-times-circle"></i>
            </IconButton>
          </span>
          <div
            v-else-if="props.column.field == 'status'"
            class="d-flex justify-content-center"
            :class="'request-status-' + props.row.status"
          >
            <span
              class="outdated"
              v-if="
                props.row.status == 'pending' &&
                (parseFloat(props.row.required_before_date_time)*1000) > timeNow
              "
            >
              Outdated
            </span>
            <span v-else>
              {{ props.row.status }}
            </span>
          </div>
          <div
            v-else-if="props.column.field == 'time_inserted'"
            class="d-flex justify-content-start"
          >
            {{ phpTimeToDateStr(props.row.time_inserted) }}
          </div>
          <template v-else>
            {{ props.formattedRow[props.column.field] }}
          </template>
        </template>
      </vue-good-table>
    </div>

    <!-- <SimpleModal
      id="view-requisition-modal"
      title="Requisition Details"
      v-model="showViewDetailsModal"
      :show-close-btn="true"
      close-btn-text="Close"
      :show-ok-btn="false"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showViewDetailsModal = false"
      size="lg"
    >
      <AssetRequisitionViewer
        :is-loading="isLoading"
        @on-show-loader="showLoader"
        @on-hide-loader="hideLoader"
        @on-session-expired="onSessionExpired"
        @on-refresh-list="onRefreshList"
        :views="itemToView"
      />
      <template slot="leftfooter">
        <IconButton
          kind="btn-danger"
          classes="p-4px"
          @click.prevent="onClickRejectRequisitionBtn(props.row)"
          v-if="itemToView.status == 'pending'"
        >
          <i class="fas fa-times-circle"></i> Reject
        </IconButton>
      </template>
    </SimpleModal> -->
    <AssetDetailsModal
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
      :id="toBeEdited ? 'add-requisition-modal' : 'add-requisition-modal'"
      :title="toBeEdited ? 'Edit Asset Requisition' : 'Post a New Asset Requisition'"
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
      <AddAssetRequisitionForm
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
      id="delete-requisition-modal"
      title="Delete Asset Requisition Comfirmation"
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
        :seed="{ requisition: [itemToDelete.id] }"
        :pst="pst"
        title="This requisition will be deleted. Please comfirm !!!"
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
import Utils from "@/utils/";
import Button from "@/components/inputs/Button.vue";
import IconButton from "@/components/inputs/IconButton.vue";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import AssetRequisitionViewer from "@/components/viewers/AssetRequisitionViewer.vue";
import AddAssetRequisitionForm from "@/components/forms/AddAssetRequisitionForm.vue";
import DeleteConcentForm from "@/components/forms/DeleteConcentForm.vue";
import AssetDetailsModal from "@/components/modals/AssetDetailsModal.vue";


export default {
  components: {
    Button,
    IconButton,
    SimpleModal,
    AddAssetRequisitionForm,
    DeleteConcentForm,
    AssetRequisitionViewer,
    AssetDetailsModal
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
          label: "Posted Date",
          field: "time_inserted",
        },
        {
          label: "Asset",
          field: "asset.name",
        },
        {
          label: "Requested By",
          field: "requesters_name",
        },
        {
          label: "Required Date",
          field: "required_before_date",
        },
        {
          label: "Created By",
          field: "user.name",
        },
        {
          label: "Status",
          field: "status",
        },
        {
          label: "",
          field: "btn",
        },
      ],
      rows: [],
      timeNow:  new Date().getTime(),
      showFormModal: false,
      pst: 0,
      toBeEdited: null,
      showDeleteComfirmModal: false,
      itemToDelete: null,
      itemToView: null,
      showViewDetailsModal: false,
      counts: {
        pending: 0,
        approved: 0,
        collected: 0,
        rejected: 0,
      },
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.delete,
    loadDependencies(callBack) {
      var vm = this;
      if(typeof callBack == 'undefined'){
        callBack = function(){};
      }
      vm.fetch("registryRequisitionsDependencies", function (thisVm, res) {
        thisVm.rows = res.requisitions;
        thisVm.setCounts();
        callBack();
      });
    },
    onClickAddBtn() {
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
      this.showFormModal = true;
    },
    onClickDeleteTableBtn(item) {
      this.itemToDelete = item;
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
    onClickViewTableBtn(item){
      this.itemToView = item;
      this.showViewDetailsModal = true;
    },
    onRefreshList(currentViewedItem){
      let vm = this;
      let temp = {... currentViewedItem};
      vm.showViewDetailsModal = false;
      vm.itemToView = null;
      vm.loadDependencies(function(){
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
    setCounts() {
      var counts = {
        pending: 0,
        approved: 0,
        collected: 0,
        rejected: 0,
      };
      for (let index = 0; index < this.rows.length; index++) {
        const row = this.rows[index];
        if (row.status == "pending") {
          counts.pending += 1;
        } else if (row.status == "approved") {
          counts.approved += 1;
        } else if (row.status == "collected") {
          counts.collected += 1;
        } else if (row.status == "rejected") {
          counts.rejected += 1;
        }
      }
      counts = {
        pending: Utils.comma(counts.pending),
        approved: Utils.comma(counts.approved),
        collected: Utils.comma(counts.collected),
        rejected: Utils.comma(counts.rejected),
      };
      this.counts = counts;
    },
  },
  computed: {
    pendingRequests() {
      let num = 0;
      return this.comma(num);
    },
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>