<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-100 px-1">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="mb-1">Heirachy Of Asset Categories</h4>
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
              <i class="fas fa-plus"></i> Add Category
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
          >
            {{ props.row.name}}
          </span>
          <span
            v-else-if="props.column.field == 'debit_account.name'"
            class="d-flex justify-content-end text-sm"
            style="padding-top: 3px;"
          >
            {{ props.row.debit_account.name + ' - ' + props.row.debit_account.ref_no}}
          </span>
          <span
            v-else-if="props.column.field == 'credit_account.name'"
            class="d-flex justify-content-end text-sm"
            style="padding-top: 3px;"
          >
            {{ props.row.credit_account.name + ' - ' + props.row.credit_account.ref_no}}
          </span>
        </template>
      </vue-good-table>
    </div>

    <SimpleModal
      :id="toBeEdited ? 'edit-category-modal' : 'add-category-modal'"
      :title="toBeEdited ? 'Edit Category' : (parentCategory != null? 'Add a sub category under - ' + parentCategory.name.toUpperCase(): 'Add a New Category')"
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
      <AddCategoryForm
        :is-loading="isLoading"
        @on-show-loader="showLoader"
        @on-hide-loader="hideLoader"
        @on-session-expired="onSessionExpired"
        @on-success="onFormSuccess"
        :pst="pst"
        :edits="toBeEdited"
        :context="context"
        :parent-category="parentCategory"
      />
    </SimpleModal>

    <SimpleModal
      id="delete-category-modal"
      title="Delete Category"
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
        :seed="{ category: [itemToDelete.id] }"
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
import AddCategoryForm from "@/components/forms/AddCategoryForm.vue";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import DeleteConcentForm from "@/components/forms/DeleteConcentForm.vue";

export default {
  components: {
      IconButton,
      AddCategoryForm,
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
          label: "Name",
          field: "name",
          sortable: false
        },
        {
          label: "Short Name",
          field: "short_name",
          sortable: false
        },
        {
          label: "Years",
          field: "useful_years",
          tdClass: "text-center",
          thClass: 'text-center',
          width: '100px',
          sortable: false
        },
        {
          label: "Debit",
          field: "debit_account.name",
          sortable: false,
          thClass: 'text-end',
        },
        {
          label: "Credit",
          field: "credit_account.name",
          sortable: false,
          thClass: 'text-end',
        },
        // {
        //   label: "Description",
        //   field: "description",
        //   tdClass: "mx-td-w-250 single-row",
        // },
        {
          label: "",
          field: "btn",
          sortable: false
        },
      ],
      rows: [],
      showFormModal: false,
      pst: 0,
      toBeEdited: null,
      showDeleteComfirmModal: false,
      itemToDelete: null,
      dataModel: [],
      categories: [],
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
      vm.fetch("categoriesDependencies", function (thisVm, res) {
        //vm.rows = res.categories;
        //convert to a tree
        var tree = Utils.getTree(
          res.categories,
          "id",
          "category_id",
          false,
          "children",
          true
        );
        var flatItems = Utils.flattenTree(tree);
        console.log(flatItems);
        vm.rows = flatItems;
      });
    },
    onClickAddBtn() {
      this.toBeEdited = null;
      this.context = "root";
      this.parentCategory = null;
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
      this.parentCategory = item;
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