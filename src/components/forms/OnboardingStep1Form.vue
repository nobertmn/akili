<template>
    <form novalidate class="d-flex">
        <div class="flex-grow-1">  
            <CompanyBranchesImage />
            <div class="m-2">
                <div class="alert alert-info text-start" role="alert" data-mdb-color="primary">
                    <b>*</b> A default main branch was automatically created. <br/>
                    <b>*</b> Use this form to configure your company branches. <br/>
                    <b>*</b> Note that the default branch cannot be deleted, but is editable
                </div>
            </div>
            <KeyValueList :items="basicInfo" />
        </div>
        <div class="">
            <div class="d-flex flex-column">
                <FormErrors :errors="errors" />
                <div class="d-flex flex-column mt-2">
                    
                    <div class="pe-2 pb-2 bg-page border-bottom rounded-top">
                        <label class="kylist-value fw-bolder pt-2 text-start w-100 ps-2">
                            {{(branchesListMode == 'add')?'Company Branches':'Edit Company Branch'}}
                        </label>
                        <div class="d-flex" >
                            <TextInput
                                :id="branchesFormData.name.id"
                                :label="branchesFormData.name.label"
                                :tooltip="branchesFormData.name.tooltip"
                                :errors="branchesFormData.name.errors"
                                :required="true"
                                :is-disabled="isLoading || isFormSubmitting"
                                v-model="branchesFormData.name.value"
                                classes="pe-2"/>
                            <TextInput
                                :id="branchesFormData.location.id"
                                :label="branchesFormData.location.label"
                                :tooltip="branchesFormData.location.tooltip"
                                :errors="branchesFormData.location.errors"
                                :required="true"
                                :is-disabled="isLoading || isFormSubmitting"
                                v-model="branchesFormData.location.value"
                                classes="ps-0" />

                            <div style="min-width:175px;" v-if="branchesListMode == 'add'" >
                                <InlineButton
                                    label="Add Branch"
                                    @on-click="onClickAddBranch"
                                    :is-disabled="isLoading || isFormSubmitting"
                                />
                            </div>
                            <div class="d-flex " v-if="branchesListMode == 'edit'" style="width:175px;" >
                                <InlineButton
                                    label="Update"
                                    @on-click="onClickUpdateBranch"
                                    :is-disabled="isLoading || isFormSubmitting"
                                    classes="w-auto ps-1 pe-1 me-1"
                                />
                                <InlineButton
                                    label="Cancel"
                                    @on-click="onClickCancelEditBranch"
                                    :is-disabled="isLoading || isFormSubmitting"
                                    classes="w-auto ps-1 pe-1"
                                />
                            </div>
                        </div>
                    </div>
                    <MDBTable sm striped>
                        <tbody >
                            <tr v-for="(branch, index) in branches" :key="index" >
                                <td style="width:202px;" class="text-start ps-2">{{branch.name}}</td>
                                <td class="text-start ps-3">{{branch.location}}</td>
                                <td class="pe-2 text-end">
                                    <IconButton 
                                        kind="btn-warning" 
                                        classes="p-4px mr-4px"
                                        @on-click="onClickEditBranch(branch)" >
                                        <i class="fas fa-edit"></i> 
                                    </IconButton>
                                    <IconButton 
                                        kind="btn-danger" 
                                        classes="p-4px"
                                        :isDisabled="branch.id.toString() == '1'"
                                        @on-click="onClickDeleteBranch(branch)" >
                                        <i class="fas fa-times-circle"></i>
                                    </IconButton>
                                </td>
                            </tr>
                        </tbody>
                    </MDBTable>
                </div>
                <hr />
                <SelectInput
                    :id="formData.companyType.id"
                    :label="formData.companyType.label"
                    :tooltip="formData.companyType.tooltip"
                    :errors="formData.companyType.errors"
                    :required="true"
                    :is-disabled="isLoading || isFormSubmitting"
                    v-model="formData.companyType.value"
                    :items="companyTypes" />
            </div>
        </div>
    </form>
</template>

<script >
import TextInput from "@/components/inputs/TextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import CompanyBranchesImage from "@/components/images/CompanyBranchesImage.vue";
import KeyValueList from "@/components/lists/KeyValueList.vue";
import InlineButton from "@/components/inputs/InlineButton.vue";
import Button from '../inputs/Button.vue';
import IconButton from '../inputs/IconButton.vue';
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

import {
    MDBTable,
  } from 'mdb-vue-ui-kit';

let getBranchesFormData = function(){
    return {
        name: {
            id: "onbaording-branch-name-input",
            label: "Branch Name",
            tooltip: "A name of a branch",
            errors: [],
            value: "",
            isValid: null,
            validations: {
                required: "Branch name is required",
                maxLength: {
                    value: 150,
                    error: "Cannot be more than 150 letters"
                },
                minLength: {
                    value: 3,
                    error: "Atleast 3 letters are required"
                }
            },
        },
        location: {
            id: "onbaording-branch-name-input",
            label: "Location",
            tooltip: "The location of this branch",
            errors: [],
            value: "",
            isValid: null,
            validations: {
                required: "Branch location is required",
                maxLength: {
                    value: 150,
                    error: "Cannot be more than 150 letters"
                },
                minLength: {
                    value: 3,
                    error: "Atleast 3 letters are required"
                }
            },
        },
    }
};

let getFormData = function () {
    return {
        companyType: {
            id: "onbaording-company-type-input",
            label: "Company Type",
            tooltip: "The business type is used to load a relevant standardized chart of accounts for your industry",
            errors: [],
            value: "",
            isValid: null,
            validations: {
                required: "Please specify a company type"
            }
        }
  };
};


export default {
  components: {
    FormErrors,
    TextInput,
    CompanyBranchesImage,
    KeyValueList,
    InlineButton,
    Button,
    IconButton,
    SelectInput,
    MDBTable
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    onNextClick: {
        type: Number,
        default: 0,
    }
  },
  data() {
    return {
        errors: [],
        formData: getFormData(),
        branchesFormData: getBranchesFormData(),
        isFormSubmitting: false,
        companyTypes: [],
        branches: [],
        basicInfo: [],
        branchesListMode: "add",
        branchToEdit: null
    };
  },
  watch:{
      onNextClick(val){
          this.onClickNextBtn();
      }
  },
  methods: {
    ...Vm.fetch,
    ...Vm.post,
    ...Vm.update,
    ...Vm.delete,
    ...Vm.queryPost,
    loadDependencies(){
        this.fetch("onBoardingBranchesDependencies", function(vm, res){
            vm.companyTypes = res.companyTypes;
            vm.branches = res.branches;
            vm.formData.companyType.value = res.config.company_type;
            vm.basicInfo = [{
                key: "Company Name",
                value: res.config.company_name
            },{
                key: "Country ",
                value: res.config.country
            },{
                key: "Currency ",
                value: res.config.currency
            }];
        });
    },
    onClickAddBranch(){
        var vm = this;
        vm.post("addBranch", "branchesFormData", function(vm, res){
            vm.onClickCancelEditBranch();
            vm.loadDependencies();
        });
    },
    onClickDeleteBranch(branch){
        if(branch && branch.id.toString() == '1'){
            //nyd
            //display a popup that you cannot delete the main branch
            return false;
        }else if(branch){
            var vm = this;
            vm.delete("deleteBranch", branch, function(vmres, res){
                vmres.onClickCancelEditBranch();
                vmres.loadDependencies();
            });
        }
    },
    onClickEditBranch(branch){
        this.branchesListMode = "edit";
        this.branchToEdit = branch;
        this.branchesFormData = Utils.fillValues(this.branchesFormData, branch);
    },
    onClickCancelEditBranch(){
        this.branchesListMode = "add";
        this.branchToEdit = null;
        this.branchesFormData = getBranchesFormData();
    },
    onClickUpdateBranch(){
        var vm = this;
        vm.update("updateBranch", "branchesFormData", this.branchToEdit.id, function(vm, res){
            vm.onClickCancelEditBranch();
            vm.loadDependencies();
        });
    },
    onClickNextBtn(){
        var vm = this;
        var formData = {
            ...vm.formData,
            name:{
                ...vm.branchesFormData.name,
                errors: [],
                value: [...vm.branches],
                isValid: null,
                validations: {
                    minLength: {
                        value: 1,
                        error: "Add atleast one branch"
                    }
                }
            }
        };
        
        this.queryPost("saveOnBoardingStep1", formData, function(vm){
            //go to the next step
            vm.formData = getFormData();
            vm.$emit("on-proceed-to-next");
        },function(vm, validatedFormData){
            vm.branchesFormData.name = {
                ...vm.branchesFormData.name,
                errors: [...validatedFormData.name.errors],
                isValid: validatedFormData.name.isValid
            };
            vm.formData.companyType = {
                ... validatedFormData.companyType
            }
        });
    }
  },
  mounted(){
    this.loadDependencies();
  }
};
</script>

