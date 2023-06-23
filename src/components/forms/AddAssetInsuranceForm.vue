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
                    :id="formData.supplierId.id"
                    :label="formData.supplierId.label"
                    :tooltip="formData.supplierId.tooltip"
                    :errors="formData.supplierId.errors"
                    :is-disabled="isLoading || isFormSubmitting"
                    v-model="formData.supplierId.value"
                    classes="ps-1 pe-0 "
                    :items="suppliersToSearch"
                />
                
            </div>

            <div class="d-flex flex-row">

                <TextInput
                  :id="formData.policyNumber.id"
                  :label="formData.policyNumber.label"
                  :tooltip="formData.policyNumber.tooltip"
                  :errors="formData.policyNumber.errors"
                  :is-disabled="isLoading || isFormSubmitting"
                  v-model="formData.policyNumber.value"
                  classes="ps-0 pe-0"
                />

                <TextInput
                  :id="formData.premium.id"
                  :label="formData.premium.label"
                  :tooltip="formData.premium.tooltip"
                  :errors="formData.premium.errors"
                  :is-disabled="isLoading || isFormSubmitting"
                  v-model="formData.premium.value"
                  classes="ps-1 pe-1"
                />

                <TextInput
                  :id="formData.deducatables.id"
                  :label="formData.deducatables.label"
                  :tooltip="formData.deducatables.tooltip"
                  :errors="formData.deducatables.errors"
                  :is-disabled="isLoading || isFormSubmitting"
                  v-model="formData.deducatables.value"
                  classes="ps-0 pe-0"
                />

            </div>

            <div class="d-flex flex-row">

                <TextInput
                    :id="formData.startDate.id"
                    :label="formData.startDate.label"
                    :errors="formData.startDate.errors"
                    :is-disabled="isLoading || isFormSubmitting"
                    type="date"
                    v-model="formData.startDate.value"
                    classes="ps-0 pe-1"
                />

                <TextInput
                    :id="formData.endDate.id"
                    :label="formData.endDate.label"
                    :errors="formData.endDate.errors"
                    :is-disabled="isLoading || isFormSubmitting"
                    type="date"
                    v-model="formData.endDate.value"
                    classes="ps-1 pe-0"
                />
              
            </div>

            <div class="d-flex flex-row">

                <TextAreaInput
                    :id="formData.coverage.id"
                    :label="formData.coverage.label"
                    :tooltip="formData.coverage.tooltip"
                    :errors="formData.coverage.errors"
                    :is-disabled="isLoading || isFormSubmitting"
                    v-model="formData.coverage.value"
                    classes="ps-0 pe-1"
                    :is-required="false"
                    rows="2"
                    />

                    <TextAreaInput
                    :id="formData.limitation.id"
                    :label="formData.limitation.label"
                    :tooltip="formData.limitation.tooltip"
                    :errors="formData.limitation.errors"
                    :is-disabled="isLoading || isFormSubmitting"
                    v-model="formData.limitation.value"
                    classes="ps-1 pe-0"
                    :is-required="false"
                    rows="2"
                    />
            </div>
          </div>
          <div v-if="activePageIndex == 1" style="min-height: 350px">
            <div class="d-flex justify-content-start align-items-end">
              <input
                type="file"
                ref="uploadSupportingFileInsuranceRef"
                id="supportingdocumentinsuranceinput"
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
import SearchSelectInput from "@/components/inputs/SearchSelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Validator from "@/utils/Validator";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import StepperContainer from "@/components/containers/StepperContainer.vue";
import IconButton from "@/components/inputs/IconButton.vue";

let getFormData = function () {
  return {
    assetId: {
      id: "add-insurance-asset-input",
      label: "Search & Select Asset",
      tooltip: "The asset insurance",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Asset is required",
      },
      ref: "asset_id",
    },
    supplierId: {
      id: "add-insurance-supplier-input",
      label: "Supplier",
      tooltip: "The insurnace company",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Custodian is required",
      },
      ref: "supplier_id",
    },
    policyNumber: {
      id: "add-insurance-policy-number-input",
      label: "Policy Number",
      tooltip: "The insurance policy number",
      value: "",
      isValid: null,
      validations: {
        required: "The policy number is required",
        maxLength: {
          value: 50,
          error: "Cannot be more than 50 letters",
        }
      },
      ref: "policy_number",
    },
    startDate: {
      id: "add-insurance-start-date-input",
      label: "Start Date",
      tooltip: "The start date of the insurance",
      value: "",
      isValid: null,
      validations: {
        required: "Start date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "start_date",
    },
    premium: {
      id: "add-insurance-premium-input",
      label: "Premium Amount",
      tooltip: "Whats the premium amount for this insurance",
      value: "",
      isValid: null,
      validations: {
        required: "Premium amount is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        },
        numeric: "Numeric values only",
      }
    },
    deducatables: {
      id: "add-insurance-deducatables-input",
      label: "Deducatibles Amount",
      tooltip: "Deductible amount for this insurance",
      value: "",
      isValid: null,
      validations: {
        required: "Deductible amount is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        },
        numeric: "Numeric values only",
      }
    },
    endDate: {
      id: "add-insurance-end-date-input",
      label: "End Date",
      tooltip: "The end date of the insurance",
      value: "",
      isValid: null,
      validations: {
        required: "End date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "end_date",
    },
    coverage: {
      id: "add-insurance-coverage-input",
      label: "Coverage:",
      tooltip: "List the items covered by this insurance",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 1000,
          error: "Cannot be more than 1000 letters",
        },
      },
      setEmptyStringIfNull: true,
    },
    limitation: {
      id: "add-insurance-limitation-input",
      label: "Limitations:",
      tooltip: "List the limitations of this insurance",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 1000,
          error: "Cannot be more than 1000 letters",
        },
      },
      setEmptyStringIfNull: true,
    }
  };
};
let getUploadFileFormData = function () {
  return {
    insuranceId: {
      id: "supporting-document-insurance-input",
      label: "Select insurance",
      tooltip: "",
      value: "",
      isValid: null,
      validations: {},
      ref: "insurance_id",
    },
    name: {
      id: "supporting-document-insurance-name-input",
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
      id: "supporting-insurance-document-type-input",
      label: "Type Of Document",
      tooltip: "The type of document e.g Pdf, Excell",
      value: "",
      isValid: null,
      validations: {},
    },
    link: {
      id: "supporting-insurance-document-link-input",
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
    SearchSelectInput,
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
  },
  data() {
    return {
      errors: [],
      formData: getFormData(),
      isFormSubmitting: false,

      assets: [],
      assetsToSearch: [],
      suppliers: [],
      suppliersToSearch: [],

      uploadedDocuments: [],
      uploadFormData: getUploadFileFormData(),
      fileInputKey: 0,
      iconRefs: Utils.fileTypeIconRef(),
      pages: [
        {
          title: "Insurance Details",
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
    }
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
      vm.fetch("addInsuranceDependencies", function (thisVm, res) {
        thisVm.prepareAssets(res.assets);
        thisVm.prepareSuppliers(res.suppliers);
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
    prepareSuppliers(suppliers) {
      this.suppliers = suppliers;
      this.suppliersToSearch = Utils.toSearchValueLabelList(
        suppliers,
        "id",
        "name"
      );
    },
    editLoadDependencies() {
      var vm = this;
      vm.fetch("updatedAssetInsuranceDependencies", function (thisVm, res) {
        thisVm.prepareAssets(res.assets);
        thisVm.prepareSuppliers(res.suppliers);

        //load uploaded supported documents
        let uploadsTemp = [];
        for (let index = 0; index < res.insuranceSupportDocuments.length; index++) {
          let supportDocument = res.insuranceSupportDocuments[index];
          let uploadFormData = getUploadFileFormData();
          uploadFormData = Utils.fillValues(uploadFormData, supportDocument);
          //add an Id for the sake of deleting from the db
          uploadFormData["id"] = {
            id: "supporting-insurance-document-id-input",
            label: "",
            tooltip: "",
            value: supportDocument.id,
            isValid: null,
            validations: {},
          };
          uploadsTemp.push(uploadFormData);
        }
        thisVm.uploadedDocuments = uploadsTemp;
        //select the asset and the supplier
        thisVm.formData.assetId.value = parseInt(thisVm.edits.asset_id);
        thisVm.formData.supplierId.value = parseInt(thisVm.edits.supplier_id);
      });
    },
    onSubmit() {
      var vm = this;
      vm.post("addAssetInsurance", "formData", function (vm, res) {
        vm.$emit("on-success");
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update(
        "updateAssetInsurance",
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
          this.$refs.uploadSupportingFileInsuranceRef.click();
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
            thisVm.$refs.uploadSupportingFileInsuranceRef.value = null;
            // thisVm.fileInputKey += 1;
          },
          function (thisVm) {
            thisVm.$refs.uploadSupportingFileInsuranceRef.value = null;
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
          "deleteInsuranceSupportDocument",
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
