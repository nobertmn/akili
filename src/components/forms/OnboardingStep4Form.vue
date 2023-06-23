<template>
  <div class="d-flex flex-column">
    <div class="xmx-2">
        <div
            class="alert alert-info text-start w-fit"
            role="alert"
            data-mdb-color="primary"
        >
            <b>*</b> This is a standard chart of accounts based on your choosen company type: <b class="text-black">{{companyType?.name}}</b>
        </div>
    </div>
    <div class="flex-grow-1">
        <div class="d-flex flex-column">
            <div class="d-flex flex-column mt-2">
                <vue-good-table
                    :columns="columns"
                    :rows="rows"
                    max-height="300px"
                    :fixed-header="true"
                    :line-numbers="true"
                    compactMode >
                    <template #table-actions>
                        <IconButton 
                            kind="btn-primary" 
                            classes="p-8px mr-4px"
                            @click="onClickAddAccount">
                            <i class="fas fa-plus-square"></i> Create Account
                        </IconButton>
                    </template>
                    <template #emptystate>
                        {{isLoading?'Loading...':(rows.length==0?'There are no accounts':'')}}
                    </template>
                    <template #table-row="props">
                        <div v-if="props.column.field == 'actions'" style="width:100%; text-align:right;" >
                            <IconButton 
                                kind="btn-warning" 
                                classes="p-4px mr-4px"
                                @click="onClickEditAccount(props.row)">
                                <i class="fas fa-edit"></i>
                            </IconButton>

                            <IconButton 
                                kind="btn-danger" 
                                classes="p-4px mr-4px"
                                @click="onClickDeleteAccount(props.row)">
                                <i class="fas fa-times-circle"></i>
                            </IconButton>
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
      id="onboardingAddAccountModal"
      :title="formMode=='add'?'Create Account':'Edit Account'"
      v-model="showModal"
      :show-close-btn="true"
      :ok-btn-text="formMode=='add'?'Submit':'Update'"
      @on-ok-btn-click="onClickSubmitAccountBtn"
      @on-close-btn-click="onClickCloseBtn"
      :show-top-close-btn="false"
    >
      <form novalidate class="d-flex flex-column">

        <FormErrors :errors="errors" classes="ps-0 pe-0" />

        <TextInput
            :id="formData.refNo.id"
            :label="formData.refNo.label"
            :errors="formData.refNo.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.refNo.value"
            classes="ps-0 pe-0"
        />

        <TextInput
            :id="formData.name.id"
            :label="formData.name.label"
            :errors="formData.name.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.name.value"
            classes="ps-0 pe-0"
        />

        <SelectInput
            :id="formData.type.id"
            :label="formData.type.label"
            :errors="formData.type.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.type.value"
            :items="accountTypes"
            classes="ps-0 pe-0 mb-2"
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
    refNo: {
      id: "onbaording-accounts-refno-input",
      label: "Account Number",
      tooltip: "",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Account number is required",
        maxLength: {
          value: 60,
          error: "Cannot be more than 60 letters",
        },
        minLength: {
          value: 5,
          error: "Atleast 5 numbers are required",
        },
        digitsOnly: "Only numbers are allowed",
      },
      ref: "ref_no"
    },
    name: {
      id: "onbaording-accounts-name-input",
      label: "Account Name",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Name is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 letters"
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required"
        }
      }
    },
    type: {
      id: "onbaording-accounts-name-input",
      label: "Type",
      tooltip: "what type of account is this",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Account type is required"
      },
    }
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
    SimpleModal
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
        companyType: null,
        accounts: [],
        columns: [{
          field: 'ref_no',
          label: 'REF NO',
        },{
            field: 'name',
            label: 'NAME',
        },{
            field: 'type',
            label: 'TYPE',
        },{
            field: 'group',
            label: 'GROUP',
        },{
            field: 'statement_type',
            label: 'STATEMENT TYPE',
        },{
            label: '',
            field: 'actions'
        }],
        rows: [],
        accountTypes: [{
            value:"STOCKHOLDERS EQUITY",
            label: "STOCKHOLDERS EQUITY (BALANCE SHEET)"
        },{
            value:"PLANT, PROPERTY AND EQUIPMENT",
            label: "PLANT, PROPERTY AND EQUIPMENT (BALANCE SHEET)"
        },{
            value:"PLANT, PROPERTY AND EQUIPMENT",
            label: "PLANT, PROPERTY AND EQUIPMENT (BALANCE SHEET)"
        },{
            value:"OPERATING REVENUE",
            label: "OPERATING REVENUE (INCOME STATEMENT)"
        },{
            value:"OPERATING EXPENSES",
            label: "OPERATING EXPENSES (INCOME STATEMENT)"
        },{
            value:"NON-OPERATING REVENUE",
            label: "NON-OPERATING REVENUE (INCOME STATEMENT)"
        },{
            value:"NON CURRENT ASSETS",
            label: "NON CURRENT ASSETS (BALANCE SHEET)"
        },{
            value:"LONGTERM LIABILITIES",
            label: "LONGTERM LIABILITIES (BALANCE SHEET)"
        },{
            value:"CURRENT LIABILITIES",
            label: "CURRENT LIABILITIES (BALANCE SHEET)"
        },{
            value:"CURRENT ASSETS",
            label: "CURRENT ASSETS (BALANCE SHEET)"
        }],
        standardAccounts: [],
        customeAccounts: [],
        formMode: "add",
        itemToEdit: null
    };
  },
  watch: {
    onNextClick(val) {
      this.onClickNextBtn();
    },
    onSkipClick(val){
      this.onClickSkipBtn();
    },
  },
  methods: {
    ...Vm.fetch,
    ...Vm.post,
    ...Vm.update,
    ...Vm.delete,
    ...Vm.queryPost,
    loadDependencies() {
      this.fetch("onBoardingChartOfAccountsDependencies", function (vm, res) {
        var companyType = Utils.pick(
          res.companyTypes,
          "id",
          res.config.company_type
        );
        vm.companyType = companyType;
        vm.standardAccounts = [...companyType.accounts];
        vm.customeAccounts = [...res.accounts];
        if(res.accounts.length == 0){
            //use standard accounts
            vm.rows = [...companyType.accounts];
        }else{
            vm.rows = res.accounts;
        }
      });
    },
    onClickAddAccount(){
        this.formMode = "add";
        this.showModal = true;
    },
    onClickCloseBtn(){
        this.onClickCancelEditAccount();
    },
    onClickSubmitAccountBtn(){
        var vm = this;
        if(vm.formMode == "add"){
            vm.post("onBoardingAddAccounts", "formData", function(vm, res){
                vm.onClickCancelEditAccount();
                vm.loadDependencies();
            });
        }else if(vm.formMode == "edit"){
            vm.update("onBoardingUpdateAccount", "formData", this.itemToEdit.id, function(vm, res){
                vm.onClickCancelEditAccount();
                vm.loadDependencies();
            });
        }
    },
    onClickNextBtn() {
      this.queryPost("saveOnBoardingStep4", {}, function(vm){
          //go to the next step
          vm.formData = getFormData();
          vm.errors = []; //nyd apply these two lines to other pages that use Vm.js
          vm.$emit("on-proceed-to-next");
      },function(vm, validatedFormData){
          //this is just a dummy function, we dont have anything to do at this moment
      });
    },
    onClickCancelEditAccount(){
        this.showModal = false;
        this.formData = getFormData();
        this.errors = []; 
    },
    onClickEditAccount(account){
        this.formMode = "edit";
        this.itemToEdit = account;
        this.formData = Utils.fillValues(this.formData, account);
        this.showModal = true;
    },
    onClickDeleteAccount(account){
      var vm = this;
      vm.delete("onBoardingDeleteAccount", account, function(vm, res){
          vm.onClickCancelEditAccount();
          vm.loadDependencies();
      });
    },
    onClickSkipBtn(){
      this.onClickNextBtn();
    },
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>

