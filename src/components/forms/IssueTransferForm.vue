<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-containerx pe-0 mb-2  justify-content-center">
        <StepperContainer
            :is-tabs-mode="true"
            :is-verticle="true"
            :pages="pages"
            :active-page="activePageIndex"
            :is-disabled="isLoading"
            @on-page-change="onPageChange"
        >
            <div v-if="activePageIndex == 0" style="min-height: 280px" class="py-1 p-1">
                <TextInput
                    :id="formData.transferDate.id"
                    :label="formData.transferDate.label"
                    :errors="formData.transferDate.errors"
                    :is-disabled="isLoading || isFormSubmitting"
                    type="date"
                    v-model="formData.transferDate.value"
                    classes="ps-o pe-0"
                />

                <TextAreaInput
                    :id="formData.issuedNotes.id"
                    :label="formData.issuedNotes.label"
                    :tooltip="formData.issuedNotes.tooltip"
                    :errors="formData.issuedNotes.errors"
                    :is-disabled="isLoading || isFormSubmitting"
                    v-model="formData.issuedNotes.value"
                    classes="ps-0 pe-0"
                    :is-required="false"
                />
            </div>
            <div v-if="activePageIndex == 1" style="min-height: 280px" class="py-1">
                <div class="p-2">
                    <div 
                        v-for="(formDataAsset, prop) in formDataAssets"
                        :key="prop"
                        class="d-flex justify-content-between align-items-center w-100 mt-1"
                    >
                        <div class="w-50 text-start align-items-center">
                            {{formDataAsset.assetName}}
                        </div>
                        <div class="text-start w-50">
                            <SelectInput
                                :id="formDataAsset.id"
                                :label="formDataAsset.label"
                                :errors="formDataAsset.errors"
                                :tooltip="formDataAsset.tooltip"
                                :is-disabled="isLoading || isFormSubmitting"
                                v-model="formDataAsset.value"
                                :items="conditionItems"
                                classes="ps-0 pe-0 pt-0"
                                :show-lable="false"
                            />
                        </div>
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
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import StepperContainer from "@/components/containers/StepperContainer.vue";
import Validator from "@/utils/Validator";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import Data from "@/data/";

let getIssueFormData = function () {
  return {
    transferDate: {
      id: "issuetransfer-transfer-date-input",
      label: "Transfer Date",
      tooltip: "When are/were the assets actually transfered",
      value: "",
      isValid: null,
      validations: {
        required: "Transfer date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "transfer_date",
    },
    issuedNotes: {
      id: "issuetransfer-reason-input",
      label: "Any Remarks:",
      tooltip: "Indicate any more details like a special note during issueing of the assets for transfer",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 500,
          error: "Cannot be more than 500 letters",
        }
      },
      setEmptyStringIfNull: true,
      ref: "issued_notes"
    }
  };
}

let getReceiveFormData = function () {
  return {
    transferDate: {
      id: "receivetransfer-transfer-date-input",
      label: "Received Date",
      tooltip: "When were the assets received",
      value: "",
      isValid: null,
      validations: {
        required: "Received date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "received_date",
    },
    issuedNotes: {
      id: "receivetransfer-reason-input",
      label: "Any Remarks:",
      tooltip: "Leave a comment upon receving of the assets",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 500,
          error: "Cannot be more than 500 letters",
        }
      },
      setEmptyStringIfNull: true,
      ref: "received_notes"
    }
  };
}

let getFormData = function (context) {
  if(typeof context == 'undefined'){
    context = 'issue';
  }
  if(context == 'issue'){
    return getIssueFormData();
  }else{
    return getReceiveFormData();
  }
};

export default {
  components: {
    CardContainer,
    TextAreaInput,
    FormErrors,
    SelectInput,
    StepperContainer,
    TextInput
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
      default: "issue",
    },
  },
  data() {
    return {
      errors: [],
      formData: getFormData(),
      isFormSubmitting: false,
      transferAssets: [],
      formDataAssets: {},
      conditionItems: Utils.toValueLabelList(Data.conditions, "value", "label"),
      pages: [
        {
          title: "Date & Remarks",
          number: 1,
          canSkip: false,
        },
        {
          title: "Assets Conditions",
          number: 2,
          canSkip: false,
        },
      ],
      activePageIndex: 0,
    };
  },
  watch: {
    pst(val) {
        this.onSaveEdits();
    },
  },
  methods: {
    ...Vm.fetch,
    ...Vm.update,
    ...Vm.loaders,
    loadDependencies() {
      var vm = this;
      vm.fetchItem("issueTransferAssetsDetails", vm.edits, function (thisVm, res) {
        thisVm.transferAssets = res.transferAssets;
        thisVm.resetAssetsFormData();
      });
    },
    onSaveEdits() {
        var vm = this;
        //validate assets conditions data
        let validationRes = Validator.validateFormData(vm.formDataAssets);
        if (validationRes.isValid) {
            vm.formDataAssets = validationRes.formData;
            vm.update("issueTransfer", "formData", vm.edits.id, function(thisVm, res){
                thisVm.$emit("on-success", res);
            });
        }else{
            vm.formDataAssets = validationRes.formData;
            vm.errors = ["Fix errors on the asset conditions tab"];
        }
    },
    resetAssetsFormData(){
        let temp = {};
        for (let index = 0; index < this.transferAssets.length; index++) {
            const transferAsset = this.transferAssets[index];
            var formProp = "transferAssetConditionFor" + transferAsset.id;
            var rf = "transfer_asset_condition_for" + transferAsset.id;
            temp[formProp] = {
                id: formProp,
                label: "",
                tooltip: "",
                errors: [],
                value: "",
                isValid: null,
                validations: {
                    required: "Select asset condition",
                },
                setEmptyStringIfNull: true,
                ref: rf,
                //asset details
                assetName: transferAsset.asset.name,
                transferAssetId: transferAsset.id,
                assetId: transferAsset.asset_id,
            }
        }
        this.formDataAssets = temp;
    },
    onPageChange(page) {
      this.activePageIndex = parseInt(page);
    },
  },
  mounted() {
    if (this.edits != null) {
        this.formData = getFormData(this.context);
        this.formData = Utils.fillValues(this.formData, this.edits);
    }
    this.loadDependencies();
  },
};
</script>
