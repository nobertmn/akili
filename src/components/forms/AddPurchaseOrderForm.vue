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
              <TextInput
                :id="formData.orderNumber.id"
                :label="formData.orderNumber.label"
                :tooltip="formData.orderNumber.tooltip"
                :errors="formData.orderNumber.errors"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.orderNumber.value"
                classes="ps-0 pe-0 w-25"
                :is-required="false"
                note="(Automatic) "
              />

              <div class="w-75"></div>
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
                :id="formData.requiredDate.id"
                :label="formData.requiredDate.label"
                :errors="formData.requiredDate.errors"
                :is-disabled="isLoading || isFormSubmitting"
                type="date"
                v-model="formData.requiredDate.value"
                classes="ps-1 pe-0"
              />
            </div>
            <div class="d-flex flex-row">
              <SelectInput
                :id="formData.supplierId.id"
                :label="formData.supplierId.label"
                :errors="formData.supplierId.errors"
                :tooltip="formData.supplierId.tooltip"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.supplierId.value"
                :items="supplierItems"
                classes="ps-0 pe-1"
              />

              <SelectInput
                :id="formData.type.id"
                :label="formData.type.label"
                :errors="formData.type.errors"
                :tooltip="formData.type.tooltip"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.type.value"
                :items="acquisitionTypes"
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
            <div class="w-100 d-flex flex-row justify-content-start">
              <div
                class="d-flex flex-column justify-content-start add-order-item-form"
              >
                <TextInput
                  :id="orderItemFormData.name.id"
                  :label="orderItemFormData.name.label"
                  :tooltip="orderItemFormData.name.tooltip"
                  :errors="orderItemFormData.name.errors"
                  :is-disabled="isLoading || isFormSubmitting"
                  v-model="orderItemFormData.name.value"
                  classes="ps-0 pe-0 "
                />

                <TextInput
                  :id="orderItemFormData.unitPrice.id"
                  :label="orderItemFormData.unitPrice.label"
                  :tooltip="orderItemFormData.unitPrice.tooltip"
                  :errors="orderItemFormData.unitPrice.errors"
                  :is-disabled="isLoading || isFormSubmitting"
                  v-model="orderItemFormData.unitPrice.value"
                  classes="ps-0 pe-0"
                  @input="updateTotalInput"
                />

                <TextInput
                  :id="orderItemFormData.quantity.id"
                  :label="orderItemFormData.quantity.label"
                  :tooltip="orderItemFormData.quantity.tooltip"
                  :errors="orderItemFormData.quantity.errors"
                  :is-disabled="isLoading || isFormSubmitting"
                  v-model="orderItemFormData.quantity.value"
                  classes="ps-0 pe-0"
                  @input="updateTotalInput"
                />

                <TextInput
                  :id="orderItemFormData.lineTotalAmount.id"
                  :label="orderItemFormData.lineTotalAmount.label"
                  :tooltip="orderItemFormData.lineTotalAmount.tooltip"
                  :errors="orderItemFormData.lineTotalAmount.errors"
                  :is-disabled="true"
                  v-model="orderItemFormData.lineTotalAmount.value"
                  classes="ps-0 pe-0"
                  note="(auto) "
                />

                <TextAreaInput
                  :id="orderItemFormData.specifications.id"
                  :label="orderItemFormData.specifications.label"
                  :tooltip="orderItemFormData.specifications.tooltip"
                  :errors="orderItemFormData.specifications.errors"
                  :is-disabled="isLoading || isFormSubmitting"
                  v-model="orderItemFormData.specifications.value"
                  classes="ps-0 pe-0"
                  :is-required="false"
                  rows="2"
                />
                <IconButton
                  kind="btn-success"
                  classes="p-4px"
                  @on-click="onClickAddAssetBtn"
                  style="height: 40px; width: 250px; margin-top: 18px"
                  v-if="!orderItemFormData.tableId"
                >
                  <i class="fas fa-plus"></i> Add Asset
                </IconButton>
                <div v-else>
                  <IconButton
                    kind="btn-defaulr"
                    classes="p-4px"
                    @on-click="onClickCancelUpdateAssetBtn"
                    style="height: 40px; width: 250px; margin-top: 18px"
                  >
                    <i class="fas fa-times"></i> Cancel
                  </IconButton>

                   <IconButton
                    kind="btn-warning"
                    classes="p-4px"
                    @on-click="onClickUpdateAssetBtn"
                    style="height: 40px; width: 250px; margin-top: 18px"
                  >
                    <i class="fas fa-plus"></i> Update Item
                  </IconButton>
                </div>
              </div>
              <div class="flex-grow-1 d-flex flex-column justify-content-start">
                <vue-good-table
                  :columns="orderItemColumns"
                  :rows="orderItems"
                  styleClass="vgt-table striped"
                  :line-numbers="true"
                  max-height="500px"
                  :fixed-header="true"
                  compactMode
                >
                  <template #table-actions>
                    <div
                      class="d-flex justify-content-between align-items-center w-100"
                    >
                      <div class="d-flex align-items-center me-2">&nbsp;</div>
                      <div class="pe-2">
                          <b>Total Amount: &nbsp;&nbsp;&nbsp;{{cmpTotalAmount}}</b>
                      </div>
                    </div>
                  </template>
                  <template #table-row="props">
                    <span
                      v-if="props.column.field == 'btn'"
                      class="d-flex justify-content-end"
                    >
                      <IconButton
                        kind="btn-warning"
                        classes="p-4px mr-4px"
                        @on-click="onClickEditAssetTableBtn(props.row)"
                      >
                        <i class="fas fa-edit"></i>
                      </IconButton>
                      <IconButton
                        kind="btn-danger"
                        classes="p-4px"
                        @on-click="onClickDeleteAssetBtn(props.row)"
                      >
                        <i class="fas fa-times-circle"></i>
                      </IconButton>
                    </span>
                  </template>
                </vue-good-table>
              </div>
            </div>
          </div>
          <div v-if="activePageIndex == 2" style="min-height: 350px">
            <div class="d-flex justify-content-start align-items-end">
              <input
                type="file"
                ref="uploadSupportingFileAcquisitionRef"
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
import MarkedAssetItem from "@/components/viewers/MarkedAssetItem.vue";

let getFormData = function () {
  return {
    branchId: {
      id: "add-purchaseorder-branch-input",
      label: "Acquisition Branch",
      tooltip: "The branch getting these assets",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Acquisition branch is required",
      },
      ref: "branch_id",
    },
    orderNumber: {
      id: "add-purchaseorder-ordernumber-input",
      label: "Order Number",
      tooltip: "An automatic order number will be assigned, if none is given",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 20,
          error: "Cannot be more than 20 digits",
        },
      },
      setEmptyStringIfNull: true,
      ref: "order_number",
    },
    supplierId: {
      id: "add-purchaseorder-supplier-input",
      label: "Supplier",
      tooltip: "Select the source of the assets",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Supplier is required",
      },
      ref: "supplier_id",
    },
    type: {
      id: "add-purchaseorder-type-input",
      label: "Acquisition Type",
      tooltip: "What is the method of acquisition",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Acquisition branch is required",
      },
    },
    requiredDate: {
      id: "add-purchaseorder-required-date-input",
      label: "Required Date",
      tooltip: "When are the assets expected to arrive from the supplier",
      value: "",
      isValid: null,
      validations: {
        required: "Date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "required_date",
    },
    notes: {
      id: "add-purchaseorder-notes-input",
      label: "Order Notes:",
      tooltip: "Include more information about the order",
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
let getOrderItemFormData = function () {
  return {
    name: {
      id: "add-purchaseorder-asset-name-input",
      label: "Asset Name",
      tooltip: "Name of the asset",
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
    unitPrice: {
      id: "add-purchaseorder-asset-unit-price-input",
      label: "Unit Price",
      tooltip: "Unit price of the asset",
      value: "",
      isValid: null,
      validations: {
        required: "Unit price is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        },
        numeric: "Numeric values only",
      },
      ref: "unit_price",
    },
    quantity: {
      id: "add-purchaseorder-asset-quantity-input",
      label: "Quanity",
      tooltip:
        "Quantity must be a whole number e.g 34, 105, 2 - no decimals allowed because an asset cannot be counted with a decimal point i.e you cannot have 2.5 cars",
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
      id: "add-purchaseorder-asset-line-total-input",
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
    specifications: {
      id: "add-purchaseorder-asset-specifications-input",
      label: "Specifications",
      tooltip: "Extra asset specifications/properties",
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
let getUploadFileFormData = function () {
  return {
    acquisitionOrderId: {
      id: "supporting-document-acquisition-input",
      label: "Select Acquisition Order",
      tooltip: "",
      value: "",
      isValid: null,
      validations: {},
      ref: "acquisition_order_id",
    },
    name: {
      id: "supporting-document-acquisition-name-input",
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
      id: "supporting-acquisition-document-type-input",
      label: "Type Of Document",
      tooltip: "The type of document e.g Pdf, Excell",
      value: "",
      isValid: null,
      validations: {},
    },
    link: {
      id: "supporting-acquisition-document-link-input",
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
      branchesItems: [],
      branches: [],
      supplierItems: [],
      suppliers: [],
      acquisitionTypes: Data.acquisitionTypes,
      orderItemFormData: getOrderItemFormData(),
      orderItems: [],
      orderItemColumns: [
        {
          label: "Name",
          field: "name.value",
          sortable: false
        },
        {
          label: "Qty",
          field: "quantity.value",
          type: "number",
          sortable: false,
          formatFn: function(value){
            return Utils.comma(value);
          },
        },
        {
          label: "Unit",
          field: "unitPrice.value",
          type: "number",
          sortable: false,
          formatFn: function(value){
            return Utils.comma(value);
          },
        },
        {
          label: "Total",
          field: "lineTotalAmount.value",
          type: "number",
          sortable: false,
          formatFn: function(value){
            return Utils.comma(value);
          },
        },
        {
          label: "",
          field: "btn"
        },
      ],
      nextItemId: 1,
      uploadedDocuments: [],
      uploadFormData: getUploadFileFormData(),
      fileInputKey: 0,
      iconRefs: Utils.fileTypeIconRef(),
      pages: [
        {
          title: "Order Details",
          number: 1,
          canSkip: false,
        },
        {
          title: "Asset Items",
          number: 2,
          canSkip: false,
        },
        {
          title: "Supporting Documents",
          number: 3,
          canSkip: false,
        },
      ],
      activePageIndex: 0
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
      vm.fetch("addPurchaseOrderDependencies", function (thisVm, res) {
        thisVm.prepareBranches(res.branches);
        thisVm.prepareSuppliers(res.suppliers);
      });
    },
    prepareBranches(branches) {
      this.branches = branches;
      this.branchesItems = Utils.toValueLabelList(branches, "id", "name");
    },
    prepareSuppliers(suppliers) {
      this.suppliers = suppliers;
      this.supplierItems = Utils.toValueLabelList(suppliers, "id", "name");
    },
    editLoadDependencies() {
      var vm = this;
      vm.fetch("updatedPurchaseOrderDependencies", function (thisVm, res) {
        thisVm.prepareBranches(res.branches);
        thisVm.prepareSuppliers(res.suppliers);
        //if we are editing then we need to load the selected items
        let assetsTemp = [];
        for (let index = 0; index < res.orderItems.length; index++) {
          const orderItem = res.orderItems[index];
          let formDataItem = getOrderItemFormData();
          formDataItem = Utils.fillValues(formDataItem, orderItem);
          formDataItem.tableId = thisVm.nextItemId;
          assetsTemp.push(formDataItem);
          thisVm.nextItemId += 1;
        }
        thisVm.orderItems = assetsTemp;
        //load uploaded supported documents
        let uploadsTemp = [];
        for (
          let index = 0;
          index < res.orderSupportDocuments.length;
          index++
        ) {
          let supportDocument = res.orderSupportDocuments[index];
          let uploadFormData = getUploadFileFormData();
          uploadFormData = Utils.fillValues(uploadFormData, supportDocument);
          //add an Id for the sake of deleting from the db
          uploadFormData["id"] = {
            id: "supporting-acquisition-document-id-input",
            label: "",
            tooltip: "",
            value: supportDocument.id,
            isValid: null,
            validations: {},
          };
          uploadsTemp.push(uploadFormData);
        }
        thisVm.uploadedDocuments = uploadsTemp;
        //select the branch
        thisVm.formData.branchId.value = parseInt(thisVm.edits.branch_id);
        thisVm.formData.supplierId.value = parseInt(thisVm.edits.supplier_id);
      });
    },
    onSubmit() {
      var vm = this;
      if (vm.orderItems.length == 0) {
        vm.errors = ["Please add atleast one item to the order"];
        return false;
      }
      vm.post("addPurchaseOrder", "formData", function (vm, res) {
        vm.$emit("on-success");
      });
    },
    onSaveEdits() {
      var vm = this;
      if (vm.orderItems.length == 0) {
        vm.errors = ["Please add atleast one item to the order"];
        return false;
      }
      vm.update(
        "updatePurchaseOrder",
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
          this.$refs.uploadSupportingFileAcquisitionRef.click();
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
            thisVm.$refs.uploadSupportingFileAcquisitionRef.value = null;
            // thisVm.fileInputKey += 1;
          },
          function (thisVm) {
            thisVm.$refs.uploadSupportingFileAcquisitionRef.value = null;
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
          "deleteAcquisiationDocument",
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
        let validationRes = Validator.validateFormData(this.orderItemFormData);
        if (validationRes.isValid) {
          this.errors = [];
          this.orderItems.push({
            ...validationRes.formData,
            tableId: this.nextItemId
          });
          this.orderItemFormData = getOrderItemFormData();
          this.nextItemId += 1;
        } else {
          this.orderItemFormData = validationRes.formData;
        }
      }
    },
    onClickDeleteAssetBtn(assetItem) {
      var vm = this;
      var temp = [];
      for (let index = 0; index < vm.orderItems.length; index++) {
        var orderItem = vm.orderItems[index];
        if (parseInt(assetItem.tableId) != parseInt(orderItem.tableId)) {
          temp.push(orderItem);
        }
      }
      vm.orderItems = temp;
    },
    updateTotalInput() {
      let unitPriceStr = this.orderItemFormData.unitPrice.value;
      unitPriceStr = unitPriceStr.trim ? unitPriceStr.trim() : "";
      let quantityStr = this.orderItemFormData.quantity.value;
      quantityStr = quantityStr.trim ? quantityStr.trim() : "";
      let unitPrice = parseFloat(unitPriceStr);
      let quantity = parseInt(quantityStr);
      if (isNaN(unitPrice) || isNaN(quantity)) {
        this.orderItemFormData.lineTotalAmount.value = "";
      } else {
        let total = unitPrice * quantity;
        this.orderItemFormData.lineTotalAmount.value = total.toString();
      }
    },
    onClickEditAssetTableBtn(assetItem){
      let assetForm = getOrderItemFormData();
      assetForm.name.value = assetItem.name.value;
      assetForm.unitPrice.value = assetItem.unitPrice.value;
      assetForm.quantity.value = assetItem.quantity.value;
      assetForm.lineTotalAmount.value = assetItem.lineTotalAmount.value;
      assetForm.specifications.value = assetItem.specifications.value;
      assetForm.tableId =  assetItem.tableId;
      this.orderItemFormData = assetForm;
    },
    onClickUpdateAssetBtn(e){
      if (e) {
        var tempForm = {...this.orderItemFormData };
        let validationRes = Validator.validateFormData(this.orderItemFormData);
        if (validationRes.isValid) {
          this.errors = [];
          //find the item to be updated
          for (let index = 0; index < this.orderItems.length; index++) {
            const orderItem = this.orderItems[index];
            if(parseInt(orderItem.tableId) == parseInt(tempForm.tableId)){
              this.orderItems[index] = tempForm;
              break;
            }
          }
          this.orderItemFormData = getOrderItemFormData();
        } else {
          this.orderItemFormData = validationRes.formData;
          this.orderItemFormData.tableId = tempForm.tableId;
        }
      }
    },
    onClickCancelUpdateAssetBtn(){
      this.orderItemFormData = getOrderItemFormData();
    },
    onClickAddAssetToDisposalBucketBtn() {
      this.$router.go("/notifications/disposal?select");
    },
    comma(val) {
      return Utils.comma(val);
    },
  },
  computed: {
    cmpTotalAmount(){
        let total = 0;
        for (let index = 0; index < this.orderItems.length; index++) {
          const orderItem = this.orderItems[index];
          total += parseFloat(orderItem.lineTotalAmount.value);
        }
        return this.comma(total);
    }
  },
  mounted() {
    if (this.edits != null) {
      this.formData = Utils.fillValues(this.formData, this.edits);
      this.nextItemId = 1;
    }
    this.loadDependencies();
  },
};
</script>
