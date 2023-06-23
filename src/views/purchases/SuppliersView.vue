<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-100 px-1">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="mb-1">Suppliers Address Book</h4>
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
        <template #table-actions>
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="d-flex align-items-center me-2"></div>
            <IconButton
              kind="btn-primary"
              classes="p-8px mr-4px"
              :is-disabled="isLoading"
              @click="onClickAddBtn"
            >
              <i class="fas fa-plus"></i> Add Supplier
            </IconButton>
          </div>
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
          <template v-else>
            {{ props.formattedRow[props.column.field] }}
          </template>
        </template>
      </vue-good-table>
    </div>

    <SimpleModal
      :id="toBeEdited ? 'edit-supplier-modal' : 'add-supplier-modal'"
      :title="toBeEdited ? 'Edit Supplier' : 'Add a New Supplier'"
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
      <AddSupplierForm
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
      id="delete-supplier-modal"
      title="Delete Supplier Comfirmation"
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
        :seed="{ supplier: [itemToDelete.id] }"
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
import AddSupplierForm from "@/components/forms/AddSupplierForm.vue";
import DeleteConcentForm from "@/components/forms/DeleteConcentForm.vue";

export default {
  components: {
    Button,
    IconButton,
    SimpleModal,
    AddSupplierForm,
    DeleteConcentForm,
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
          label: "Name",
          field: "name",
        },
        {
          label: "Type",
          field: "type",
        },
        {
          label: "Primary Contact",
          field: "primary_contact",
        },
        // {
        //   label: "Other Contact",
        //   field: "other_contact",
        // },
        // {
        //   label: "Email Address",
        //   field: "email",
        // },
        // {
        //   label: "Website",
        //   field: "website",
        // },
        {
          label: "Address",
          field: "address",
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
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.delete,
    ...Vm.loaders,
    loadDependencies() {
      var vm = this;
      vm.fetch("suppliersDependencies", function (thisVm, res) {
        thisVm.rows = res.suppliers;
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
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>