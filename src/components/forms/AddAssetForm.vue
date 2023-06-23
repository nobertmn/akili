<template>
  <CardContainer
    :hasShadow="false"
    :show-title="false"
    :show-sub-title="false"
    classes="mb-0"
  >
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div>
        <StepperContainer
          :is-tabs-mode="true"
          :pages="pages"
          :active-page="activePageIndex"
          :is-disabled="isLoading"
          @on-page-change="onPageChange"
        >
          <div v-if="activePageIndex == 0" style="min-height: 350px">
            <div class="d-flex flex-row">
              <!-- nyd: when a category changes, add extra fields dynamically -->
              <SelectInput
                :id="formData.categoryId.id"
                :label="formData.categoryId.label"
                :errors="formData.categoryId.errors"
                :tooltip="formData.categoryId.tooltip"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.categoryId.value"
                :items="assetCategories"
                classes="ps-0 pe-1 w-50"
                @change="onSelectCategory"
              />
              
              
            </div>
            <div class="d-flex flex-row">

              <TextInput
                :id="formData.identifierNumber.id"
                :label="identityLabel"
                :tooltip="formData.identifierNumber.tooltip"
                :errors="formData.identifierNumber.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.identifierNumber.value"
                classes="ps-0 pe-1"
                :note="identityLabel!='Identifier'?'(Unique Identifier)':''"
              />

              <TextInput
                :id="formData.name.id"
                :label="formData.name.label"
                :tooltip="formData.name.tooltip"
                :errors="formData.name.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.name.value"
                classes="ps-1 pe-0"
              />
              
            </div>
            <div class="d-flex flex-row">
              
              <SelectInput
                :id="formData.isShared.id"
                :label="formData.isShared.label"
                :errors="formData.isShared.errors"
                :tooltip="formData.isShared.tooltip"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.isShared.value"
                :items="shareOptions"
                classes="ps-0 pe-1"
              />

              <TextInput
                :id="formData.usefulYears.id"
                :label="formData.usefulYears.label"
                :errors="formData.usefulYears.errors"
                :tooltip="formData.usefulYears.tooltip"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.usefulYears.value"
                classes="ps-1 pe-0"
              />
            </div>
            <div class="d-flex flex-row">
              <TextInput
                :id="formData.purchaseDate.id"
                :label="formData.purchaseDate.label"
                :errors="formData.purchaseDate.errors"
                :is-disabled="isLoading || isFormSubmitting"
                type="date"
                v-model="formData.purchaseDate.value"
                classes="ps-0 pe-1"
              />
              <TextInput
                :id="formData.purchaseCost.id"
                :label="formData.purchaseCost.label"
                :errors="formData.purchaseCost.errors"
                :tooltip="formData.purchaseCost.tooltip"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.purchaseCost.value"
                classes="ps-1 pe-0"
              />
            </div>
            <TextInput
              :id="formData.description.id"
              :label="formData.description.label"
              :errors="formData.description.errors"
              :tooltip="formData.description.tooltip"
              :is-disabled="isLoading || isFormSubmitting"
              v-model="formData.description.value"
              :is-required="false"
              classes="ps-0 pe-0"
            />
          </div>
          <div v-if="activePageIndex == 1" style="min-height: 350px">
            <div
              class="d-flex flex-row justify-content-between"
              style="flex-wrap: wrap"
            >
              <div
                v-for="(extraFieldDt, indexEtf) in extraFieldsData"
                :key="indexEtf"
                style="min-width: 48%; width: 48%"
              >
                <TextInput
                  :id="extraFieldDt.id"
                  :label="extraFieldDt.label"
                  :errors="extraFieldDt.errors"
                  :tooltip="extraFieldDt.tooltip"
                  :is-disabled="isLoading || isFormSubmitting"
                  v-model="extraFieldDt.value"
                  :is-required="extraFieldDt.isRequired"
                  classes="ms-0 ps-0 pe-0 capitalize-label"
                />
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
import FormErrors from "@/components/forms/FormErrors.vue";
import StepperContainer from "@/components/containers/StepperContainer.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

let getFormData = function () {
  return {
    identifierNumber: {
      id: "addasset-identifier-input",
      label: "Identifier",
      tooltip: "The unique identifier number/label for the asset",
      value: "",
      isValid: null,
      validations: {
        //nyd
        //for now there are no validations
      },
      ref: "identifier_number",
    },
    name: {
      id: "addasset-name-input",
      label: "Asset Name",
      tooltip: "The name of the asset",
      value: "",
      isValid: null,
      validations: {
        required: "Asset name is required",
        maxLength: {
          value: 200,
          error: "Cannot be more than 200 letters",
        },
        minLength: {
          value: 2,
          error: "Atleast 2 letters are required",
        },
      },
    },
    categoryId: {
      id: "addasset-category-id-input",
      label: "Asset Category",
      tooltip: "The category of the asset",
      value: "",
      isValid: null,
      validations: {
        required: "Catgeory is required",
      },
      ref: "category_id",
    },
    isShared: {
      id: "addasset-isshared-input",
      label: "Is a Shared Assset ?",
      tooltip: "Is this a shared asset",
      value: "",
      isValid: null,
      validations: {
        required: "Required",
      },
      ref: "is_shared",
    },
    description: {
      id: "addasset-description-input",
      label: "Description",
      tooltip: "provide a description for the asset",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 200,
          error: "Cannot be more than 200 letters",
        },
      },
    },
    purchaseCost: {
      id: "addasset-purchase-cost-input",
      label: "Purchase Cost",
      tooltip: "How much did the asset cost",
      value: "",
      isValid: null,
      validations: {
        required: "Purchase amount is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        },
        digitsOnly: "Only digits 0-9 are allowed",
      },
      ref: "purchase_cost",
    },
    purchaseDate: {
      id: "addasset-purchase-date-input",
      label: "Purchase Date",
      tooltip: "When was this asset bought",
      value: "",
      isValid: null,
      validations: {
        required: "Purchase date is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        },
      },
      ref: "purchase_date",
    },
    usefulYears: {
      id: "addasset-useful-years-input",
      label: "Useful Years",
      tooltip: "The useful years of the asset",
      value: "",
      isValid: null,
      validations: {
        required: "Useful years is required",
        maxLength: {
          value: 4,
          error: "Cannot be more than 4 digits",
        },
        digitsOnly: "Only digits 0-9 are allowed",
      },
      ref: "useful_years",
    },
  };
};
export default {
  components: {
    CardContainer,
    TextInput,
    FormErrors,
    SelectInput,
    StepperContainer,
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
    acquiredItem: {
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
      assetCategories: [],
      shareOptions: [
        {
          value: "yes",
          label: "Yes",
        },
        {
          value: "no",
          label: "No",
        },
      ],
      categories: [],
      indexedCategories: null,
      pages: [
        {
          title: "Primary Details",
          number: 1,
          canSkip: false,
        },
        {
          title: "Extra Fields",
          number: 2,
          canSkip: false,
        },
      ],
      activePageIndex: 0,
      extraFieldsData: [],
      editAssetDbExtraFields: [],
      indexedEditAssetDbExtraFields: {},
      identityLabel: "Identifier",
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
    ...Vm.validateHelpers,
    ...Vm.loaders,
    loadDependencies() {
      var vm = this;
      var apiName = "addAssetsDependencies";
      if (this.edits != null) {
        apiName = "updateAssetsDependencies";
      }
      vm.fetch(apiName, function (thisVm, res) {
        thisVm.indexedCategories = Utils.index(res.categories, "id");
        thisVm.categories = res.categories;
        thisVm.assetCategories = Utils.toValueLabelList(
          res.categories,
          "id",
          "name"
        );
        //if the for is recording the an acquired asset
        if(thisVm.acquiredItem != null){
          thisVm.formData.name.value = `item ${parseInt(thisVm.acquiredItem.quantity_recorded) + 1} --- ${thisVm.acquiredItem.name}`;
          thisVm.formData.description.value = thisVm.acquiredItem.specifications;
          thisVm.formData.purchaseCost.value = thisVm.acquiredItem.unit_price;
          thisVm.formData.purchaseDate.value = thisVm.acquiredItem.acquisition_order.delivery_date;
        }


        if (thisVm.edits != null) {
          thisVm.editAssetDbExtraFields = res.assetExtraFields;
          thisVm.indexedEditAssetDbExtraFields = Utils.index(res.assetExtraFields, "extra_field_id");
          //console.log("thisVm.indexedEditAssetDbExtraFields", thisVm.indexedEditAssetDbExtraFields);
          //initiate values of the extra fields
          thisVm.onSelectCategory(null);
        }
      });
    },
    onSubmit() {
      var vm = this;
      //validate extra fields
      let errorMsg = "Please correct the errors of the extra fields";
      let isValid = vm.validateListOfFormDataFields("extraFieldsData", errorMsg);
      if (isValid) {
        vm.post("addAsset", "formData", function (vm, res) {
          vm.$emit("on-success");
        });
      }
    },
    onSaveEdits() {
      var vm = this;
      //validate extra fields
      let errorMsg = "Please correct the errors of the extra fields";
      let isValid = vm.validateListOfFormDataFields("extraFieldsData", errorMsg);
      if (isValid) {
        vm.update("updateAsset", "formData", this.edits.id, function (vm, res) {
          vm.$emit("on-success");
        });
      }
    },
    onPageChange(page) {
      this.activePageIndex = parseInt(page);
    },
    onSelectCategory(x) {
      let selectedCategoryId = this.formData.categoryId.value.toString();
      let selectedCatgeory = this.indexedCategories[selectedCategoryId];

      //extra fields
      let assetExtraFieldsTemp = [];
      for (
        let index = 0;
        index < selectedCatgeory.extra_fields.length;
        index++
      ) {
        const extraField = selectedCatgeory.extra_fields[index];
        var isRequired = false;
        var validations = {};
        if (extraField.is_required.toString() == "1") {
          isRequired = true;
          validations = {
            required: extraField.name + " is required",
          };
        }
        let value = "";
        if (this.edits != null) {
          //get the value of the extra field from the db
          //but this only works if the category is still the same\
          var editsCategoryId = this.edits.category_id.toString();
          var formCategoryId = this.formData.categoryId.value.toString();
          if(editsCategoryId == formCategoryId){
            let dbEntry = this.indexedEditAssetDbExtraFields[extraField.id];
            value = dbEntry?dbEntry.value: "";
          }
        }
        assetExtraFieldsTemp.push({
          _fk_asset_id: "asset",
          extra_field_id: extraField.id,
          units: extraField.units,
          value: value, //value is both a UI and a db related property
          ///UI related properties
          id: "extrafield-" + extraField.id + "-input",
          label: extraField.name,
          isValid: null,
          validations: validations,
          errors: [],
          tooltip: "",
          isRequired: isRequired
        });
      }
      this.extraFieldsData = assetExtraFieldsTemp;

      //useful years
      if (this.edits != null) {
        var editsCategoryId = this.edits.category_id.toString();
        var formCategoryId = this.formData.categoryId.value.toString();
        if(editsCategoryId == formCategoryId){
          //dont override 
          this.formData.usefulYears.value = this.edits.useful_years;
        }else{
          this.formData.usefulYears.value = selectedCatgeory.useful_years;
        }
      }else{
        this.formData.usefulYears.value = selectedCatgeory.useful_years;
      }

      //the identity lable
      let catIdentifier = selectedCatgeory.identifier;
      if(catIdentifier && catIdentifier.length > 0){
        this.identityLabel = catIdentifier;
        this.formData.identifierNumber.validations = {
          required: catIdentifier + " is required"
        };
      }
      
    },
  },
  mounted() {
    if (this.edits != null) {
      this.formData = Utils.fillValues(this.formData, this.edits, function(name, value, item){
        if(name == "is_shared"){
          return value == "1"?"yes":"no";
        }
        return value;
      });
    }
    this.loadDependencies();
  },
};
</script>
