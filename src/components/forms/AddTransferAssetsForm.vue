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

            <TextInput
              :id="formData.title.id"
              :label="formData.title.label"
              :errors="formData.title.errors"
              :is-disabled="isLoading || isFormSubmitting"
              v-model="formData.title.value"
              classes="ps-0 pe-0"
              :is-required="false"
            />

            <div class="d-flex flex-row">
              <SelectInput
                :id="formData.issuingBranchId.id"
                :label="formData.issuingBranchId.label"
                :errors="formData.issuingBranchId.errors"
                :tooltip="formData.issuingBranchId.tooltip"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.issuingBranchId.value"
                :items="branchesItems"
                classes="ps-0 pe-1"
              />

              <SelectInput
                :id="formData.receivingBranchId.id"
                :label="formData.receivingBranchId.label"
                :errors="formData.receivingBranchId.errors"
                :tooltip="formData.receivingBranchId.tooltip"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.receivingBranchId.value"
                :items="branchesItems"
                classes="ps-1 pe-0"
              />
            </div>

            <div class="d-flex flex-row">
              <TextInput
                :id="formData.scheduledTansferDate.id"
                :label="formData.scheduledTansferDate.label"
                :errors="formData.scheduledTansferDate.errors"
                :is-disabled="isLoading || isFormSubmitting"
                type="date"
                v-model="formData.scheduledTansferDate.value"
                classes="ps-0 pe-1"
                :is-required="false"
              />

              <TextInput
                :id="formData.transferDate.id"
                :label="formData.transferDate.label"
                :errors="formData.transferDate.errors"
                :is-disabled="isLoading || isFormSubmitting"
                type="date"
                v-model="formData.transferDate.value"
                classes="ps-1 pe-0"
                :is-required="false"
              />
            </div>

            <TextAreaInput
              :id="formData.transferNotes.id"
              :label="formData.transferNotes.label"
              :tooltip="formData.transferNotes.tooltip"
              :errors="formData.transferNotes.errors"
              :is-disabled="isLoading || isFormSubmitting"
              v-model="formData.transferNotes.value"
              classes="ps-0 pe-0"
              :is-required="false"
              rows="2"
              note="(e.g reason for transfer) "
            />
          </div>
          <div v-if="activePageIndex == 1" style="min-height: 350px">
            <div class="d-flex justify-content-start align-items-end">
              <SearchSelectInput
                :id="selectAssetFormData.assetId.id"
                :label="selectAssetFormData.assetId.label"
                :tooltip="selectAssetFormData.assetId.tooltip"
                :errors="selectAssetFormData.assetId.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="selectAssetFormData.assetId.value"
                classes="ps-0 pe-0 "
                :items="assetsToSearch"
              />
            </div>
            <div class="d-flex justify-content-start align-items-end">
              <TextInput
                :id="selectAssetFormData.status.id"
                :label="selectAssetFormData.status.label"
                :errors="selectAssetFormData.status.errors"
                :is-disabled="true"
                v-model="selectAssetFormData.status.value"
                classes="ps-0 pe-0 text-capitalize me-1"
                :is-required="false"
              />
              <TextInput
                :id="selectAssetFormData.condition.id"
                :label="selectAssetFormData.condition.label"
                :errors="selectAssetFormData.condition.errors"
                :is-disabled="true"
                v-model="selectAssetFormData.condition.value"
                classes="ps-0 pe-0 text-capitalize me-1"
                :is-required="false"
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
            <div
              class="d-flex justify-content-start align-items-end mt-1 lead nth-gray"
              style="padding-top: 5px; padding-bottom: 5px"
              v-for="(selectedAsset, assetIndex) in selectedAssets"
              :key="assetIndex"
            >
              <div class="text-start text-capitalize w-50 ps-1">
                {{ selectedAsset.name.value }}
              </div>
              <div class="text-muted pe-1 ps-1 text-capitalize text-start w-25">
                {{ selectedAsset.status.value }}
              </div>
              <div class="text-muted pe-1 ps-1 text-capitalize w-25">
                {{ selectedAsset.condition.value }}
              </div>
              <div class="flex-grow-1 pe-1 text-end">
                <IconButton
                  kind="btn-danger"
                  classes="p-4px"
                  @click.prevent="
                    onClickDeleteAssetBtn(selectedAsset, assetIndex)
                  "
                >
                  <i class="fas fa-times-circle"></i>
                </IconButton>
              </div>
            </div>
          </div>
          <div v-if="activePageIndex == 2" style="min-height: 350px">
            <div class="d-flex justify-content-start align-items-end">
              <input
                type="file"
                ref="uploadSupportingFileTransferRef"
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
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import Data from "@/data/";
import StepperContainer from "@/components/containers/StepperContainer.vue";
import IconButton from "@/components/inputs/IconButton.vue";

let getFormData = function () {
  return {
    title: {
      id: "add-transfer-title-input",
      label: "Title",
      tooltip: "Mark this transfer with a title for easy rememberance",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 digits",
        },
      },
      setEmptyStringIfNull: true
    },
    issuingBranchId: {
      id: "add-transfer-issuing-branch-input",
      label: "Issuing Branch",
      tooltip: "The branch from which assets are coming from",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Issuing branch is required",
      },
      ref: "issuing_branch_id",
    },
    receivingBranchId: {
      id: "add-transfer-receiving-branch-input",
      label: "Receiving Branch",
      tooltip: "The branch which is receiving the assets",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Receiving branch is required",
      },
      ref: "receiving_branch_id",
    },
    scheduledTansferDate: {
      id: "add-transfer-scheduled-date-input",
      label: "Scheduled Transfer Date",
      tooltip: "When are the assets going to be transfered",
      value: "",
      isValid: null,
      validations: {
        required: "Scheduled transfer date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "scheduled_tansfer_date",
    },
    transferDate: {
      id: "add-transfer-date-input",
      label: "Actual Transfer Date",
      tooltip: "The actuall date when the assets were transfered",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      setEmptyStringIfNull: true,
      ref: "transfer_date",
    },
    transferNotes: {
      id: "add-transfer-transfer-notes-input",
      label: "Any Transfer Notes:",
      tooltip: "Include more information about the tansfer if possible",
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
      ref: "transfer_notes",
    },
  };
};
let getUploadFileFormData = function () {
  return {
    transferId: {
      id: "supporting-document-transfer-input",
      label: "Select Requisition",
      tooltip: "",
      value: "",
      isValid: null,
      validations: {},
      ref: "transfer_id",
    },
    name: {
      id: "supporting-document-name-input",
      label: "Document Title",
      tooltip: "The title of the document",
      value: "",
      isValid: null,
      validations: {
        required: "Requesters name is required",
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
      id: "supporting-document-type-input",
      label: "Type Of Document",
      tooltip: "The type of document e.g Pdf, Excell",
      value: "",
      isValid: null,
      validations: {},
    },
    link: {
      id: "supporting-document-link-input",
      label: "Document URL",
      tooltip: "The link to the document",
      value: "",
      isValid: null,
      validations: {},
    },
  };
};
let getSelectAssetFormData = function () {
  return {
    assetId: {
      id: "add-transfer-asset-input",
      label: "Select Asset",
      tooltip: "Search and select the asset you want to transfer",
      value: "",
      isValid: null,
      validations: {
        required: "Asset name is required",
      },
      ref: "asset_id",
    },
    status: {
      id: "add-transfer-asset-status-input",
      label: "Asset Status",
      tooltip: "Current status of the asset",
      value: "",
      isValid: null,
      validations: {},
    },
    condition: {
      id: "add-transfer-asset-condition-input",
      label: "Asset Condition",
      tooltip: "Current condition of the asset",
      value: "",
      isValid: null,
      validations: {},
    },
    name: {
      id: "add-transfer-asset-name-input",
      label: "Asset Name",
      tooltip: "Name of the asset",
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
          title: "Transfer Details",
          number: 1,
          canSkip: false,
        },
        {
          title: "Selected Assets",
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
    "selectAssetFormData.assetId.value": function (val) {
      //set the other disabled fields
      if (val) {
        let assetId = parseInt(val);
        let asset = Utils.pick(this.assets, "id", assetId);
        if (asset) {
          this.selectAssetFormData.status.value = asset.status;
          this.selectAssetFormData.condition.value = asset.condition;
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
    postLoadDependencies(){
      var vm = this;
      vm.fetch("addTransferAssetsDependencies", function (thisVm, res) {
        thisVm.prepareAssetSearching(res.assets);
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
      vm.fetch("updateAssetsTransferDependencies", function (thisVm, res) {
        thisVm.prepareAssetSearching(res.assets);
        thisVm.prepareBranches(res.branches);
        //if we are editing then we need to load the selected assets
        let  assetsTemp = [];
        for (let index = 0; index < res.transferAssets.length; index++) {
          const transferAsset = res.transferAssets[index];
          let formDataItem = getSelectAssetFormData();
          formDataItem = Utils.fillValues(formDataItem, transferAsset.asset);
          formDataItem.assetId.value = transferAsset.id;
          assetsTemp.push(formDataItem);
        }
        thisVm.selectedAssets = assetsTemp;
        //load uploaded supported documents
        let uploadsTemp = [];
        for (let index = 0; index < res.transferSupportDocuments.length; index++) {
          let supportDocument = res.transferSupportDocuments[index];
          let uploadFormData = getUploadFileFormData();
          uploadFormData = Utils.fillValues(uploadFormData, supportDocument);
          //add an Id for the sake of deleting from the db
          uploadFormData["id"] =  {
            id: "supporting-document-id-input",
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
        vm.errors = ["Please select atleast one asset to transfer"];
        return false;
      }
      vm.post("addTransfer", "formData", function (vm, res) {
        vm.$emit("on-success");
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update("updateAssetTransfer", "formData", this.edits.id, function (vm, res) {
        vm.$emit("on-success");
      });
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
          this.$refs.uploadSupportingFileTransferRef.click();
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
            thisVm.$refs.uploadSupportingFileTransferRef.value = null;
            // thisVm.fileInputKey += 1;
          },
          function (thisVm) {
            thisVm.$refs.uploadSupportingFileTransferRef.value = null;
            // thisVm.fileInputKey += 1;
          }
        );
      }
    },
    onClickDeleteFileBtn(uploadedDocumentInput, targetIndex) {
      var vm = this;
      if (uploadedDocumentInput.transferId.value == "") {
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
          "deleteTransferSupporting Document",
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
        let validationRes = Validator.validateFormData(
          this.selectAssetFormData
        );
        if (validationRes.isValid) {
          this.errors = [];
          //yield the selected file
          let asset = Utils.pick(
            this.assets,
            "id",
            validationRes.formData.assetId.value
          );
          this.selectedAssets.push({
            ...validationRes.formData,
            name: {
              id: "add-transfer-asset-name-input",
              label: "Asset Name",
              tooltip: "Name of the asset",
              value: asset.name,
              isValid: null,
              validations: {},
            },
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
  },
  mounted() {
    if (this.edits != null) {
      this.formData = Utils.fillValues(this.formData, this.edits);
    }
    this.loadDependencies();
  },
};
</script>
