<template>
    <form novalidate class="d-flex">
        <div class="" >  
            <CompanySitesImage />
            <div class="m-2">
                <div class="alert alert-info text-start" role="alert" data-mdb-color="primary">
                    <b>*</b> A default site was automatically created.<br/>
                    <b>*</b> Configure other operational sites for your company branches
                </div>
            </div>
            <KeyValueList :items="basicInfo" />
        </div>
        <div class="flex-grow-1">
            <div class="d-flex flex-column">
                <FormErrors :errors="errors" />
                <div class="d-flex flex-column mt-2">
                    <div class="pe-2 pb-2 bg-page border-bottom rounded-top">
                        <label class="kylist-value fw-bolder pt-2 text-start w-100 ps-2">
                            {{(sitesListMode == 'add')?'Company Sites':'Edit Company Site'}}
                        </label>
                        <div class="d-flex flex-column" >
                            <SelectInput
                                :id="formData.branchId.id"
                                :label="formData.branchId.label"
                                :tooltip="formData.branchId.tooltip"
                                :errors="formData.branchId.errors"
                                :required="true"
                                :is-disabled="isLoading || isFormSubmitting"
                                v-model="formData.branchId.value"
                                :items="branches"
                                classes="pe-0" />
                            <div class="d-flex ps-2" >
                                <TextInput
                                    :id="formData.name.id"
                                    :label="formData.name.label"
                                    :tooltip="formData.name.tooltip"
                                    :errors="formData.name.errors"
                                    :required="true"
                                    :is-disabled="isLoading || isFormSubmitting"
                                    v-model="formData.name.value"
                                    classes="ps-0"/>
                                <TextInput
                                    :id="formData.location.id"
                                    :label="formData.location.label"
                                    :tooltip="formData.location.tooltip"
                                    :errors="formData.location.errors"
                                    :required="true"
                                    :is-disabled="isLoading || isFormSubmitting"
                                    v-model="formData.location.value"
                                    classes="ps-0" />

                                <div  v-if="sitesListMode == 'add'" style="min-width:175px;" >
                                    <InlineButton
                                        label="Add Site"
                                        @on-click="onClickAddSite"
                                        :is-disabled="isLoading || isFormSubmitting"
                                        classes="w-autox ps-1 pe-1 me-1"
                                    />
                                </div>
                                <div class="d-flex " v-if="sitesListMode == 'edit'" style="width:175px;" >
                                    <InlineButton
                                        label="Update"
                                        @on-click="onClickUpdateSite"
                                        :is-disabled="isLoading || isFormSubmitting"
                                        classes="w-auto ps-1 pe-1 me-1"
                                    />
                                    <InlineButton
                                        label="Cancel"
                                        @on-click="onClickCancelEditSite"
                                        :is-disabled="isLoading || isFormSubmitting"
                                        classes="w-auto ps-1 pe-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <MDBTable sm striped>
                        <tbody >
                            <tr v-for="(site, index) in sites" :key="index" >
                                <td style="width:240px;" class="text-start ps-2">{{site.name}}</td>
                                <td style="" class="text-start ps-2">{{site.branch.name}}</td>
                                <td class="text-start ps-3">{{site.location}}</td>
                                <td class="pe-2 text-end" style="width:80px;">
                                    <IconButton 
                                        kind="btn-warning" 
                                        classes="p-4px mr-4px"
                                        @on-click="onClickEditSite(site)" >
                                        <i class="fas fa-edit"></i> 
                                    </IconButton>
                                    <IconButton 
                                        kind="btn-danger" 
                                        classes="p-4px"
                                        :isDisabled="site.id.toString() == '1'"
                                        @on-click="onClickDeleteSite(site)" >
                                        <i class="fas fa-times-circle"></i>
                                    </IconButton>
                                </td>
                            </tr>
                        </tbody>
                    </MDBTable>
                </div>
            </div>
        </div>
    </form>
</template>

<script >
import TextInput from "@/components/inputs/TextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import CompanySitesImage from "@/components/images/CompanySitesImage.vue";
import KeyValueList from "@/components/lists/KeyValueList.vue";
import InlineButton from "@/components/inputs/InlineButton.vue";
import Button from '../inputs/Button.vue';
import IconButton from '../inputs/IconButton.vue';
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

import {
    MDBTable,
  } from 'mdb-vue-ui-kit';

let getFormData = function(){
    return {
        branchId: {
            id: "onbaording-sites-branchid-input",
            label: "Branch",
            tooltip: "Select the branch that owns this site",
            errors: [],
            value: "",
            isValid: null,
            validations: {
                required: "Please select a branch"
            },
        },
        name: {
            id: "onbaording-sites-name-input",
            label: "Site Name",
            tooltip: "Specify a name for the site",
            errors: [],
            value: "",
            isValid: null,
            validations: {
                required: "Sites's name is required",
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
            id: "onbaording-sites-location-input",
            label: "Location",
            tooltip: "The location of the site",
            errors: [],
            value: "",
            isValid: null,
            validations: {
                required: "Site location is required",
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

export default {
  components: {
    FormErrors,
    TextInput,
    CompanySitesImage,
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
    },
    onSkipClick: {
        type: Number,
        default: 0,
    }
  },
  data() {
    return {
        errors: [],
        formData: getFormData(),
        isFormSubmitting: false,
        branches: [],
        sites: [],
        basicInfo: [],
        sitesListMode: "add",
        siteToEdit: null
    };
  },
  watch:{
      onNextClick(val){
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
    loadDependencies(){
        this.fetch("onBoardingSitesDependencies", function(vm, res){
            vm.branches = [...res.branches];
            vm.sites = res.sites;
            var companyType = Utils.pick(res.companyTypes, "value", res.config.company_type);
            vm.basicInfo = [{
                key: "Company Name",
                value: res.config.company_name
            },{
                key: "Country",
                value: res.config.country
            },{
                key: "Currency",
                value: res.config.currency
            },{
                key: "Company Type",
                value: companyType.label
            }];
        });
    },
    onClickAddSite(){
        var vm = this;
        vm.post("addSite", "formData", function(vm, res){
            vm.onClickCancelEditSite();
            vm.loadDependencies();
        });
    },
    onClickDeleteSite(site){
        if(site && site.id.toString() == '1'){
            //nyd
            //display a popup that you cannot delete the main branch
            return false;
        }else if(site){
            var vm = this;
            vm.delete("deleteSite", site, function(vmres, res){
                vmres.onClickCancelEditSite();
                vmres.loadDependencies();
            });
        }
    },
    onClickEditSite(site){
        this.sitesListMode = "edit";
        this.siteToEdit = {
            ...site,
            branchId: site.branch_id,
        }
        //nyd apply these two lines to other pages that use Vm.js
        this.errors = [];
        this.formData = getFormData(); 
        this.formData = Utils.fillValues(this.formData, this.siteToEdit);
    },
    onClickCancelEditSite(){
        this.sitesListMode = "add";
        this.siteToEdit = null;
        this.errors = []; //nyd apply these two lines to other pages that use Vm.js
        this.formData = getFormData();
    },
    onClickUpdateSite(){
        var vm = this;
        vm.update("updateSite", "formData", this.siteToEdit.id, function(vm, res){
            vm.onClickCancelEditSite();
            vm.loadDependencies();
        });
    },
    onClickNextBtn(){
        var vm = this;
        this.queryPost("saveOnBoardingStep2", {}, function(vm){
            //go to the next step
            vm.formData = getFormData();
            vm.errors = []; //nyd apply these two lines to other pages that use Vm.js
            vm.$emit("on-proceed-to-next");
        },function(vm, validatedFormData){
            //this is just a dummy function, we dont have anything to do at this moment
        });
    },
    onClickSkipBtn(){
        this.onClickNextBtn();
    },
  },
  mounted(){
    this.loadDependencies();
  }
};
</script>

