<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-3">
    <div class="w-90">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <h4 class="mb-1">Maintenance Work Types </h4>
        <Button label="Create Work Type" :is-disabled="isLoading" @on-click="onClickAddBtn" />
      </div>
      <vue-good-table
        :columns="columns"
        :rows="rows"
        styleClass="vgt-table striped"
        :line-numbers="true"
      >
        <template #table-row="props">
          <span v-if="props.column.field == 'btn'" class="d-flex justify-content-end">
            <IconButton 
                kind="btn-warning" 
                classes="p-4px mr-4px"
                @on-click="onClickEditTableBtn(props.row)" >
                <i class="fas fa-edit"></i> 
            </IconButton>
            <IconButton 
                kind="btn-danger" 
                classes="p-4px"
                @on-click="onClickDeleteTableBtn(props.row)" >
                <i class="fas fa-times-circle"></i>
            </IconButton>
          </span>
          <span v-else>
            {{props.formattedRow[props.column.field]}}
          </span>
        </template>
      </vue-good-table>
    </div>

    <SimpleModal
      :id="toBeEdited?'add-work-type-modal':'add-work-type-modal'"
      :title="toBeEdited?'Edit Maintenance Work Type':'Add a Maintenance Work Type'"
      v-model="showFormModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      :ok-btn-text="toBeEdited?'Save':'Submit'"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showFormModal=false"
      @on-ok-btn-click="onClickModalOkBtn"
    >
      <AddMaintenanceWorkTypeForm 
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
      id="delete-work-type-modal"
      title="Delete Maintenance Work Type Comfirmation"
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
        :seed="{ maintainance_work_type: [itemToDelete.id] }"
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
import Button from "@/components/inputs/Button.vue";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import AddMaintenanceWorkTypeForm from '@/components/forms/AddMaintenanceWorkTypeForm.vue';
import IconButton from '@/components/inputs/IconButton.vue';
import SelectInput from "@/components/inputs/SelectInput.vue";
import DeleteConcentForm from "@/components/forms/DeleteConcentForm.vue";

export default {
  components: {
    Button,
    SimpleModal,
    AddMaintenanceWorkTypeForm,
    IconButton,
    SelectInput,
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
          label: "Name",
          field: "name",
        },
        {
          label: "Days Gained",
          field: "life_time_increase_days",
          type: "number",
          tdClass: "pe-3"
        },
        {
          label: "Debit Account",
          field: "debit_account.name",
        },
        {
          label: "Credit Account",
          field: "credit_account.name",
        },
        {
          label: "Description",
          field: "description",
        },
        {
          label: "",
          field: "btn",
        }
      ],
      rows: [],
      showFormModal: false,
      pst: 0,
      toBeEdited: null,
      showDeleteComfirmModal: false,
      itemToDelete: null
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.delete,
    loadDependencies() {
      var vm = this;
      vm.fetch("workTypesDependencies", function (thisVm, res) {
        vm.rows = res.maintainanceWorkTypes;
      });
    },
    onClickAddBtn(){
      this.showFormModal = true;
    },
    onClickModalOkBtn(){
      this.pst += 1;
    },
    onFormSuccess(){
      this.toBeEdited = null;
      this.showFormModal = false;
      this.loadDependencies();
    },
    onClickEditTableBtn(item){
      this.toBeEdited = item;
      this.showFormModal = true;
    },
    onClickDeleteTableBtn(item){
      this.itemToDelete = item;
      this.showDeleteComfirmModal = true;
    },
    onClickDeleteModalOkBtn(){
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