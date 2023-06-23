<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="">
        <StepperContainer
          :is-tabs-mode="true"
          :pages="pages"
          :active-page="activePageIndex"
          :is-disabled="isLoading"
          @on-page-change="onPageChange"
        >
          <div v-if="activePageIndex == 0" style="min-height: 350px">

              <SelectInput
                :id="formData.parentCategoryId.id"
                :label="formData.parentCategoryId.label"
                :tooltip="formData.parentCategoryId.tooltip"
                :errors="formData.parentCategoryId.errors"
                :is-disabled="edits == null ? true : (isLoading || isFormSubmitting)"
                v-model="formData.parentCategoryId.value"
                :items="categories"
                :is-required="false"
                classes="ps-0 pe-1 w-50"
                :note="context == 'root' ? '(optional)' : ''"
              />

            <div class="d-flex justify-content-between">
              <TextInput
                :id="formData.name.id"
                :label="formData.name.label"
                :tooltip="formData.name.tooltip"
                :errors="formData.name.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.name.value"
                classes="ps-0 pe-1"
              />

              <TextInput
                :id="formData.shortName.id"
                :label="formData.shortName.label"
                :tooltip="formData.shortName.tooltip"
                :errors="formData.shortName.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.shortName.value"
                classes="ps-1 pe-0"
              />
              
            </div>
            <div class="d-flex justify-content-between">
              <TextInput
                :id="formData.identifier.id"
                :label="formData.identifier.label"
                :tooltip="formData.identifier.tooltip"
                :errors="formData.identifier.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.identifier.value"
                classes="ps-0 pe-1"
              />

              <TextInput
                :id="formData.usefulYears.id"
                :label="formData.usefulYears.label"
                :tooltip="formData.usefulYears.tooltip"
                :errors="formData.usefulYears.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.usefulYears.value"
                classes="ps-1 pe-0"
              />
            </div>
            <div class="d-flex justify-content-between">
              <SelectInput
                :id="formData.debitAccountId.id"
                :label="formData.debitAccountId.label"
                :tooltip="formData.debitAccountId.tooltip"
                :errors="formData.debitAccountId.errors"
                :required="true"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.debitAccountId.value"
                :items="accounts"
                classes="ps-0 pe-1"
              />

              <SelectInput
                :id="formData.creditAccountId.id"
                :label="formData.creditAccountId.label"
                :tooltip="formData.creditAccountId.tooltip"
                :errors="formData.creditAccountId.errors"
                :required="true"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.creditAccountId.value"
                :items="accounts"
                classes="ps-1 pe-0"
              />
            </div>
            <TextAreaInput
              :id="formData.description.id"
              :label="formData.description.label"
              :tooltip="formData.description.tooltip"
              :errors="formData.description.errors"
              :is-disabled="isLoading || isFormSubmitting"
              v-model="formData.description.value"
              classes="ps-0 pe-0"
              :is-required="false"
              rows="1"
            />
          </div>
          <div v-if="activePageIndex == 1" style="min-height: 350px">
            <div class="d-flex justify-content-start align-items-end">
              <TextInput
                :id="extraFieldFormData.name.id"
                :label="extraFieldFormData.name.label"
                :errors="extraFieldFormData.name.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="extraFieldFormData.name.value"
                classes="ps-0 pe-0"
              />
              <SelectInput
                :id="extraFieldFormData.type.id"
                :label="extraFieldFormData.type.label"
                :tooltip="extraFieldFormData.type.tooltip"
                :errors="extraFieldFormData.type.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="extraFieldFormData.type.value"
                :items="dataTypes"
                :is-required="false"
                classes="ps-1 pe-1"
              />
              <IconButton
                kind="btn-success"
                classes="p-4px"
                @on-click="onClickAddExtraFieldBtn"
                style="height: 40px; width: 250px; margin-top: 18px"
              >
                <i class="fas fa-plus"></i> Add Field
              </IconButton>
            </div>
            <div
              class="d-flex justify-content-start align-items-end mt-1 lead nth-gray"
              style="padding-top: 5px; padding-bottom: 5px"
              v-for="(addedExtraField, xIndex) in addedExtraFields"
              :key="xIndex"
            >
              <div class="text-start text-capitalize w-75 ps-1">
                {{ addedExtraField.name.value }}
              </div>
              <div class="text-muted pe-1 ps-1 text-capitalize text-start w-25">
                {{ addedExtraField.type.value }}
              </div>
              <div class="flex-grow-1 pe-1 text-end">
                <IconButton
                  kind="btn-danger"
                  classes="p-4px"
                  @click.prevent="
                    onClickDeleteExtraFieldBtn(addedExtraField, xIndex)
                  "
                >
                  <i class="fas fa-times-circle"></i>
                </IconButton>
              </div>
            </div>
          </div>
        </StepperContainer>
      </div>
    </form>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import StepperContainer from "@/components/containers/StepperContainer.vue";
import Validator from "@/utils/Validator";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import Data from "@/data/";
import IconButton from "@/components/inputs/IconButton.vue";

let getFormData = function () {
  return {
    name: {
      id: "addcategory-name-input",
      label: "Catergory Name",
      tooltip: "Specify a name for the asset category",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Category name is required",
        maxLength: {
          value: 150,
          error: "Cannot be more than 150 letters",
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required",
        },
      },
    },
    usefulYears: {
      id: "addcategory-useful-years-input",
      label: "Useful Years",
      tooltip: "The years of usage given to assets in this category",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Useful years is required",
        digitsOnly: "Only digits are allowed",
      },
      ref: "useful_years",
    },
    debitAccountId: {
      id: "addcategory-debit-account-id-input",
      label: "Debit Account",
      tooltip: "Select the debit account",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Debit account is required",
      },
      ref: "debit_account_id",
    },
    creditAccountId: {
      id: "addcategory-credit-account-id-input",
      label: "Credit Account",
      tooltip: "Select the credit account",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Credit account is required",
      },
      ref: "credit_account_id",
    },
    description: {
      id: "addcategory-description-input",
      label: "Description",
      tooltip: "Any extra decription info for this asset category",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 500,
          error: "Cannot be more than 500 letters",
        },
      },
      setEmptyStringIfNull: true,
    },
    identifier: {
      id: "addcategory-identifier-input",
      label: "Unique Asset's Identifier Property",
      tooltip:
        "Am item property that uniquely identifies assets in this category",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Identifier name is required",
        maxLength: {
          value: 150,
          error: "Cannot be more than 150 letters",
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required",
        },
      },
    },
    parentCategoryId: {
      id: "addcategory-parent-id-input",
      label: "Parent Category",
      tooltip: "Optional: Select a parent category",
      errors: [],
      value: "",
      isValid: null,
      validations: {},
      ref: "category_id",
    },
    shortName: {
      id: "addcategory-short-name-input",
      label: "Short Name",
      tooltip: "The short name is used on graphs and other data reports as a replacement for the long name",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "short name is required",
        maxLength: {
          value: 15,
          error: "Cannot be more than 15 letters",
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required",
        },
      },
      ref: "short_name",
    },
  };
};
let getExtraFieldFormData = function () {
  return {
    name: {
      id: "addcategory-extrafield-name-input",
      label: "Extra Field Name",
      tooltip: "Specify a name of the extra field",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Extra field name is required",
        maxLength: {
          value: 150,
          error: "Cannot be more than 150 letters",
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required",
        },
      },
    },
    type: {
      id: "addcategory-extrafield-type-input",
      label: "Data Type",
      tooltip: "What data type if this field",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 letters",
        }
      }
    },
  };
};
export default {
  components: {
    CardContainer,
    TextInput,
    FormErrors,
    SelectInput,
    TextAreaInput,
    StepperContainer,
    IconButton
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    classes: {
      type: String,
      default: "",
    },
    pst: {
      type: Number,
      default: 0,
    },
    edits: {
      type: Object,
      default: function () {
        return null;
      },
    },
    context: {
      type: String,
      default: "root",
    },
    parentCategory:{
      type: Object,
      default: function () {
        return null;
      },
    },
  },
  data() {
    return {
      errors: [],
      formData: getFormData(),
      isFormSubmitting: false,
      accounts: [],
      categories: [],
      pages: [
        {
          title: "Category Details",
          number: 1,
          canSkip: false,
        },
        {
          title: "Category Extra Fields",
          number: 2,
          canSkip: false,
        },
      ],
      activePageIndex: 0,
      extraFieldFormData: getExtraFieldFormData(),
      dataTypes: Data.dataTypes,
      addedExtraFields: []
    };
  },
  watch: {
    pst(val) {
      if (this.edits == null) {
        this.onSubmit();
      } else {
        this.onSaveEdits();
      }
    },
  },
  methods: {
    ...Vm.fetch,
    ...Vm.post,
    ...Vm.update,
    loadDependencies() {
      if (this.edits != null) {
        this.editLoadDependencies();
      } else {
        this.postLoadDependencies();
      }
    },
    postLoadDependencies(){
        var vm = this;
        vm.fetch("addCategoriesDependencies", function (thisVm, res) {
            thisVm.categories = res.categories;
            thisVm.accounts = res.accounts;

            console.log(34);
            //if its adding  a subcategory
            if(thisVm.context != 'root' && thisVm.parentCategory != null){
              thisVm.formData.parentCategoryId.value = parseInt(thisVm.parentCategory.id);
            }
        });
    },
    editLoadDependencies() {
      var vm = this;
      vm.fetch("updateCategoryDependencies", function (thisVm, res) {
        thisVm.categories = res.categories;
        thisVm.accounts = res.accounts;
        //if we are editing then we need to load the added extra fields
        let  temp = [];
        for (let index = 0; index < res.extraFields.length; index++) {
          const extraField = res.extraFields[index];
          let formDataItem = getExtraFieldFormData();
          formDataItem = Utils.fillValues(formDataItem, extraField);
          temp.push(formDataItem);
        }
        thisVm.addedExtraFields = temp;
        
        //select the debit, credit, and parent category where necessary
        thisVm.formData.debitAccountId.value = parseInt(thisVm.edits.debit_account_id);
        thisVm.formData.creditAccountId.value = parseInt(thisVm.edits.credit_account_id);
        thisVm.formData.parentCategoryId.value = parseInt(thisVm.edits.category_id);
        
      });
    },
    onSubmit() {
      var vm = this;
      vm.post("addCategory", "formData", function (vm, res) {
        vm.$emit("on-success");
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update("updateCategory", "formData", this.edits.id, function (vm, res) {
        vm.$emit("on-success");
      });
    },
    onPageChange(page) {
      this.activePageIndex = parseInt(page);
    },
    onClickAddExtraFieldBtn(e) {
      if (e) {
        let validationRes = Validator.validateFormData(
          this.extraFieldFormData
        );
        if (validationRes.isValid) {
          this.errors = [];
          //yield the added extra field
          this.addedExtraFields.push({
            ...validationRes.formData
          });
          this.extraFieldFormData = getExtraFieldFormData();
        } else {
          this.extraFieldFormData = validationRes.formData;
        }
      }
    },
    onClickDeleteExtraFieldBtn(addedExtraField, xIndex) {
      var vm = this;
      var temp = [];
      for (let index = 0; index < vm.addedExtraFields.length; index++) {
        if (index != parseInt(xIndex)) {
          temp.push(vm.addedExtraFields[index]);
        }
      }
      vm.addedExtraFields = temp;
    },
  },
  mounted() {
    if (this.edits != null) {
      this.formData = Utils.fillValues(this.formData, this.edits);
    }
    this.loadDependencies();
  },
};
</script>
