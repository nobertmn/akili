<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-3">
    <div class="w-75">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <h4 class="mb-1">Company Activity Sites </h4>
        <Button label="Add Site" :is-disabled="isLoading" @on-click="onClickAddBtn" />
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
                :isDisabled="props.row.id.toString() == '1'"
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
      :id="toBeEdited?'add-site-modal':'add-site-modal'"
      :title="toBeEdited?'Edit Site':'Add a Company Activity Site'"
      v-model="showFormModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      :ok-btn-text="toBeEdited?'Save':'Submit'"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showFormModal=false"
      @on-ok-btn-click="onClickModalOkBtn"
    >
      <AddSiteForm 
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
      id="delete-site-modal"
      title="Delete Site Comfirmation"
      v-model="showDeleteComfirmModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      ok-btn-text="Delete"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showDeleteComfirmModal=false"
      @on-ok-btn-click="onClickDeleteModalOkBtn"
      okBtnColor="danger"
      okBtnWidth="120px"
    >
      <h4>This will remove <b>{{itemToDelete.name}}</b></h4>
      <h4>Are you sure ?</h4>
    </SimpleModal>
  </div>
</template>

<script>
import Vm from "@/utils/Vm";
import Button from "@/components/inputs/Button.vue";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import AddSiteForm from '@/components/forms/AddSiteForm.vue';
import IconButton from '@/components/inputs/IconButton.vue';
import SelectInput from "@/components/inputs/SelectInput.vue";
export default {
  components: {
    Button,
    SimpleModal,
    AddSiteForm,
    IconButton,
    SelectInput
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
          label: "Branch",
          field: "branch.name",
        },
        {
          label: "Location",
          field: "location",
        },
        {
          label: "Remarks",
          field: "remarks",
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
      vm.fetch("settingsSitesDependencies", function (thisVm, res) {
        vm.rows = res.sites;
      });
    },
    onClickAddBtn(){
      this.showFormModal = true;
    },
    onClickModalOkBtn(){
      this.pst += 1;
    },
    onFormSuccess(){
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
      var vm = this;
      vm.delete("deleteSite", vm.itemToDelete, function(vmres, res){
        vm.itemToDelete = null;
        vm.showDeleteComfirmModal = false;
        vm.loadDependencies();
      });
    }
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>