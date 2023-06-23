<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-90">
      <div class="d-flex justify-content-between align-items-center ">
        <h4 class="mb-1">Assets Register</h4>
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
                Total no. of Registered Assets: <b>{{ formatMoney(rows.length) }}</b>
              </h5>
              <h5 class="mb-0">
                Total Available Assets Value: <b>{{ cmpTotalAssetsValue }} {{}}</b>
                <b class="text-muted">{{ currency }}</b>
              </h5>
            </div>
            <IconButton
              kind="btn-primary"
              classes="p-8px mr-4px"
              :is-disabled="isLoading"
              @click="onClickAddBtn"
            >
              <i class="fas fa-plus"></i> Add Asset
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
          <span
            v-else-if="props.column.field == 'is_shared'"
            class="d-flex justify-content-end"
          >
            {{ props.row.is_shared.toString() == "1" ? "Shared" : "No" }}
          </span>
          <span
            v-else-if="props.column.field == 'asset_value'"
            class="d-flex justify-content-end"
          >
            {{ getAssetValue(props.row) }}
          </span>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>

    <SimpleModal
      :id="toBeEdited ? 'edit-asset-modal' : 'add-asset-modal'"
      :title="toBeEdited ? 'Edit Asset' : 'Add a New Asset'"
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
      <AddAssetForm
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
      id="delete-asset-modal"
      title="Delete Asset Comfirmation"
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
        :seed="{ asset: [itemToDelete.id] }"
        :pst="pst"
        :title="`This will remove <b>${itemToDelete.name}</b>, are you sure ?`"
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
import AddAssetForm from "@/components/forms/AddAssetForm.vue";
import DeleteConcentForm from "@/components/forms/DeleteConcentForm.vue";

export default {
  components: {
    Button,
    IconButton,
    SimpleModal,
    AddAssetForm,
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
          field: "identifier_number",
        },
        {
          label: "Name",
          field: "name",
        },
        {
          label: "Category",
          field: "category.name",
        },
        {
          label: "Status",
          field: "status",
          tdClass: "text-start",
          thClass: "text-start"
        },
        {
          label: "Asset value",
          field: "asset_value",
          thClass: "text-end"
        },
        // {
        //   label: "Description",
        //   field: "description",
        //   tdClass: "mx-td-w-250 single-row",
        // },
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
    loadDependencies() {
      var vm = this;
      vm.fetch("registryListsDependencies", function (thisVm, res) {
        vm.rows = res.assets;
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
        if(["Disposed", "Lost Or Stolen"].indexOf(row.status) >= 0){
          continue;
        }
        let assetValue = Utils.getCurrentAssetValue(row);
        total += assetValue;
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