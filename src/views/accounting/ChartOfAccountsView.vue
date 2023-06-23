<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-90 px-1">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="mb-1">Chart Of Accounts (CoA)</h4>
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
        <template #table-actions >
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="d-flex align-items-center me-2 ">
              
            </div>
            <IconButton
              kind="btn-primary"
              classes="p-8px mr-4px"
              :is-disabled="isLoading"
              @click="onClickAddBtn"
            >
              <i class="fas fa-plus"></i> Add Account
            </IconButton>
          </div>
        </template>
        <template #table-row="props">
          <span
            v-if="props.column.field == 'btn'"
            class="d-flex justify-content-end"
          >
            <IconButton
              kind="btn-info"
              classes="p-4px mr-4px"
              @on-click="onClickAddSubTableBtn(props.row)"
            >
              <i class="fas fa-plus" style="padding: 0px 4px; margin-bottom:2px;"></i>
            </IconButton>
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
            v-else-if="props.column.field == 'name'"
            :style="`padding-left: ${30*parseInt(props.row._level)}px;`"
            class="text-capitalize"
          >
          
            {{ props.row.name}}
          </span>
        </template>
      </vue-good-table>
    </div>

    <SimpleModal
      :id="toBeEdited ? 'edit-account-modal' : 'add-account-modal'"
      :title="toBeEdited ? 'Edit Account' : (parentAccount != null? 'Add a sub account under - ' + parentAccount.name.toUpperCase(): 'Add a New Account')"
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
      <AddCoAAccountForm
        :is-loading="isLoading"
        @on-show-loader="showLoader"
        @on-hide-loader="hideLoader"
        @on-session-expired="onSessionExpired"
        @on-success="onFormSuccess"
        :pst="pst"
        :edits="toBeEdited"
        :context="context"
        :parent-account="parentAccount"
      />
    </SimpleModal>

    <SimpleModal
      id="delete-account-modal"
      title="Delete Account"
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
        :seed="{ account: [itemToDelete.id] }"
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
import IconButton from "@/components/inputs/IconButton.vue";
import AddCoAAccountForm from "@/components/forms/AddCoAAccountForm.vue";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import DeleteConcentForm from "@/components/forms/DeleteConcentForm.vue";

export default {
  components: {
      IconButton,
      AddCoAAccountForm,
      SimpleModal,
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
          label: "Code",
          field: "ref_no",
          width: '100px',
          sortable: false
        },
        {
          label: "Account Name",
          field: "name",
          sortable: false,
          tdClass: "text-capitalise"
        },
        {
          label: "Type",
          field: "type",
          sortable: false,
          tdClass: "text-capitalise"
        },
        {
          label: "Group",
          field: "group",
          sortable: false,
          tdClass: "text-capitalise"
        },
        {
          label: "Statement",
          field: "statement_type",
          sortable: false,
          tdClass: "text-capitalise"
        },
        {
          label: "",
          field: "btn",
          sortable: false,
        },
      ],
      rows: [],
      showFormModal: false,
      pst: 0,
      toBeEdited: null,
      showDeleteComfirmModal: false,
      itemToDelete: null,
      dataModel: [],
      accounts: [],
      tree: [],
      context: "root"
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.delete,
    ...Vm.loaders,
    loadDependencies() {
      var vm = this;
      vm.fetch("accountingAccountsDependencies", function (thisVm, res) {
        thisVm.accounts = res.accounts;
        //convert to a tree
        var tree = Utils.getTree(
          res.accounts,
          "id",
          "account_id",
          false,
          "children",
          true
        );
        var flatItems = Utils.flattenTree(tree);
        console.log(flatItems);
        thisVm.rows = flatItems;
      });
    },
    onClickAddBtn() {
      this.toBeEdited = null;
      this.context = "root";
      this.parentAccount = null;
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
    onClickAddSubTableBtn(item){
      this.context = "sub";
      this.parentAccount = item;
      this.toBeEdited = null;
      this.showFormModal = true;
    },
    onClickDeleteTableBtn(item) {
      this.itemToDelete = item;
      this.showDeleteComfirmModal = true;
    },
    onDeleteSuccess() {
      this.itemToDelete = null;
      this.showDeleteComfirmModal = false;
      this.loadDependencies();
    },
    onClickDeleteModalOkBtn() {
      this.pst += 1;
    },
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>