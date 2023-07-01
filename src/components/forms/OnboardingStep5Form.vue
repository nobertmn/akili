<template>
  <div class="d-flex flex-column">
    <div class="xmx-2">
      <div
        class="alert alert-info text-start w-fit"
        role="alert"
        data-mdb-color="primary"
        v-if="errorMessage.length == 0"
      >
        <b>*</b> Customize the following standard asset categories according to
        your company needs. <b class="text-primary">All categories must be linked to accounts</b>
      </div>

      <div
        class="alert alert-danger text-start w-fit"
        role="alert"
        data-mdb-color="danger"
        v-else
      >
        <b>*</b> {{errorMessage}}.
      </div>
    </div>
    <div class="flex-grow-1">
      <div class="d-flex flex-column">
        <div class="d-flex flex-column mt-2">
          <vue-good-table
            :columns="columns"
            :rows="rows"
            max-height="320px"
            :fixed-header="true"
            :line-numbers="true"
            compactMode
          >
            <template #table-actions>
              <IconButton
                kind="btn-primary"
                classes="p-8px mr-4px"
                @click="onClickAddAssetCategory"
              >
                <i class="fas fa-plus-square"></i> Create Asset Category
              </IconButton>
            </template>
            <template #emptystate>
              {{
                isLoading
                  ? "Loading..."
                  : rows.length == 0
                  ? "There are no asset catergories"
                  : ""
              }}
            </template>
            <template #table-row="props">
              <div v-if="props.column.field == 'actions'" style="min-width:65px; width:65px; text-align:right;" >
                  <IconButton 
                      kind="btn-warning" 
                      classes="p-4px mr-4px"
                      @click="onClickEditCatgeory(props.row)">
                      <i class="fas fa-edit"></i>
                  </IconButton>

                  <IconButton 
                      kind="btn-danger" 
                      classes="p-4px mr-4px"
                      @click="onClickDeleteCategory(props.row)">
                      <i class="fas fa-times-circle"></i>
                  </IconButton>
              </div>
              <div v-else-if="props.column.field == 'debit_account_id'" >
                <span>{{props.row.debitAccount.name}}</span>
              </div>
              <div v-else-if="props.column.field == 'credit_account_id'" >
                <span>{{props.row.creditAccount.name}}</span>
              </div>
              <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>
    </div>
    <SimpleModal
      id="onboardingAddAssetCategoryModal"
      :title="formMode=='add'?'Create Asset Category':'Edit Asset Category'"
      v-model="showModal"
      :show-close-btn="true"
      :ok-btn-text="formMode=='add'?'Submit':'Update'"
      @on-ok-btn-click="onClickSubmitAssetCategoryBtn"
      @on-close-btn-click="onClickCloseBtn"
      :show-top-close-btn="false"
    >
      <form novalidate class="d-flex flex-column">
        <FormErrors :errors="errors" classes="ps-0 pe-0" />

        <TextInput
          :id="formData.name.id"
          :label="formData.name.label"
          :errors="formData.name.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.name.value"
          classes="ps-0 pe-0"
        />

        <TextInput
          :id="formData.shortName.id"
          :label="formData.shortName.label"
          :errors="formData.shortName.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.shortName.value"
          classes="ps-0 pe-0"
        />

        <TextInput
          :id="formData.identifier.id"
          :label="formData.identifier.label"
          :tooltip="formData.identifier.tooltip"
          :errors="formData.identifier.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.identifier.value"
          classes="ps-0 pe-0"
        />

        <TextInput
          :id="formData.usefulYears.id"
          :label="formData.usefulYears.label"
          :errors="formData.usefulYears.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.usefulYears.value"
          classes="ps-0 pe-0"
        />

        <SelectInput
          :id="formData.debitAccount.id"
          :label="formData.debitAccount.label"
          :errors="formData.debitAccount.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.debitAccount.value"
          :items="debitAccounts"
          classes="ps-0 pe-0"
        />

        <SelectInput
          :id="formData.creditAccount.id"
          :label="formData.creditAccount.label"
          :errors="formData.creditAccount.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.creditAccount.value"
          :items="creditAccounts"
          classes="ps-0 pe-0"
        />

        <TextInput
          :id="formData.description.id"
          :label="formData.description.label"
          :errors="formData.description.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.description.value"
          :is-required="false"
          classes="ps-0 pe-0"
        />
      </form>
    </SimpleModal>
  </div>
</template>

<script >
import TextInput from "@/components/inputs/TextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import CompanyUsersImage from "@/components/images/CompanyUsersImage.vue";
import KeyValueList from "@/components/lists/KeyValueList.vue";
import InlineButton from "@/components/inputs/InlineButton.vue";
import Button from "../inputs/Button.vue";
import IconButton from "../inputs/IconButton.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import SimpleModal from "@/components/modals/SimpleModal.vue";

let getFormData = function () {
  return {
    name: {
      id: "onboarding-assetCategory-name-input",
      label: "Asset Category Name",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Name is required",
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 letters",
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required",
        },
      },
    },
    shortName: {
      id: "onboarding-assetCategory-short-name-input",
      label: "Short Name",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Short Name is required",
        maxLength: {
          value: 15,
          error: "Cannot be more than 15 letters",
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required",
        },
      },
      ref: "short_name"
    },
    identifier: {
      id: "onboarding-assetCategory-identifier-input",
      label: "Identifier Attribute Name",
      tooltip: "The thing that uniquely identifies assets under this asset class for example; Serial Number uniquely identifies computer assets",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Identifier is required",
        maxLength: {
          value: 60,
          error: "Cannot be more than 60 letters",
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required",
        },
      },
    },
    usefulYears: {
      id: "onboarding-assetCategory-usefulyears-input",
      label: "Estimated Useful Years",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Useful years is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 letters",
        },
        minLength: {
          value: 1,
          error: "Atleast 1 digit is required",
        },
      },
      ref: "useful_years"
    },
    debitAccount: {
      id: "onboarding-assetCategory-debitAccount-input",
      label: "Debit Account",
      tooltip: "Search Accounts",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: {
          error: "Debit Account is required",
          trim: false,
          wrongValues: ["","0",0]
        }
      },
      ref: "debit_account_id"
    },
    creditAccount: {
      id: "onboarding-assetCategory-creditAccount-input",
      label: "Credit Account",
      tooltip: "Search Accounts",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: {
          error: "Credit Account is required",
          trim: false,
          wrongValues: ["","0",0]
        }
      },
      ref: "credit_account_id"
    },
    description: {
      id: "onboarding-assetCategory-description-input",
      label: "Description",
      tooltip: "Describe the Asset Category ",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 250,
          error: "Cannot be more than 250 letters",
        },
      }
    },
  };
};

export default {
  components: {
    FormErrors,
    TextInput,
    CompanyUsersImage,
    KeyValueList,
    InlineButton,
    Button,
    IconButton,
    SelectInput,
    SimpleModal,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    onNextClick: {
      type: Number,
      default: 0,
    },
    onSkipClick: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      errors: [],
      formData: getFormData(),
      showModal: false,
      isFormSubmitting: false,
      creditAccounts: [],
      debitAccounts: [],
      columns: [
        {
          field: "name",
          label: "NAME",
          tdClass: 'w-25b0px',
        },
        {
          field: "identifier",
          label: "IDENTIFIER",
          tooltip: 'The name of the field used to uniquely identify an asset'
        },
        {
          field: "useful_years",
          label: "YEARS",
        },
        {
          field: "debit_account_id",
          label: "DEBIT",
          tdClass: 'w-150px',
        },
        {
          field: "credit_account_id",
          label: "CREDIT",
          tdClass: 'w-150px',
        },
        {
          field: "description",
          label: "REMARKS",
        },
        {
            label: '',
            field: 'actions'
        }
      ],
      rows: [],
      assetCategoryTypes: [
        {
          value: "NON-CURRENT ASSET",
          label: "NON-CURRENT ASSET",
        },
        {
          value: "CURRENT ASSET",
          label: "CURRENT ASSET",
        },
      ],
      formMode: "add",
      itemToEdit: null,
      errorMessage: ""
    };
  },
  watch: {
    onNextClick(val) {
      this.onClickNextBtn();
    },
  },
  methods: {
    ...Vm.fetch,
    ...Vm.post,
    ...Vm.update,
    ...Vm.delete,
    ...Vm.queryPost,
    loadDependencies() {
      this.fetch("onBoardingAsestCategoryDependencies", function (vm, res) {
        vm.debitAccounts = [...res.accounts];
        vm.creditAccounts = [...res.accounts];
        vm.rows = res.categories;
        vm.formMode = "add";
      });
    },
    onClickAddAssetCategory() {
      this.formMode = "add";
      this.showModal = true;
    },
    onClickCloseBtn() {
      this.onClickCancelEditAssetCategory();
    },
    onClickSubmitAssetCategoryBtn() {
      var vm = this;
      if(vm.formMode == "add"){
        vm.post("onBoardingAddAssetCategory", "formData", function (vm, res) {
          vm.onClickCancelEditAssetCategory();
          vm.loadDependencies();
        });
      }else if(vm.formMode == "edit"){
        vm.update("onBoardingUpdateAssetCategory", "formData", this.itemToEdit.id, function(vm, res){
            vm.onClickCancelEditAssetCategory();
            vm.loadDependencies();
        });
      }
    },
    onClickNextBtn() {
      var vm = this;
      vm.errorMessage = "";
      //make sure all the cateogries have a linked account
      var errorMessage = "";
      for (let index = 0; index < vm.rows.length; index++) {
        const category = vm.rows[index];
        if(category.debit_account_id.toString() == "0"){
          errorMessage = "Category - " + category.name +  " is missing a debit linked account. Please link all categories to accounts";
          break;
        }else if(category.credit_account_id.toString() == "0"){
          errorMessage = "Category - " + category.name +  " is missing a credit linked account. Please link all categories to accounts";
          break;
        }
      }
      if(errorMessage.length == 0){
        var formData = {};
        this.queryPost("saveOnBoardingStep5", formData, function(vm){
            //go to the next step
            vm.formData = getFormData();
            vm.errorMessage = "";
            vm.$emit("on-proceed-to-next");
        },function(vm, validatedFormData){  });
      }else{
        vm.errorMessage = errorMessage;
      }
    },
    onClickCancelEditAssetCategory() {
      this.showModal = false;
      this.formData = getFormData();
      this.errors = [];
    },
    onClickEditCatgeory(category){
      this.formMode = "edit";
      this.itemToEdit = category;
      this.formData = Utils.fillValues(this.formData, category);
      this.showModal = true;
    },
    onClickDeleteCategory(category){
      var vm = this;
      vm.delete("onBoardingDeleteAssetCategory", category, function(vm, res){
          vm.onClickCancelEditAssetCategory();
          vm.loadDependencies();
      });
    }
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>

