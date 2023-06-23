<template>
  <CardContainer :hasShadow="false" :show-title="false" :show-sub-title="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="">
        <div class="d-flex flex-row justify-content-start ">
            <SearchSelectInput
                :id="formData.assetId.id"
                :label="formData.assetId.label"
                :tooltip="formData.assetId.tooltip"
                :errors="formData.assetId.errors"
                :is-disabled="isLoading || isFormSubmitting || edits != null"
                v-model="formData.assetId.value"
                classes="ps-0 pe-0 "
                :items="assetsToSearch"
            />

            <SelectInput
                :id="formData.type.id"
                :label="formData.type.label"
                :errors="formData.type.errors"
                :tooltip="formData.type.tooltip"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.type.value"
                :items="disposalTypesItems"
                classes="ps-1 pe-0"
              />
        </div>
        <TextInput
            :id="formData.addedNotes.id"
            :label="formData.addedNotes.label"
            :errors="formData.addedNotes.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.addedNotes.value"
            classes="ps-0 pe-0"
            :is-required="false"
        />
        <div class="d-flex flex-row justify-content-start ">
            <TextInput
                :id="formData.purchaseCost.id"
                :label="formData.purchaseCost.label"
                :errors="formData.purchaseCost.errors"
                :is-disabled="true"
                v-model="formData.purchaseCost.value"
                classes="ps-0 pe-0"
                :is-required="false"
            />

            <TextInput
                :id="formData.usefulYears.id"
                :label="formData.usefulYears.label"
                :errors="formData.usefulYears.errors"
                :is-disabled="true"
                v-model="formData.usefulYears.value"
                classes="ms-1 me-1"
                :is-required="false"
            />

            <TextInput
                :id="formData.salvageAmount.id"
                :label="formData.salvageAmount.label"
                :errors="formData.salvageAmount.errors"
                :is-disabled="true"
                v-model="formData.salvageAmount.value"
                classes="ps-0 pe-0"
                :is-required="false"
            />

            
        </div>
        <div class="d-flex flex-row justify-content-start ">
            <TextInput
                :id="formData.currentValue.id"
                :label="formData.currentValue.label"
                :errors="formData.currentValue.errors"
                :is-disabled="true"
                v-model="formData.currentValue.value"
                classes="ps-0 pe-0"
                :is-required="false"
            />

            <TextInput
                :id="formData.currentAssetStatus.id"
                :label="formData.currentAssetStatus.label"
                :errors="formData.currentAssetStatus.errors"
                :is-disabled="true"
                v-model="formData.currentAssetStatus.value"
                classes="ms-1 me-1"
                :is-required="false"
            />

            <!-- this is not really saved in the db -->
            <TextInput
                :id="formData.currentAssetCondition.id"
                :label="formData.currentAssetCondition.label"
                :errors="formData.currentAssetCondition.errors"
                :is-disabled="true"
                v-model="formData.currentAssetCondition.value"
                classes="ps-0 pe-0"
                :is-required="false"
            />

            
        </div>
      </div>
    </form>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import SearchSelectInput from "@/components/inputs/SearchSelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import Data from "@/data/";

let getFormData = function () {
  return {
    assetId: {
      id: "add-disposal-bucket-asset-input",
      label: "Select Asset",
      tooltip: "Search and select the asset you want to mark for disposal",
      value: "",
      isValid: null,
      validations: {
        required: "Asset name is required",
      },
      ref: "asset_id",
    },
    type: {
      id: "add-disposal-bucket-type-input",
      label: "Disposal Type",
      tooltip: "The method desired to dispose this asset",
      value: "",
      isValid: null,
      validations: {
        required: "Disposal Type is required",
      }
    },
    addedNotes: {
      id: "add-disposal-bucket-reason-input",
      label: "Any Disposal Notes:",
      tooltip: "Include more information about the disposal of this asset",
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
      ref: "added_notes",
    },
    purchaseCost: {
      id: "add-disposal-bucket-cost-input",
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
        numeric: "Numeric value expected, dont include spaces",
      },
      ref: "purchase_cost",
    },
    usefulYears: {
      id: "add-disposal-bucket-usefulYears-input",
      label: "Useful Years",
      tooltip: "How may years are useful for this asset",
      value: "",
      isValid: null,
      validations: {
        required: "Useful years is required",
        maxLength: {
          value: 4,
          error: "Useful years cannot be more than 4 digits",
        },
        digitsOnly: "Only digits 0-9 are allowed",
      },
      ref: "useful_years",
    },
    salvageAmount: {
      id: "add-disposal-bucket-salvage-amount-input",
      label: "Salvage Amount",
      tooltip: "The throw way price",
      value: "",
      isValid: null,
      validations: {
        required: "Salvage amount is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        },
        numeric: "Numeric value expected, dont include spaces",
      },
      ref: "salvage_amount",
    },
    currentValue: {
      id: "add-disposal-bucket-current-value-input",
      label: "Current Value as of " + (Utils.dateToStandardDateString(new Date())),
      tooltip: "The current asset value",
      value: "",
      isValid: null,
      validations: {
        required: "Current value is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        },
        numeric: "Numeric value expected, dont include spaces",
      },
      ref: "current_value",
    },
    currentAssetStatus: {
      id: "add-disposal-bucket-current-status-input",
      label: "Current Status",
      tooltip: "The current asset status",
      value: "",
      isValid: null,
      validations: {
        required: "Current status is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        }
      },
      ref: "current_asset_status",
    },
    currentAssetCondition: {
      id: "add-disposal-bucket-current-condition-input",
      label: "Current Condition",
      tooltip: "The current asset condition",
      value: "",
      isValid: null,
      validations: {
        required: "Current condition is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        }
      },
      ref: "current_asset_condition"
    }
  };
};
export default {
  components: {
    CardContainer,
    TextInput,
    FormErrors,
    SelectInput,
    SearchSelectInput
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
  },
  data() {
    return {
      errors: [],
      formData: getFormData(),
      isFormSubmitting: false,
      assets: [],
      assetsToSearch: [],
      disposalTypesItems: Utils.toValueLabelList(Data.disposalTypes, "value", "label")
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
    "formData.assetId.value": function (val) {
      //set the other disabled fields
      if (val) {
        let assetId = parseInt(val);
        let asset = Utils.pick(this.assets, "id", assetId);
        if (asset && this.edits == null) {
          //During editing we wannt to maintain the other previous values
          //so we make the if codition above be .. && this.edits != null
          let valueData = Utils.getCurrentAssetValue(asset, true);
          //nyd we may need to round figures here and make sure we 
          //dont loose too much accuracy when saving in the db
          //and also these figures need to be formated with commas and 
          //aligned to the right for easy reading
          this.formData.salvageAmount.value = valueData.salvageAmount;
          this.formData.purchaseCost.value = asset.purchase_cost;
          this.formData.usefulYears.value = asset.useful_years;
          this.formData.currentValue.value = valueData.currentValue;

          this.formData.currentAssetStatus.value = asset.status;
          this.formData.currentAssetCondition.value = asset.condition;
        }
      }
    },
  },
  methods: {
    ...Vm.fetch,
    ...Vm.post,
    ...Vm.update,
    ...Vm.validateHelpers,
    ...Vm.loaders,
    ...Vm.upload,
    ...Vm.delete,
    loadDependencies() {
      if (this.edits != null) {
        this.editLoadDependencies();
      } else {
        this.postLoadDependencies();
      }
    },
    postLoadDependencies() {
      var vm = this;
      vm.fetch("addDisposalBucketAssetsDependencies", function (thisVm, res) {
        thisVm.prepareAssetSearching(res.assets);
      });
    },
    prepareAssetSearching(assetsList) {
      this.assets = assetsList;
      this.assetsToSearch = Utils.toSearchValueLabelList(
        assetsList,
        "id",
        "name"
      );
    },
    editLoadDependencies() {
      var vm = this;
      vm.fetch("updateDisposalBucketAssetsDependencies", function (thisVm, res) {
        thisVm.prepareAssetSearching(res.assets);
        //select the asset
        //during editing we cannot change the selected asset
        thisVm.formData.assetId.value = parseInt(thisVm.edits.asset_id);
      });
    },
    onSubmit() {
      var vm = this;
      vm.post("addDisposalBucketItem", "formData", function (vm, res) {
        vm.$emit("on-success");
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update(
        "updateDisposalBucketItem",
        "formData",
        this.edits.id,
        function (vm, res) {
          vm.$emit("on-success");
        }
      );
    }
  },
  mounted() {
    if (this.edits != null) {
      this.formData = Utils.fillValues(this.formData, this.edits);
    }
    this.loadDependencies();
  },
};
</script>
