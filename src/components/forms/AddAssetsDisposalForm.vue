<template>
  <CardContainer :hasShadow="false" :show-title="false" :show-sub-title="false">
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
            <div class="d-flex flex-row">
              <TextInput
                :id="formData.title.id"
                :label="formData.title.label"
                :errors="formData.title.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.title.value"
                classes="ps-0 pe-0"
              />
            </div>
            <div class="d-flex flex-row">
              <SelectInput
                :id="formData.branchId.id"
                :label="formData.branchId.label"
                :errors="formData.branchId.errors"
                :tooltip="formData.branchId.tooltip"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.branchId.value"
                :items="branchesItems"
                classes="ps-0 pe-1"
              />
              <TextInput
                :id="formData.scheduledDisposalDate.id"
                :label="formData.scheduledDisposalDate.label"
                :errors="formData.scheduledDisposalDate.errors"
                :is-disabled="isLoading || isFormSubmitting"
                type="date"
                v-model="formData.scheduledDisposalDate.value"
                classes="ps-1 pe-0"
              />
            </div>

            <TextAreaInput
              :id="formData.notes.id"
              :label="formData.notes.label"
              :tooltip="formData.notes.tooltip"
              :errors="formData.notes.errors"
              :is-disabled="isLoading || isFormSubmitting"
              v-model="formData.notes.value"
              classes="ps-0 pe-0"
              :is-required="false"
              rows="2"
              note="(e.g any reasons for disposal) "
            />
          </div>
          <div v-if="activePageIndex == 1" style="min-height: 350px">
            <div v-if="assetsToSearch.length > 0">
              <div class="d-flex justify-content-start align-items-end">
                <SearchSelectInput
                  :id="selectAssetFormData.disposalBucketItemId.id"
                  :label="selectAssetFormData.disposalBucketItemId.label"
                  :tooltip="selectAssetFormData.disposalBucketItemId.tooltip"
                  :errors="selectAssetFormData.disposalBucketItemId.errors"
                  :is-disabled="isLoading || isFormSubmitting"
                  v-model="selectAssetFormData.disposalBucketItemId.value"
                  classes="ps-0 pe-0 "
                  :items="assetsToSearch"
                />
                <!-- type of disposal -->

                <SelectInput
                  :id="selectAssetFormData.type.id"
                  :label="selectAssetFormData.type.label"
                  :errors="selectAssetFormData.type.errors"
                  :tooltip="selectAssetFormData.type.tooltip"
                  :is-disabled="isLoading || isFormSubmitting"
                  v-model="selectAssetFormData.type.value"
                  :items="disposalTypesItems"
                  classes="ps-1 pe-1"
                />

                <IconButton
                  kind="btn-success"
                  classes="p-4px"
                  @on-click="onClickAddAssetBtn"
                  style="height: 40px; width: 250px; margin-top: 18px"
                >
                  <i class="fas fa-plus"></i> Add Asset
                </IconButton>
              </div>
              <div class="mt-1">
                <MarkedAssetItem 
                  v-for="(selectedAsset, index) in selectedAssets"
                  :key="index"
                  :views="selectedAsset"
                  @on-click-delete="onClickDeleteAssetBtn(selectedAsset, index)"
                />
              </div>
            </div>
            <div v-else>
              <div
                class="alert alert-info text-start w-fit"
                role="alert"
                data-mdb-color="primary"
              >
                There are no assets marked for disposal
              </div>

              <IconButton
                  kind="btn-success"
                  classes="p-4px"
                  @on-click="onClickAddAssetsToDisposalBucketBtn"
                  style="height: 40px; width: 250px; margin-top: 18px"
                >
                <i class="fas fa-plus"></i> Add Assets To Disposal Bucket
              </IconButton>
            </div>
          </div>
          <div v-if="activePageIndex == 2" style="min-height: 350px">
            <div class="d-flex justify-content-start align-items-end">
              <input
                type="file"
                ref="uploadSupportingFileDisposalRef"
                id="supportingdocumenttransferinput"
                @change.prevent="onSelectDocument"
                style="width: 0px; height: 0px"
                :key="fileInputKey"
              />
              <!-- :accept="accept" -->
              <TextInput
                :id="uploadFormData.name.id"
                :label="uploadFormData.name.label"
                :tooltip="uploadFormData.name.tooltip"
                :errors="uploadFormData.name.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="uploadFormData.name.value"
                classes="ps-0 pe-0 me-1"
              />

              <IconButton
                kind="btn-success"
                classes="p-4px"
                @on-click="onClickSelectFileBtn"
                style="height: 40px; width: 150px"
                :style="
                  uploadFormData?.name?.errors?.length > 0
                    ? 'margin-bottom:18px;'
                    : ''
                "
              >
                <i class="fas fa-file"></i> Select File
              </IconButton>
            </div>
            <div
              class="d-flex justify-content-start align-items-end mt-1 lead nth-gray p-1"
              v-for="(uploadedDocument, docIndex) in uploadedDocuments"
              :key="docIndex"
            >
              <div class="flex-grow-1 text-start">
                <span>
                  <i :class="iconRefs[uploadedDocument.type.value]"></i>
                </span>
                <span class="ps-1 pe-1"
                  ><b>{{ uploadedDocument.name.value }}</b></span
                >
              </div>
              <div class="text-muted pe-1 ps-1">
                {{ uploadedDocument.type.value }}
              </div>
              <div>
                <IconButton
                  kind="btn-danger"
                  classes="p-4px"
                  @click.prevent="
                    onClickDeleteFileBtn(uploadedDocument, docIndex)
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
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import SearchSelectInput from "@/components/inputs/SearchSelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Validator from "@/utils/Validator";
import Http from "@/utils/Http";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import Data from "@/data/";
import StepperContainer from "@/components/containers/StepperContainer.vue";
import IconButton from "@/components/inputs/IconButton.vue";
import MarkedAssetItem from "@/components/viewers/MarkedAssetItem.vue";

let getFormData = function () {
  return {
    branchId: {
      id: "add-disposal-branch-input",
      label: "Disposing Branch",
      tooltip: "The branch from which assets are coming from",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Disposing branch is required",
      },
      ref: "branch_id",
    },
    title: {
      id: "add-disposal-title-input",
      label: "Title",
      tooltip: "Mark this disposal with a title for easy identification",
      value: "",
      isValid: null,
      validations: {
        required: "Please add a disposal title",
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 digits",
        },
      },
    },
    scheduledDisposalDate: {
      id: "add-disposal-scheduled-date-input",
      label: "Scheduled Disposal Date",
      tooltip: "When are the assets going to be disposed",
      value: "",
      isValid: null,
      validations: {
        required: "Scheduled disposal date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "scheduled_disposal_date",
    },
    notes: {
      id: "add-disposal-notes-input",
      label: "Any Disposal Notes:",
      tooltip: "Include more information about the disposal if possible",
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
  };
};
let getSelectAssetFormData = function () {
  return {
    disposalBucketItemId: {
      id: "add-disposal-asset-input",
      label: "Select Asset",
      tooltip: "Search and select the market asset you want to dispose",
      value: "",
      isValid: null,
      validations: {
        required: "Asset is required",
      },
      ref: "disposal_bucket_item_id",
    },
    assetId: {
      id: "add-disposal-asset-id-input",
      label: "",
      tooltip: "",
      value: "",
      isValid: null,
      validations: {
      },
      ref: "asset_id",
    },
    status: {
      id: "add-disposal-asset-status-input",
      label: "Asset Status",
      tooltip: "Current status of the asset",
      value: "",
      isValid: null,
      validations: {}
    },
    condition: {
      id: "add-disposal-asset-condition-input",
      label: "Asset Condition",
      tooltip: "Current condition of the asset",
      value: "",
      isValid: null,
      validations: {},
    },
    name: {
      id: "add-disposal-asset-name-input",
      label: "Asset Name",
      tooltip: "Name of the asset",
      value: "",
      isValid: null,
      validations: {},
    },
    type: {
      id: "add-disposal-type-input",
      label: "Disposal Type",
      tooltip: "What is the method of disposal",
      value: "",
      isValid: null,
      validations: {
        required: "Disposal Type is required"
      },
    },
    purchaseCost: {
      id: "add-disposal-cost-input",
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
      id: "add-disposalusefulYears-input",
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
      id: "add-disposal-current-value-input",
      label: "Current Value",
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
    addedNotes: {
      id: "add-disposal-added-notes-input",
      label: "Marked Notes",
      tooltip: "notes that were added during marking",
      value: "",
      isValid: null,
      validations: {},
      ref: "added_notes"
    },
    //nyd: disposal_condition * not at this point, at actuall disposal
  };
};
let getUploadFileFormData = function () {
  return {
    disposalId: {
      id: "supporting-document-disposal-input",
      label: "Select Disposal",
      tooltip: "",
      value: "",
      isValid: null,
      validations: {},
      ref: "disposal_id",
    },
    name: {
      id: "supporting-document-disposal-name-input",
      label: "Document Title",
      tooltip: "The title of the document",
      value: "",
      isValid: null,
      validations: {
        required: "Title name is required",
        maxLength: {
          value: 200,
          error: "Cannot be more than 200 letters",
        },
        minLength: {
          value: 20,
          error: "Atleast 20 letters are required",
        },
      },
    },
    type: {
      id: "supporting-disposal-document-type-input",
      label: "Type Of Document",
      tooltip: "The type of document e.g Pdf, Excell",
      value: "",
      isValid: null,
      validations: {},
    },
    link: {
      id: "supporting-disposal-document-link-input",
      label: "Document URL",
      tooltip: "The link to the document",
      value: "",
      isValid: null,
      validations: {},
    },
  };
};
export default {
  components: {
    CardContainer,
    TextAreaInput,
    TextInput,
    FormErrors,
    SelectInput,
    SearchSelectInput,
    StepperContainer,
    IconButton,
    MarkedAssetItem
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
      branchesItems: [],
      branches: [],
      assetUploadConditions: Data.conditions,
      conditionItems: Utils.toValueLabelList(Data.conditions, "value", "label"),
      uploadedDocuments: [],
      uploadFormData: getUploadFileFormData(),
      fileInputKey: 0,
      iconRefs: Utils.fileTypeIconRef(),
      pages: [
        {
          title: "Disposal Details",
          number: 1,
          canSkip: false,
        },
        {
          title: "Marked Assets",
          number: 2,
          canSkip: false,
        },
        {
          title: "Supporting Documents",
          number: 3,
          canSkip: false,
        },
      ],
      activePageIndex: 0,
      selectAssetFormData: getSelectAssetFormData(),
      assets: [],
      assetsToSearch: [],
      selectedAssets: [],
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
    "selectAssetFormData.disposalBucketItemId.value": function (val) {
      //set the other disabled fields
      if (val) {
        let disposalBucketItemId = parseInt(val);
        let disposalBucketItem = Utils.pick(this.assets, "id", disposalBucketItemId);
        if (disposalBucketItem ) {

          let valueData = Utils.getCurrentAssetValue(disposalBucketItem.asset, true);

          this.selectAssetFormData.salvageAmount.value = valueData.salvageAmount;
          this.selectAssetFormData.purchaseCost.value = disposalBucketItem.asset.purchase_cost;
          this.selectAssetFormData.usefulYears.value = disposalBucketItem.asset.useful_years;
          this.selectAssetFormData.currentValue.value = valueData.currentValue;

          this.selectAssetFormData.name.value = disposalBucketItem.asset.name;
          this.selectAssetFormData.condition.value = disposalBucketItem.asset.condition;
          this.selectAssetFormData.status.value = disposalBucketItem.asset.status;
          this.selectAssetFormData.assetId.value = disposalBucketItem.asset.id;
          this.selectAssetFormData.addedNotes.value = disposalBucketItem.added_notes;
        
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
      vm.fetch("addDisposalDependencies", function (thisVm, res) {
        thisVm.prepareAssetSearching(res.disposalBucketItems);
        thisVm.prepareBranches(res.branches);
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
    prepareBranches(branches) {
      this.branches = branches;
      this.branchesItems = Utils.toValueLabelList(branches, "id", "name");
    },
    editLoadDependencies() {
      var vm = this;
      vm.fetch("updateDisposalDependencies", function (thisVm, res) {
        thisVm.prepareAssetSearching(res.disposalBucketItems);
        thisVm.prepareBranches(res.branches);
        //if we are editing then we need to load the selected assets
        let assetsTemp = [];
        for (let index = 0; index < res.disposalAssets.length; index++) {
          const disposalAsset = res.disposalAssets[index];
          let formDataItem = getSelectAssetFormData();
          formDataItem = Utils.fillValues(formDataItem, disposalAsset);

          formDataItem.status.value = disposalAsset.asset.status;
          formDataItem.condition.value = disposalAsset.asset.condition;
          formDataItem.name.value = disposalAsset.asset.name;
          formDataItem.addedNotes.value = disposalAsset.disposal_bucket_item.added_notes;
          assetsTemp.push(formDataItem);
        }
        thisVm.selectedAssets = assetsTemp;
        //load uploaded supported documents
        let uploadsTemp = [];
        for (
          let index = 0;
          index < res.disposalSupportDocuments.length;
          index++
        ) {
          let supportDocument = res.disposalSupportDocuments[index];
          let uploadFormData = getUploadFileFormData();
          uploadFormData = Utils.fillValues(uploadFormData, supportDocument);
          //add an Id for the sake of deleting from the db
          uploadFormData["id"] = {
            id: "supporting-disposal-document-id-input",
            label: "",
            tooltip: "",
            value: supportDocument.id,
            isValid: null,
            validations: {},
          };
          uploadsTemp.push(uploadFormData);
        }
        thisVm.uploadedDocuments = uploadsTemp;
        //select the asset
        thisVm.formData.assetId.value = parseInt(thisVm.edits.asset_id);
      });
    },
    onSubmit() {
      var vm = this;
      if (vm.selectedAssets.length == 0) {
        vm.errors = ["Please select atleast one marked asset to dispose"];
        return false;
      }
      vm.post("addDisposal", "formData", function (vm, res) {
        vm.$emit("on-success");
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update(
        "updateDisposal",
        "formData",
        this.edits.id,
        function (vm, res) {
          vm.$emit("on-success");
        }
      );
    },
    onPageChange(page) {
      this.activePageIndex = parseInt(page);
    },
    onClickSelectFileBtn(e) {
      if (e) {
        //user must have provided a title for the document
        let validationRes = Validator.validateFormData(this.uploadFormData);
        if (validationRes.isValid) {
          this.errors = [];
          this.uploadFormData = validationRes.formData;
          //select the file using code
          this.$refs.uploadSupportingFileDisposalRef.click();
        } else {
          this.uploadFormData = validationRes.formData;
        }
      }
    },
    onSelectDocument(event) {
      var vm = this;
      if (event) {
        let selectedFile = event.target.files[0];
        let uploadConfig = {
          extensions: Utils.allFileExtensions(),
          maxFileSizeMbs: 2,
        };
        vm.uploadFile(
          selectedFile,
          uploadConfig,
          function (thisVm, res) {
            let fileUrl = res.temp_file.replace(".", "");
            let uploadFormData = {
              ...thisVm.uploadFormData,
            };
            uploadFormData.link.value = fileUrl;
            uploadFormData.type.value = Utils.getFileType(fileUrl);
            thisVm.uploadedDocuments.push(uploadFormData);
            thisVm.uploadFormData = getUploadFileFormData();
            thisVm.$refs.uploadSupportingFileDisposalRef.value = null;
            // thisVm.fileInputKey += 1;
          },
          function (thisVm) {
            thisVm.$refs.uploadSupportingFileDisposalRef.value = null;
            // thisVm.fileInputKey += 1;
          }
        );
      }
    },
    onClickDeleteFileBtn(uploadedDocumentInput, targetIndex) {
      var vm = this;
      if (uploadedDocumentInput.disposalId.value == "") {
        //just remove the file only
        vm.deleteUploadFile(
          uploadedDocumentInput.link.value,
          function (thisVm, res) {
            thisVm.getNewDocsList(targetIndex);
          }
        );
      } else {
        //remove the Supportingdocument and the entry in the db
        var vm = this;
        vm.delete(
          "deleteDisposalDocument",
          uploadedDocumentInput,
          function (thisVm, res) {
            thisVm.getNewDocsList(targetIndex);
          }
        );
      }
    },
    getNewDocsList(targetIndex) {
      var vm = this;
      var temp = [];
      for (let index = 0; index < vm.uploadedDocuments.length; index++) {
        if (index != parseInt(targetIndex)) {
          temp.push(vm.uploadedDocuments[index]);
        }
      }
      vm.uploadedDocuments = temp;
    },
    onClickAddAssetBtn(e) {
      if (e) {
        console.log("just here");
        let validationRes = Validator.validateFormData(
          this.selectAssetFormData
        );
        if (validationRes.isValid) {
          this.errors = [];
          this.selectedAssets.push({
            ...validationRes.formData
          });
          this.selectAssetFormData = getSelectAssetFormData();
        } else {
          this.selectAssetFormData = validationRes.formData;
        }
      }
    },
    onClickDeleteAssetBtn(selectedAsset, assetIndex) {
      var vm = this;
      var temp = [];
      for (let index = 0; index < vm.selectedAssets.length; index++) {
        if (index != parseInt(assetIndex)) {
          temp.push(vm.selectedAssets[index]);
        }
      }
      vm.selectedAssets = temp;
    },
    onClickAddAssetsToDisposalBucketBtn(){
      this.$router.go("/notifications/disposal?select");
    },
    comma(val){
      return Utils.comma(val);
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
