<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-containerx pe-0 mb-2 justify-content-center">
        <StepperContainer
          :is-tabs-mode="true"
          :is-verticle="false"
          :pages="pages"
          :active-page="activePageIndex"
          :is-disabled="isLoading"
          @on-page-change="onPageChange"
        >
            <div v-if="activePageIndex == 0" style="min-height: 300px">
                <div class="d-flex flex-row">
                  <TextInput
                    :id="formData.grnNumber.id"
                    :label="formData.grnNumber.label"
                    :tooltip="formData.grnNumber.tooltip"
                    :errors="formData.grnNumber.errors"
                    :is-disabled="isLoading || isFormSubmitting"
                    v-model="formData.grnNumber.value"
                    classes="ps-0 pe-0 w-25"
                    :is-required="false"
                    note="(Automatic) "
                  />

                  <div class="w-75"></div>
                </div>
                <TextInput
                  :id="formData.checkedByName.id"
                  :label="formData.checkedByName.label"
                  :tooltip="formData.checkedByName.tooltip"
                  :errors="formData.checkedByName.errors"
                  :is-disabled="isLoading || isFormSubmitting"
                  v-model="formData.checkedByName.value"
                  classes="ps-0 pe-0 lg-w-50"
                  :is-required="false"
                />

                <TextInput
                  :id="formData.deliveryDate.id"
                  :label="formData.deliveryDate.label"
                  :tooltip="formData.deliveryDate.tooltip"
                  :errors="formData.deliveryDate.errors"
                  :is-disabled="isLoading || isFormSubmitting"
                  type="date"
                  v-model="formData.deliveryDate.value"
                  classes="ps-0 pe-0 lg-w-50"
                />

                <TextAreaInput
                  :id="formData.notes.id"
                  :label="formData.notes.label"
                  :tooltip="formData.notes.tooltip"
                  :errors="formData.notes.errors"
                  :is-disabled="isLoading || isFormSubmitting"
                  v-model="formData.notes.value"
                  classes="ps-0 pe-0 lg-w-50"
                  :is-required="false"
                  rows="2"
                />
            </div>
            <div v-else-if="activePageIndex == 1" style="min-height: 300px">
                <vue-good-table
                  :columns="orderItemColumns"
                  :rows="formDataItems"
                  styleClass="vgt-table striped"
                  :line-numbers="true"
                  max-height="450px"
                >
                  <template #table-row="props">
                    <span
                      v-if="props.column.field == 'btn'"
                      class="d-flex justify-content-end"
                    >
                      <IconButton
                        kind="btn-warning"
                        classes="p-4px mr-4px"
                        @on-click="onClickEditRecieveItemTableBtn(props.row)"
                      >
                        <i class="fas fa-edit"></i>
                      </IconButton>
                    </span>
                    <div
                      v-if="props.column.field == 'name.value'"
                      class="d-flex justify-content-start pe-1"
                    >
                        {{props.row.name.value}}
                        <ToolTip class="ms-1" style="margin-top: 2px; color: red;" :text="props.row.rejectionComment.value" v-if="props.row.rejectionComment.value != null && props.row.rejectionComment.value.toString().length > 0" /> 
                    </div>
                    <span
                      v-if="props.column.field == 'status.value'"
                      class="d-flex justify-content-end "
                      :class="'acquisition-receive-item-status-'+props.row.status.value"
                    >
                        {{props.row.status.value}}
                    </span>
                  </template>
                </vue-good-table>
            </div>
            <div v-else-if="activePageIndex == 2" style="min-height: 300px;">
              <div style="background-color: #cccccc0f;">
                <GRNViewer 
                  :views="formData" 
                  :rows="formDataItems" 
                  :order="edits"
                  :received-by="receivedBy"
                />
              </div>
            </div>
        </StepperContainer>
      </div>
    </form>

    <SimpleModal
      id="receive-item-modal"
      title="Receive Delivered Item Form"
      v-model="showFormModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      ok-btn-text="Save"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showFormModal = false"
      @on-ok-btn-click="onClickReceiveItemModalOkBtn"
      size="lg"
    >
      <FormErrors :errors="receiveItemErrors" classes="pe-0 ps-0" />
      <div class="d-flex justify-content-between">
        <div class="flex-grow-1 me-1" style="padding-top: 5px;">
          <TextInput
            :id="itemFormData.name.id"
            :label="itemFormData.name.label"
            :tooltip="itemFormData.name.tooltip"
            :errors="itemFormData.name.errors"
            :is-disabled="true"
            v-model="itemFormData.name.value"
            classes="ps-0 pe-0 "
          />

          <TextInput
            :id="itemFormData.quantity.id"
            :label="itemFormData.quantity.label"
            :tooltip="itemFormData.quantity.tooltip"
            :errors="itemFormData.quantity.errors"
            :is-disabled="true"
            v-model="itemFormData.quantity.value"
            classes="ps-0 pe-0 "
          />

          <TextAreaInput
            :id="itemFormData.specifications.id"
            :label="itemFormData.specifications.label"
            :tooltip="itemFormData.specifications.tooltip"
            :errors="itemFormData.specifications.errors"
            :is-disabled="true"
            v-model="itemFormData.specifications.value"
            classes="ps-0 pe-0"
            :is-required="false"
            rows="2"
          />
          
        </div>
        <div class="flex-grow-1 ms-1">
          <TextInput
            :id="itemFormData.receivePackageIdentityLabel.id"
            :label="itemFormData.receivePackageIdentityLabel.label"
            :tooltip="itemFormData.receivePackageIdentityLabel.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            :errors="itemFormData.receivePackageIdentityLabel.errors"
            v-model="itemFormData.receivePackageIdentityLabel.value"
            classes="ps-0 pe-0 "
            :is-required="false"
          />

          <TextInput
            :id="itemFormData.quantityDelivered.id"
            :label="itemFormData.quantityDelivered.label"
            :tooltip="itemFormData.quantityDelivered.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            :errors="itemFormData.quantityDelivered.errors"
            v-model="itemFormData.quantityDelivered.value"
            classes="ps-0 pe-0 "
            @input="onQuantityDeliveredChange"
          />

          <TextAreaInput
            :id="itemFormData.rejectionComment.id"
            :label="itemFormData.rejectionComment.label"
            :tooltip="itemFormData.rejectionComment.tooltip"
            :errors="itemFormData.rejectionComment.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="itemFormData.rejectionComment.value"
            classes="ps-0 pe-0"
            :is-required="false"
            rows="2"
          />

          <TextInput
            :id="itemFormData.quantityRejected.id"
            :label="itemFormData.quantityRejected.label"
            :tooltip="itemFormData.quantityRejected.tooltip"
            :errors="itemFormData.quantityRejected.errors"
            v-model="itemFormData.quantityRejected.value"
            classes="ps-0 pe-0 "
            :is-disabled="true"
          />

          
        </div>
      </div>
    </SimpleModal>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import StepperContainer from "@/components/containers/StepperContainer.vue";
import IconButton from "@/components/inputs/IconButton.vue";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import Validator from "@/utils/Validator";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import ToolTip from '@/components/ToolTip.vue'
import GRNViewer from '@/components/viewers/GRNViewer.vue'


let getFormData = Utils.getReceivePurchaseOrderFormDataFactory();
let getOrderItemFormData = Utils.getOrderItemFormDataFactory();


export default {
  components: {
    CardContainer,
    TextAreaInput,
    FormErrors,
    SelectInput,
    StepperContainer,
    TextInput,
    IconButton,
    SimpleModal,
    ToolTip,
    GRNViewer
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
      orderItems: [],
      receiveItemErrors: [],
      itemFormData: getOrderItemFormData(),
      formDataItems: [],
      pages: [
        {
          title: "Receive Details",
          number: 1,
          canSkip: false,
        },
        {
          title: "Assets Conditions",
          number: 2,
          canSkip: false,
        },
        {
          title: "Goods Received Note (GRN - Preview)",
          number: 3,
          canSkip: false,
        },
      ],
      activePageIndex: 0,
      orderItemColumns: [
        {
          label: "Name",
          field: "name.value",
          sortable: false,
        },
        {
          label: "Label",
          field: "receivePackageIdentityLabel.value",
          sortable: false,
        },
        {
          label: "Ordered",
          field: "quantity.value",
          tdClass: "text-center",
          thClass: "text-center",
          sortable: false,
          width: "150px"
        },
        {
          label: "Delivered",
          field: "quantityDelivered.value",
          tdClass: "text-center",
          thClass: "text-center",
          sortable: false,
          width: "150px"
        },
        {
          label: "Balance",
          field: "quantityRejected.value",
          tdClass: "text-center",
          thClass: "text-center",
          sortable: false,
          width: "150px"
        },
        {
          label: "Status",
          field: "status.value",
          tdClass: "text-end",
          thClass: "text-end",
          sortable: false,
          width: "150px"
        },
        {
          label: "",
          field: "btn",
          sortable: false,
        },
      ],
      showFormModal: false,
      receivedBy: ""
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
    ...Vm.validateHelpers,
    loadDependencies() {
      var vm = this;
      vm.fetchItem("receivePurchaseOrderItemDetails", vm.edits, function (thisVm, res) {
        thisVm.orderItems = res.orderItems;
        thisVm.resetItemsFormData();
      });
    },
    resetItemsFormData(){
        //create an arrya of item input form datas
        var tempItemsFormData = [];
        for (let index = 0; index < this.orderItems.length; index++) {
            const orderItem = this.orderItems[index];
            let newForm = getOrderItemFormData();
            let entryItem = Utils.fillValues(newForm, orderItem);
            tempItemsFormData.push(entryItem);
        }
        this.formDataItems = tempItemsFormData;
    },
    onIssueSuccess(res) {
      this.$emit("on-success", res);
    },
    onPageChange(page) {
      this.activePageIndex = parseInt(page);
    },
    onClickEditRecieveItemTableBtn(item){
      let newForm = getOrderItemFormData();
      newForm.id.value = item.id.value;
      newForm.name.value = item.name.value;
      newForm.specifications.value = item.specifications.value;
      newForm.quantity.value = item.quantity.value;
      newForm.quantityDelivered.value = item.quantityDelivered.value;
      newForm.quantityRejected.value = item.quantityRejected.value;
      newForm.rejectionComment.value = item.rejectionComment.value;
      newForm.receivePackageIdentityLabel.value = item.receivePackageIdentityLabel.value;
      newForm.status.value = item.status.value;
      newForm.unitPrice.value = item.unitPrice.value;
      this.itemFormData = newForm;
      this.showFormModal = true;
    },
    extraReceiveItemValidation(editedFormItem){
      var isValid = true;
      //manuall validations
      //1. cannot deliver more than was requested
      if(parseInt(editedFormItem.quantityDelivered.value) > 
          parseInt(editedFormItem.quantity.value)
      ){
        //this is not allowed
        editedFormItem.quantityDelivered.isValid = false;
        editedFormItem.quantityDelivered.errors = ["Cannot be more than " + editedFormItem.quantity.value];
        isValid = false;
      }
      //2. cannot deleiver negative quantities
      if(parseInt(editedFormItem.quantityDelivered.value) < 0){
        editedFormItem.quantityDelivered.isValid = false;
        editedFormItem.quantityDelivered.errors = ["Cannot be less than 0"];
        isValid = false;
      }
      //3. if less items were delivered one must add a comment
      if(
        (parseInt(editedFormItem.quantityDelivered.value) < 
          parseInt(editedFormItem.quantity.value)
        ) && editedFormItem.rejectionComment.value.trim().length == 0
      ){
        //this is not allowed
        editedFormItem.rejectionComment.isValid = false;
        editedFormItem.rejectionComment.errors = ["If delivery is less than ordered or 0, add a comment"];
        isValid = false;
      }
      return {isValid: isValid, formData: editedFormItem};
    },
    onClickReceiveItemModalOkBtn(){
      //validate the input before 
      let validationRes = Validator.validateFormData(this.itemFormData);
      if (!validationRes.isValid) {
        this.itemFormData = validationRes.formData;
        this.receiveItemErrors = ["Fix errors and submit again"];
        return false; 
      }
      let extraValidationRes = this.extraReceiveItemValidation(validationRes.formData);
      if(!extraValidationRes.isValid){
        this.itemFormData = extraValidationRes.formData;
        this.receiveItemErrors = ["Fix errors and submit again"];
        return false; 
      }
      let editedFormItem = { ... extraValidationRes.formData };
      this.receiveItemErrors = [];
      //get the form data item and update it
      var tempList = [];
      for (let index = 0; index < this.formDataItems.length; index++) {
        const formDataItem = this.formDataItems[index];
        if(parseInt(formDataItem.id.value) == parseInt(editedFormItem.id.value)){
          let balance = parseInt(editedFormItem.quantity.value) - parseInt(editedFormItem.quantityDelivered.value); 
          editedFormItem.status.value = "delivered";
          if(balance > 0){
            editedFormItem.status.value = "partially";
          }
          editedFormItem.quantityRejected.value = balance;
          tempList.push(editedFormItem);
        }else{
          tempList.push(formDataItem);
        } 
      }
      this.formDataItems = tempList;
      this.itemFormData = getOrderItemFormData();
      this.showFormModal = false;
    },
    onQuantityDeliveredChange(){
      let quantityDelivered = parseInt(this.itemFormData.quantityDelivered.value);
      if(isNaN(quantityDelivered)){
        this.itemFormData.quantityRejected.value = "";
        return false;
      }      
      let quantityOrdered = parseInt(this.itemFormData.quantity.value);
      if(isNaN(quantityOrdered)){
        this.itemFormData.quantityRejected.value = "";
         return false;
      } 
      let balance = quantityOrdered - quantityDelivered;
      this.itemFormData.quantityRejected.value = balance;
    },
    onSaveEdits() {
      var vm = this;
      //no item should have a pending status
      for (let index = 0; index < this.formDataItems.length; index++) {
        const formDataItem = this.formDataItems[index];
        if(formDataItem.status.value == "pending"){
          vm.errors = ["Please complete receiving of all items"];
          return false;
        }
      }
      if (vm.formDataItems.length == 0) {
        vm.errors = ["Please add atleast one item to the order"];
        return false;
      }
      vm.update(
        "receivePurchaseOrder",
        "formData",
        this.edits.id,
        function (thisVm, res) {
          thisVm.$emit("on-success", res);
        }
      );
    },
  },
  mounted() {
    if (this.edits != null) {
        this.formData = getFormData(this.context);
        this.formData = Utils.fillValues(this.formData, this.edits);
    }
    var userStr = localStorage.getItem("user");
    var user = JSON.parse(userStr);
    this.receivedBy = user.name;
    this.loadDependencies();
  },

};
</script>
