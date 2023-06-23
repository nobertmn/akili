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
            <SearchSelectInput
              :id="formData.assetId.id"
              :label="formData.assetId.label"
              :tooltip="formData.assetId.tooltip"
              :errors="formData.assetId.errors"
              :is-disabled="isLoading || isFormSubmitting || null != edits"
              v-model="formData.assetId.value"
              classes="ps-0 pe-0 "
              :items="assetsToSearch"
            />

            <div class="d-flex flex-row">
              <SelectInput
                :id="formData.type.id"
                :label="formData.type.label"
                :errors="formData.type.errors"
                :tooltip="formData.type.tooltip"
                :is-disabled="isLoading || isFormSubmitting || (edits != null && edits.status == 'budgeted')"
                v-model="formData.type.value"
                :items="maintenanceTypes"
                classes="ps-0 pe-1"
              />

              <TextInput
                :id="formData.scheduledMaintenanceDate.id"
                :label="formData.scheduledMaintenanceDate.label"
                :errors="formData.scheduledMaintenanceDate.errors"
                :is-disabled="isLoading || isFormSubmitting || (edits != null && edits.status == 'budgeted')"
                type="date"
                v-model="formData.scheduledMaintenanceDate.value"
                classes="ps-1 pe-0"
              />
            </div>

            <div class="d-flex flex-row">
              <TextInput
                :id="formData.lastMaintenanceDate.id"
                :label="formData.lastMaintenanceDate.label"
                :errors="formData.lastMaintenanceDate.errors"
                :is-disabled="isLoading || isFormSubmitting"
                type="date"
                v-model="formData.lastMaintenanceDate.value"
                classes="ps-0 pe-1"
                :is-required="false"
              />

              <TextInput
                :id="formData.nextMaintenanceDate.id"
                :label="formData.nextMaintenanceDate.label"
                :errors="formData.nextMaintenanceDate.errors"
                :is-disabled="isLoading || isFormSubmitting"
                type="date"
                v-model="formData.nextMaintenanceDate.value"
                classes="ps-1 pe-0"
                :is-required="false"
              />
            </div>

            <TextAreaInput
              :id="formData.maintenanceNotes.id"
              :label="formData.maintenanceNotes.label"
              :tooltip="formData.maintenanceNotes.tooltip"
              :errors="formData.maintenanceNotes.errors"
              :is-disabled="isLoading || isFormSubmitting"
              v-model="formData.maintenanceNotes.value"
              classes="ps-0 pe-0"
              :is-required="false"
              rows="2"
            />
          </div>
          <div v-if="activePageIndex == 1" style="min-height: 350px">
            <div class="d-flex justify-content-start align-items-end">
              <input
                type="file"
                ref="uploadSupportingFileMaintenanceRef"
                id="supportingdocumentmaintenanceinput"
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
import Data from "@/data/";
import SelectInput from "@/components/inputs/SelectInput.vue";
import SearchSelectInput from "@/components/inputs/SearchSelectInput.vue";
import Utils from "@/utils/";
import Vm from "@/utils/Vm";
import TextInput from "@/components/inputs/TextInput.vue";
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import StepperContainer from "@/components/containers/StepperContainer.vue";
import Validator from "@/utils/Validator";
import IconButton from "@/components/inputs/IconButton.vue";
import FormErrors from "@/components/forms/FormErrors.vue";

let getFormData = function () {
  return {
    assetId: {
      id: "add-maintenance-asset-input",
      label: "Select Asset",
      tooltip: "Search and select the asset to schedule for maintenance",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Asset is required",
      },
      ref: "asset_id",
    },
    type: {
      id: "add-maintenance-type-input",
      label: "Maintenance Type",
      tooltip: "Is the Maintenance Scheduled or Emergency",
      value: "",
      isValid: null,
      validations: {
        required: "Required",
      },
    },
    lastMaintenanceDate: {
      id: "add-maintenance-last-date-input",
      label: "Last Maintenance Date",
      tooltip:
        "When was the last maintenance performed for this asset, this will auto matically be filled using historical data if left empty",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      setEmptyStringIfNull: true,
      ref: "last_maintenance_date",
    },
    scheduledMaintenanceDate: {
      id: "add-maintenance-scheduled-date-input",
      label: "Scheduled Date",
      tooltip: "When will this maintenance take place",
      value: "",
      isValid: null,
      validations: {
        required: "Scheduled maintenance date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "scheduled_maintenance_date",
    },
    nextMaintenanceDate: {
      id: "add-maintenance-next-date-input",
      label: "Next Maintenance Date",
      tooltip: "When will the next maintenance take place after this one",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      setEmptyStringIfNull: true,
      ref: "next_maintenance_date",
    },
    maintenanceNotes: {
      id: "add-maintenance-notes-input",
      label: "Any  Notes:",
      tooltip: "Include more information about the maintenance if possible",
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
      ref: "maintenance_notes",
    },
  };
};
let getUploadFileFormData = function () {
  return {
    maintenanceId: {
      id: "supporting-document-maintenance-input",
      label: "Select Maintenance",
      tooltip: "",
      value: "",
      isValid: null,
      validations: {},
      ref: "maintenance_id",
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
let getSelectWorkFormData = function () {
  return {
    maintenanceId: {
      id: "add-maintenance-work-maintenance-id-input",
      label: "",
      tooltip: "",
      errors: [],
      value: "",
      isValid: null,
      validations: {},
      ref: "maintenance_id",
    },
    maintainanceWorkTypeId: {
      id: "add-maintenance-work-type-input",
      label: "Type Of Work",
      tooltip: "What kind of work is gona be perfomed",
      value: "",
      isValid: null,
      validations: {
        required: "Required",
      },
      ref: "maintainance_work_type_id"
    },
    name: {
      id: "add-maintenance-work-name-input",
      label: "Activity Title",
      tooltip:
        "A brief short description of the work item",
      value: "",
      isValid: null,
      validations: {
        required: "Activity title is required",
        maxLength: {
          value: 50,
          error: "Cannot be more than 50 digits",
        },
      }
    },
    unitCost: {
      id: "add-maintenance-work-cost-input",
      label: "Unit Cost",
      tooltip: "Unit cost of the work item",
      value: "",
      isValid: null,
      validations: {
        required: "Unit cost is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        },
        numeric: "Numeric values only",
      },
      ref: "unit_cost",
    },
    quantity: {
      id: "add-maintenance-work-quantity-input",
      label: "Quanity",
      tooltip:
        "Quantity must be a whole number e.g 34, 105, 2 - no decimals allowed",
      value: "",
      isValid: null,
      validations: {
        required: "Quanity is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
        digitsOnly: "Only digits are allowed",
      },
    },
    lineTotalAmount: {
      id: "add-maintenance-work-line-total-input",
      label: "Total",
      tooltip: "The total amount",
      value: "",
      isValid: null,
      validations: {
        required: "Total amount is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        },
        numeric: "Numeric value expected, dont include spaces",
      },
      ref: "line_total_amount",
    },
    notes: {
      id: "add-maintenance-work-notes-input",
      label: "Any Notes",
      tooltip: "Any additional information, can be described here",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 200,
          error: "Cannot be more than 200 letters",
        },
      },
      setEmptyStringIfNull: true,
    },
  };
};

export default {
  components: {
    CardContainer,
    SelectInput,
    SearchSelectInput,
    TextInput,
    TextAreaInput,
    StepperContainer,
    IconButton,
    FormErrors
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
      maintenanceTypes: Data.maintenanceTypes,
      assetsToSearch: [],
      assets: [],
      pages: [
        {
          title: "Maintenance Details",
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
      uploadedDocuments: [],
      uploadFormData: getUploadFileFormData(),
      fileInputKey: 0,
      iconRefs: Utils.fileTypeIconRef(),
      selectedWorks: []
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
      //set get the performed last maintenace date
      if (val) {
        let assetId = parseInt(val);
        let asset = Utils.pick(this.assets, "id", assetId);
        if (asset) {
          this.fetchAssetLastMaintenanceHistory(asset);
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
      vm.fetch("addAssetMaintenanceDependencies", function (thisVm, res) {
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
    fetchAssetLastMaintenanceHistory(asset) {
      var vm = this;
      vm.fetchItem(
        "getAssetLastMaintenanceDetails",
        asset,
        function (thisVm, res) {
          if (res.maintenance) {
            thisVm.formData.lastMaintenanceDate.value =
              res.maintenance.performed_maintenance_date;
          }
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
          this.$refs.uploadSupportingFileMaintenanceRef.click();
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
            thisVm.$refs.uploadSupportingFileMaintenanceRef.value = null;
            // thisVm.fileInputKey += 1;
          },
          function (thisVm) {
            thisVm.$refs.uploadSupportingFileMaintenanceRef.value = null;
            // thisVm.fileInputKey += 1;
          }
        );
      }
    },
    onClickDeleteFileBtn(uploadedDocumentInput, targetIndex) {
      var vm = this;
      if (uploadedDocumentInput.maintenanceId.value == "") {
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
          "deleteMaintenanceDocument",
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
    onSubmit() {
      var vm = this;
      vm.post("addAssetMaintenance", "formData", function (vm, res) {
        vm.$emit("on-success");
      });
    },
    editLoadDependencies() {
      var vm = this;
      vm.fetch("updateMaintenanceDependencies", function (thisVm, res) {
        thisVm.prepareAssetSearching(res.assets);
        //load uploaded supported documents
        let uploadsTemp = [];
        for (
          let index = 0;
          index < res.maintenanceSupportDocuments.length;
          index++
        ) {
          let supportDocument = res.maintenanceSupportDocuments[index];
          let uploadFormData = getUploadFileFormData();
          uploadFormData = Utils.fillValues(uploadFormData, supportDocument);
          //add an Id for the sake of deleting from the db
          uploadFormData["id"] = {
            id: "supporting-maintenance-document-id-input",
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

        // if the status is budgeted, then we can edit the budgeted items
        if (thisVm.edits.status == "budgeted") {
          let worksTemp = [];
          for (let index = 0; index < res.performedWorks.length; index++) {
            const performedWork = res.performedWorks[index];
            let formDataItem = getSelectWorkFormData();
            formDataItem = Utils.fillValues(formDataItem, performedWork);
            worksTemp.push(formDataItem);
          }
          thisVm.selectedWorks = worksTemp;
        }
      });
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