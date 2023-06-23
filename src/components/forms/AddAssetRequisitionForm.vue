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
          <div v-if="activePageIndex == 0" style="min-height: 350px">
            <SearchSelectInput
              :id="formData.assetId.id"
              :label="formData.assetId.label"
              :tooltip="formData.assetId.tooltip"
              :errors="formData.assetId.errors"
              :is-disabled="isLoading || isFormSubmitting"
              v-model="formData.assetId.value"
              classes="ps-0 pe-0"
              :items="assetsToSearch"
            />
            <div class="d-flex flex-row">
              <TextInput
                :id="formData.requestersName.id"
                :label="formData.requestersName.label"
                :tooltip="formData.requestersName.tooltip"
                :errors="formData.requestersName.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.requestersName.value"
                classes="ps-0 pe-0"
              />
              <TextInput
                :id="formData.requestersContact.id"
                :label="formData.requestersContact.label"
                :tooltip="formData.requestersContact.tooltip"
                :errors="formData.requestersContact.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.requestersContact.value"
                classes="ms-1 pe-0"
              />
            </div>
            <div class="d-flex flex-row">
              <TextInput
                :id="formData.requiredBeforeDate.id"
                :label="formData.requiredBeforeDate.label"
                :errors="formData.requiredBeforeDate.errors"
                :is-disabled="isLoading || isFormSubmitting"
                type="date"
                v-model="formData.requiredBeforeDate.value"
                classes="ps-0 pe-0"
              />
              <TextInput
                :id="formData.proposedReturnDate.id"
                :label="formData.proposedReturnDate.label"
                :errors="formData.proposedReturnDate.errors"
                :is-disabled="isLoading || isFormSubmitting"
                type="date"
                v-model="formData.proposedReturnDate.value"
                classes="ms-1 pe-0"
                :is-required="false"
              />
            </div>
            <TextInput
              :id="formData.reason.id"
              :label="formData.reason.label"
              :errors="formData.reason.errors"
              :tooltip="formData.reason.tooltip"
              :is-disabled="isLoading || isFormSubmitting"
              v-model="formData.reason.value"
              :is-required="false"
              classes="ps-0 pe-0"
            />
          </div>
          <div v-if="activePageIndex == 1" style="min-height: 350px">
            <div class="d-flex justify-content-start align-items-end">
              <input
                type="file"
                ref="uploadSupportingFileRef"
                id="supportingdocumentinput"
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
import TextInput from "@/components/inputs/TextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import StepperContainer from "@/components/containers/StepperContainer.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import Validator from "@/utils/Validator";
import SearchSelectInput from "@/components/inputs/SearchSelectInput.vue";
import IconButton from "@/components/inputs/IconButton.vue";

let getFormData = function () {
  return {
    assetId: {
      id: "add-requisition-asset-input",
      label: "Select Asset",
      tooltip: "Search and select the asset you want to request for",
      value: "",
      isValid: null,
      validations: {
        required: "Asset name is required",
      },
      ref: "asset_id",
    },
    requestersName: {
      id: "add-requisition-requesters-name-input",
      label: "Requesters Name",
      tooltip: "The name of the person that this asset will be asssigned to ",
      value: "",
      isValid: null,
      validations: {
        required: "Requesters name is required",
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 letters",
        },
        minLength: {
          value: 2,
          error: "Atleast 2 letters are required",
        },
      },
      ref: "requesters_name",
    },
    requestersContact: {
      id: "add-requisition-requesters-contact-input",
      label: "Requesters Contact",
      tooltip:
        "Any contact information e.g mobile phone number, of the person that this asset will be asssigned to",
      value: "",
      isValid: null,
      validations: {
        required: "Requesters Contact is required",
        maxLength: {
          value: 50,
          error: "Cannot be more than 50 letters",
        },
        minLength: {
          value: 2,
          error: "Atleast 2 letters are required",
        },
      },
      ref: "requesters_contact",
    },
    requiredBeforeDate: {
      id: "add-requisition-required-before-date-input",
      label: "Required Date",
      tooltip: "When is this asset required",
      value: "",
      isValid: null,
      validations: {
        required: "Required date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "required_before_date",
    },
    proposedReturnDate: {
      id: "add-requisition-required-before-date-input",
      label: "Proposed Return Date",
      tooltip: "When will the asset be returned",
      value: "",
      isValid: null,
      validations: {
        // required: "Proposed return date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "proposed_return_date",
    },
    reason: {
      id: "add-requisition-required-before-date-input",
      label: "Reason",
      tooltip: "Why do you need or why are you requesting for this asset",
      value: "",
      isValid: null,
      validations: {
        required: "Proposed return date is required",
        minLength: {
          value: 10,
          error: "At least 10 letters",
        },
        maxLength: {
          value: 200,
          error: "Cannot be more than 200 letters",
        },
      },
    },
  };
};

let getUploadFileFormData = function () {
  return {
    requisitionId: {
      id: "supporting-document-requisition-input",
      label: "Select Requisition",
      tooltip: "",
      value: "",
      isValid: null,
      validations: {},
      ref: "requisition_id",
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
export default {
  components: {
    CardContainer,
    TextInput,
    FormErrors,
    SelectInput,
    StepperContainer,
    SearchSelectInput,
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
      assetsToSearch: [],
      uploadedDocuments: [],
      uploadFormData: getUploadFileFormData(),
      fileInputKey: 0,
      iconRefs: Utils.fileTypeIconRef(),
      pages: [
        {
          title: "Request Details",
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
      vm.fetch("addRequisitionDependencies", function (thisVm, res) {
        thisVm.prepareAssetSearching(res.assets);
      });
    },
    editLoadDependencies() {
      var vm = this;
      vm.fetch("updateRequisitionDependencies", function (thisVm, res) {
        thisVm.prepareAssetSearching(res.assets);
        //if we are editing then we need to load the uploaded supported documents
        let uploadsTemp = [];
        for (let index = 0; index < res.supportDocuments.length; index++) {
          let supportDocument = res.supportDocuments[index];
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
    prepareAssetSearching(assetsList) {
      this.assetsToSearch = Utils.toSearchValueLabelList(
        assetsList,
        "id",
        "name"
      );
    },
    onSubmit() {
      var vm = this;
      vm.post("addRequisition", "formData", function (vm, res) {
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
          this.$refs.uploadSupportingFileRef.click();
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
            thisVm.$refs.uploadSupportingFileRef.value = null;
            // thisVm.fileInputKey += 1;
          },
          function (thisVm) {
            thisVm.$refs.uploadSupportingFileRef.value = null;
            // thisVm.fileInputKey += 1;
          }
        );
      }
    },
    onClickDeleteFileBtn(uploadedDocumentInput, targetIndex) {
      var vm = this;
      if (uploadedDocumentInput.requisitionId.value == "") {
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
        vm.delete("deleteSupporting Document", uploadedDocumentInput, function (thisVm, res) {
          thisVm.getNewDocsList(targetIndex);
        });
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
    onSaveEdits() {
      var vm = this;
      vm.update("updateRequsition", "formData", this.edits.id, function (vm, res) {
        vm.$emit("on-success");
      });
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
