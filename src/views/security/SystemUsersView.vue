<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-3">
    <div class="w-90">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <h4 class="mb-1">System Members, account status and roles</h4>
        <Button label="Add User" :is-disabled="isLoading" @on-click="onClickAddBtn" />
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
                v-if="props.row.status=='active'"
                kind="btn-danger" 
                classes="p-4px mr-4px"
                :isDisabled="props.row.id.toString() == '1'"
                @on-click="onClickDeActivateTableBtn(props.row)" >
                <i class="fa fa-check-circle"></i> deactivate
            </IconButton>
            <IconButton 
                v-else
                kind="btn-success" 
                classes="p-4px mr-4px"
                :isDisabled="props.row.id.toString() == '1'"
                @on-click="onClickActivateTableBtn(props.row)" >
                <i class="fa fa-check-circle"></i>activate &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
      :id="toBeEdited?'edit-users-modal':'add-users-modal'"
      :title="toBeEdited?'Edit User':'Register/Invite a User'"
      v-model="showFormModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      :ok-btn-text="toBeEdited?'Save':'Submit'"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showFormModal=false"
      @on-ok-btn-click="onClickModalOkBtn"
    >
      <AddUserForm 
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
      id="deactivate-users-modal"
      title="Deactivate User Comfirmation"
      v-model="showDeactivateComfirmModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      ok-btn-text="Deactivate"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showDeactivateComfirmModal=false"
      @on-ok-btn-click="onClickDeactivateModalOkBtn"
      okBtnColor="danger"
      okBtnWidth="120px"
    >
      <h4>This will deactivate <b>{{accountToVate.name}}</b></h4>
      <h4>Are you sure ?</h4>
    </SimpleModal>

    <SimpleModal
      id="activate-users-modal"
      title="Activate User Comfirmation"
      v-model="showActivateComfirmModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      ok-btn-text="Activate"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showActivateComfirmModal=false"
      @on-ok-btn-click="onClickActivateModalOkBtn"
      okBtnColor="success"
      okBtnWidth="120px"
    >
      <h4>This will deactivate <b>{{accountToVate.name}}</b></h4>
      <h4>Are you sure ?</h4>
    </SimpleModal>

    <SimpleModal
      id="delete-user-modal"
      title="Delete User Comfirmation"
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
      <h4>This will remove <b>{{accountToDelete.name}}</b></h4>
      <h4>Are you sure ?</h4>
    </SimpleModal>
  </div>
</template>

<script>
import Vm from "@/utils/Vm";
import Button from "@/components/inputs/Button.vue";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import AddUserForm from '@/components/forms/AddUserForm.vue';
import IconButton from '@/components/inputs/IconButton.vue';
export default {
  components: {
    Button,
    SimpleModal,
    AddUserForm,
    IconButton
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
          label: "Email",
          field: "email",
        },
        {
          label: "Role",
          field: "role.name",
        },
        {
          label: "Status",
          field: "status",
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
      showDeactivateComfirmModal: false,
      accountToVate: null,
      showActivateComfirmModal: false,
      updateFormData: {},
      showDeleteComfirmModal: false,
      accountToDelete: null
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.update,
    ...Vm.delete,
    loadDependencies() {
      var vm = this;
      vm.fetch("settingsUsersDependencies", function (thisVm, res) {
        vm.rows = res.users;
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
    onClickDeActivateTableBtn(item){
      this.accountToVate = item;
      this.showDeactivateComfirmModal = true;
    },
    onClickDeactivateModalOkBtn(){
      var vm = this;
      vm.update("adminDeactivateUserAccount", "updateFormData", vm.accountToVate.id, function (thisVm, res) {
        vm.accountToVate = null;
        vm.showDeactivateComfirmModal = false;
        vm.loadDependencies();
      });
    },
    onClickActivateTableBtn(item){
      this.accountToVate = item;
      this.showActivateComfirmModal = true;
    },
    onClickActivateModalOkBtn(){
      var vm = this;
      vm.update("adminActivateUserAccount", "updateFormData", vm.accountToVate.id, function (thisVm, res) {
        vm.accountToVate = null;
        vm.showActivateComfirmModal = false;
        vm.loadDependencies();
      });
    },
    onClickDeleteTableBtn(item){
      this.accountToDelete = item;
      this.showDeleteComfirmModal = true;
    },
    onClickDeleteModalOkBtn(){
      var vm = this;
      vm.delete("adminDeleteUser", vm.accountToDelete, function(vmres, res){
        vm.accountToDelete = null;
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