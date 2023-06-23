<template>
  <CardContainer
    :hasShadow="false"
    :show-title="false"
    :show-sub-title="false"
    classes="mb-0"
  >
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
          <div v-if="activePageIndex == 0" style="min-height: 454px">
            <div class="d-flex flex-row">
                <SearchSelectInput
                    :id="formData.assetId.id"
                    :label="formData.assetId.label"
                    :tooltip="formData.assetId.tooltip"
                    :errors="formData.assetId.errors"
                    :is-disabled="isLoading || isFormSubmitting"
                    v-model="formData.assetId.value"
                    classes="ps-0 pe-1"
                    :items="assetsToSearch"
                />

                <SearchSelectInput
                    :id="formData.custodianId.id"
                    :label="formData.custodianId.label"
                    :tooltip="formData.custodianId.tooltip"
                    :errors="formData.custodianId.errors"
                    :is-disabled="isLoading || isFormSubmitting"
                    v-model="formData.custodianId.value"
                    classes="ps-1 pe-0 "
                    :items="custodiansToSearch"
                />

                
            </div>

            <div class="d-flex flex-row">

                <TextInput
                    :id="formData.occuredDate.id"
                    :label="formData.occuredDate.label"
                    :errors="formData.occuredDate.errors"
                    :is-disabled="isLoading || isFormSubmitting"
                    type="date"
                    v-model="formData.occuredDate.value"
                    classes="ps-0 pe-1"
                />

                <SelectInput
                    :id="formData.type.id"
                    :label="formData.type.label"
                    :errors="formData.type.errors"
                    :tooltip="formData.type.tooltip"
                    :is-disabled="isLoading || isFormSubmitting"
                    v-model="formData.type.value"
                    :items="impairmentTypes"
                    classes="ps-1 pe-0"
                />
              
            </div>
            <div class="d-flex flex-row">
              <SelectInput
                :id="formData.assetCondition.id"
                :label="formData.assetCondition.label"
                :errors="formData.assetCondition.errors"
                :tooltip="formData.assetCondition.tooltip"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.assetCondition.value"
                :items="conditions"
                classes="ps-0 pe-1"
              />

              <TextInput
                  :id="formData.impairmentValueAmount.id"
                  :label="formData.impairmentValueAmount.label"
                  :tooltip="formData.impairmentValueAmount.tooltip"
                  :errors="formData.impairmentValueAmount.errors"
                  :is-disabled="isLoading || isFormSubmitting"
                  v-model="formData.impairmentValueAmount.value"
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
            />
          </div>
          <div v-if="activePageIndex == 1" style="min-height: 350px">
            <div class="d-flex justify-content-start align-items-end">
              <input
                type="file"
                ref="uploadSupportingFileImpairmentRef"
                id="supportingdocumentimpairmentinput"
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
import MarkedAssetItem from "@/components/viewers/MarkedAssetItem.vue";

let getFormData = function () {
  return {
    assetId: {
      id: "add-impairment-asset-input",
      label: "Search & Select Asset",
      tooltip: "The asset to be reported",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Asset is required",
      },
      ref: "asset_id",
    },
    custodianId: {
      id: "add-impairment-custodian-input",
      label: "Custodian",
      tooltip: "The custodian of the asset",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Custodian is required",
      },
      ref: "custodian_id",
    },
    type: {
      id: "add-impairment-type-input",
      label: "Impairmnet Type",
      tooltip: "How was the asset impaired",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Impairment is required",
      },
    },
    occuredDate: {
      id: "add-impairment-occurance-date-input",
      label: "Occurance Date",
      tooltip: "When did the incident occur",
      value: "",
      isValid: null,
      validations: {
        required: "Date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "occured_date",
    },
    assetCondition: {
      id: "add-impairment-condition-input",
      label: "Asset Condition",
      tooltip: "What is the condition of the asset",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Condition is required",
      },
      ref: "asset_condition",
    },
    impairmentValueAmount: {
      id: "add-impairment-value-input",
      label: "Value Amount",
      tooltip: "How much monetary value has been inccured",
      value: "",
      isValid: null,
      validations: {
        required: "Value amount is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        },
        numeric: "Numeric values only",
      },
      ref: "impairment_value_amount",
    },
    notes: {
      id: "add-impairment-type-input",
      label: "Impairment Notes:",
      tooltip: "Include more information about the impairment",
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
let getUploadFileFormData = function () {
  return {
    impairmentId: {
      id: "supporting-document-impairment-input",
      label: "Select Impairment",
      tooltip: "",
      value: "",
      isValid: null,
      validations: {},
      ref: "impairment_id",
    },
    name: {
      id: "supporting-document-impairment-name-input",
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
      id: "supporting-impairment-document-type-input",
      label: "Type Of Document",
      tooltip: "The type of document e.g Pdf, Excell",
      value: "",
      isValid: null,
      validations: {},
    },
    link: {
      id: "supporting-impairment-document-link-input",
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
    MarkedAssetItem,
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
      custodians: [],
      custodiansToSearch: [],
      impairmentTypes: Data.impairmentTypes,
      conditions: Data.conditions,
      indexedAllocations: {},
      indexedCustodians: {},

      uploadedDocuments: [],
      uploadFormData: getUploadFileFormData(),
      fileInputKey: 0,
      iconRefs: Utils.fileTypeIconRef(),
      pages: [
        {
          title: "Impairment Details",
          number: 1,
          canSkip: false,
        },
        {
          title: "Supporting Documents",
          number: 2,
          canSkip: false,
        },
      ],
      activePageIndex: 0,
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
    "formData.assetId.value": function(value){
      //get the current asset custodian
      var allocation = this.indexedAllocations[value];
      if(allocation){
        //get the custodian to select
        var custodian = this.indexedCustodians[allocation.custodian_id];
        if(custodian){
            //select the custodian
            this.formData.custodianId.value = parseInt(custodian.id);
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
      vm.fetch("addImpairmentDependencies", function (thisVm, res) {
        thisVm.prepareAssets(res.assets);
        thisVm.prepareCustodians(res.custodians);
        thisVm.indexedAllocations = Utils.index(res.allocations, "asset_id");
      });
    },
    prepareAssets(assets) {
      this.assets = assets;
      this.assetsToSearch = Utils.toSearchValueLabelList(
        assets,
        "id",
        function (item) {
          return item.name + ((item.identifier_number && item.identifier_number.length > 0) ?  " - " + item.identifier_number : "");
        }
      );
    },
    prepareCustodians(custodians) {
      this.custodians = custodians;
      this.custodiansToSearch = Utils.toSearchValueLabelList(
        custodians,
        "id",
        function (item) {
          return item.name + " - " + item.contact;
        }
      );
      this.indexedCustodians = Utils.index(custodians, "id");
    },
    editLoadDependencies() {
      var vm = this;
      vm.fetch("updatedAssetImpairmentDependencies", function (thisVm, res) {
        thisVm.prepareAssets(res.assets);
        thisVm.prepareCustodians(res.custodians);
        thisVm.indexedAllocations = Utils.index(res.allocations, "asset_id");

        //load uploaded supported documents
        let uploadsTemp = [];
        for (let index = 0; index < res.impairmentSupportDocuments.length; index++) {
          let supportDocument = res.impairmentSupportDocuments[index];
          let uploadFormData = getUploadFileFormData();
          uploadFormData = Utils.fillValues(uploadFormData, supportDocument);
          //add an Id for the sake of deleting from the db
          uploadFormData["id"] = {
            id: "supporting-impairment-document-id-input",
            label: "",
            tooltip: "",
            value: supportDocument.id,
            isValid: null,
            validations: {},
          };
          uploadsTemp.push(uploadFormData);
        }
        thisVm.uploadedDocuments = uploadsTemp;
        //select the asset and the custodian
        thisVm.formData.assetId.value = parseInt(thisVm.edits.asset_id);
        thisVm.formData.custodianId.value = parseInt(thisVm.edits.custodian_id);
      });
    },
    onSubmit() {
      var vm = this;
      vm.post("addAssetImpairment", "formData", function (vm, res) {
        vm.$emit("on-success");
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update(
        "updateAssetImpairment",
        "formData",
        this.edits.id,
        function (thisVm, res) {
          thisVm.$emit("on-success");
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
          this.$refs.uploadSupportingFileImpairmentRef.click();
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
            thisVm.$refs.uploadSupportingFileImpairmentRef.value = null;
            // thisVm.fileInputKey += 1;
          },
          function (thisVm) {
            thisVm.$refs.uploadSupportingFileImpairmentRef.value = null;
            // thisVm.fileInputKey += 1;
          }
        );
      }
    },
    onClickDeleteFileBtn(uploadedDocumentInput, targetIndex) {
      var vm = this;
      if (uploadedDocumentInput.impairmentId.value == "") {
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
          "deleteImpairmentDocument",
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
