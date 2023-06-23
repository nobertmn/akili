<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-90">
      <div class="d-flex justify-content-between align-items-center ">
        <h4 class="mb-1">Asset's Marked For Disposal</h4>
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
        <template #table-actions >
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="d-flex align-items-center me-2 ">
              <h5 class="me-2 mb-0">
                Pending Assets No: <b class="text-success">{{ cmpPendingAssetsCount }}</b>
              </h5>
              <h5 class="mb-0">
                Pending Assets Value: <b class="text-success">{{ cmpTotalAssetsValue }} {{}}</b>
                <b class="text-muted">{{ currency }}</b>
              </h5>
            </div>
            <IconButton
              kind="btn-primary"
              classes="p-8px mr-4px"
              :is-disabled="isLoading"
              @click="onClickAddBtn"
            >
              <i class="fas fa-plus"></i> Add Assets To Disposal Bucket
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
              kind="btn-warning"
              classes="p-4px mr-4px"
              @on-click="onClickEditTableBtn(props.row)"
              :isDisabled="props.row.status != 'marked'"
            >
              <i class="fas fa-edit"></i>
            </IconButton>
            <IconButton
              kind="btn-danger"
              classes="p-4px"
              @on-click="onClickDeleteTableBtn(props.row)"
              :isDisabled="props.row.status != 'marked'"
            >
              <i class="fas fa-times-circle"></i>
            </IconButton>
          </span>
          <span
            v-else-if="props.column.field == 'is_shared'"
            class="d-flex justify-content-end"
          >
            {{ props.row.asset.is_shared.toString() == "1" ? "Shared" : "No" }}
          </span>
          <span
            v-else-if="props.column.field == 'current_value'"
            class="d-flex justify-content-end"
          >
            {{ formatMoney(props.row.current_value) }}
          </span>
          <span
            v-else-if="props.column.field == 'status'"
            class="d-flex justify-content-end"
          >
            <span  :class="{'text-success': props.row.status == 'marked'}">
                <b>{{props.row.status}}</b>
            </span>
          </span>
          <template v-else>
            {{ props.formattedRow[props.column.field] }}
          </template>
        </template>
      </vue-good-table>
    </div>

    <SimpleModal
      :id="toBeEdited ? 'edit-asset-disposal-bucket-modal' : 'add-asset-disposal-bucket-modal'"
      :title="toBeEdited ? 'Edit Marked Asset Disposal ' : 'Add an Asset To Disposal Bucket'"
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
      <AddAssetsToDisposalBucketForm
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
      id="delete-asset-in-disposal-bucket-modal"
      title="Delete Asset In Disposal Bucket Comfirmation"
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
        :seed="{ disposal_bucket_item: [itemToDelete.id] }"
        :pst="pst"
        :title="`This will remove <b>${itemToDelete.asset.name}</b>, from the disposal bucket ?`"
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
import AddAssetsToDisposalBucketForm from "@/components/forms/AddAssetsToDisposalBucketForm.vue";
import DeleteConcentForm from "@/components/forms/DeleteConcentForm.vue";

export default {
  components: {
    Button,
    IconButton,
    SimpleModal,
    AddAssetsToDisposalBucketForm,
    DeleteConcentForm
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
          label: "Identity",
          field: "asset.identifier_number",
        },
        {
          label: "Name",
          field: "asset.name",
        },
        // {
        //   label: "Is Shared",
        //   field: "is_shared",
        // },
        // {
        //   label: "State",
        //   field: "current_asset_status",
        // },
        // {
        //   label: "Useful Years",
        //   field: "useful_years",
        // },
        {
          label: "Type",
          field: "type",
        },
        {
          label: "Date",
          field: "added_date",
        },
        {
          label: "Value",
          field: "current_value",
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
      currency: "",
      showFormModal: false,
      pst: 0,
      toBeEdited: null,
      showDeleteComfirmModal: false,
      itemToDelete: null,
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.delete,
    ...Vm.loaders,
    loadDependencies() {
      var vm = this;
      vm.fetch("disposalBucketDependencies", function (thisVm, res) {
        vm.rows = res.disposalBucketItems;
      });
    },
    onClickAddBtn() {
      this.showFormModal = true;
       this.toBeEdited = null;
       this.itemToDelete = null;
    },
    onClickModalOkBtn() {
      this.pst += 1;
    },
    onFormSuccess() {
      this.showFormModal = false;
      this.loadDependencies();
    },
    onClickEditTableBtn(item) {
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
    formatMoney(amount) {
      let value = parseFloat(amount);
      return value.toLocaleString();
    },
    getAssetValue(asset) {
      let assetValue = Utils.getCurrentAssetValue(asset);
      return this.formatMoney(assetValue);
    },
    onDeleteSuccess() {
      this.itemToDelete = null;
      this.showDeleteComfirmModal = false;
      this.loadDependencies();
    },
  },
  computed: {
    cmpTotalAssetsValue() {
      var total = 0;
      for (let index = 0; index < this.rows.length; index++) {
        const row = this.rows[index];
        if(row.status == "marked"){
            let assetValue = parseFloat(row.current_value);
            total += assetValue;
        }
      }
      return this.formatMoney(total);
    },
    cmpPendingAssetsCount() {
      var total = 0;
      for (let index = 0; index < this.rows.length; index++) {
        const row = this.rows[index];
        if(row.status == "marked"){
            total += 1;
        }
      }
      return this.formatMoney(total);
    },
  },
  mounted() {
    this.currency = JSON.parse(localStorage.getItem("config")).currency;
    this.loadDependencies();
  },
};
</script>