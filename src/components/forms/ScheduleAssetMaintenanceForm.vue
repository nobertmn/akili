<template>
  <CardContainer
    :hasShadow="false"
    :show-title="false"
    :show-sub-title="false"
    classes="mb-0"
  >
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="w-100 d-flex flex-row justify-content-start">
        <div
          class="d-flex flex-column justify-content-start add-order-item-form"
          style="width: 300px"
        >
          <SearchSelectInput
            :id="formData.maintainanceWorkTypeId.id"
            :label="formData.maintainanceWorkTypeId.label"
            :tooltip="formData.maintainanceWorkTypeId.tooltip"
            :errors="formData.maintainanceWorkTypeId.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.maintainanceWorkTypeId.value"
            classes="ps-0 pe-0 "
            :items="workTypesToSearch"
          />

          <!-- <TextInput
            :id="formData.name.id"
            :label="formData.name.label"
            :tooltip="formData.name.tooltip"
            :errors="formData.name.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.name.value"
            classes="ps-0 pe-0 "
          /> -->

          <div class="d-flex flex-row">
            <TextInput
              :id="formData.unitCost.id"
              :label="formData.unitCost.label"
              :tooltip="formData.unitCost.tooltip"
              :errors="formData.unitCost.errors"
              :is-disabled="isLoading || isFormSubmitting"
              v-model="formData.unitCost.value"
              classes="ps-0 pe-0"
              @input="updateTotalInput"
              style="margin-right: 2px"
            />

            <TextInput
              :id="formData.quantity.id"
              :label="formData.quantity.label"
              :tooltip="formData.quantity.tooltip"
              :errors="formData.quantity.errors"
              :is-disabled="isLoading || isFormSubmitting"
              v-model="formData.quantity.value"
              classes="ps-0 pe-0"
              @input="updateTotalInput"
              style="width: 200px"
            />
          </div>

          <TextInput
            :id="formData.lineTotalAmount.id"
            :label="formData.lineTotalAmount.label"
            :tooltip="formData.lineTotalAmount.tooltip"
            :errors="formData.lineTotalAmount.errors"
            :is-disabled="true"
            v-model="formData.lineTotalAmount.value"
            classes="ps-0 pe-0"
            note="(auto) "
          />

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

          <IconButton
            kind="btn-success"
            classes="p-4px"
            @on-click="onClickAddWorkItemBtn"
            style="height: 40px; width: 270px; margin-top: 18px"
            v-if="!formData.tableId"
          >
            <i class="fas fa-plus"></i> Add Work Item
          </IconButton>
          <div v-else>
            <IconButton
              kind="btn-defaulr"
              classes="p-4px"
              @on-click="onClickCancelUpdateWorkItemBtn"
              style="height: 40px; width: 250px; margin-top: 18px"
            >
              <i class="fas fa-times"></i> Cancel
            </IconButton>

            <IconButton
              kind="btn-warning"
              classes="p-4px"
              @on-click="onClickUpdateWorkItemBtn"
              style="height: 40px; width: 250px; margin-top: 18px"
            >
              <i class="fas fa-plus"></i> Update Item
            </IconButton>
          </div>
        </div>
        <div class="flex-grow-1 d-flex flex-column justify-content-start">
          <vue-good-table
            :columns="workItemColumns"
            :rows="workItems"
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
                  <b class="me-2"
                    >Total Days Gained: &nbsp;&nbsp;&nbsp;{{ cmpTotalDays }}</b
                  >

                  <b>Total Cost: &nbsp;&nbsp;&nbsp;{{ cmpTotalAmount }}</b>
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
                  @on-click="onClickEditWorkTableItemBtn(props.row)"
                >
                  <i class="fas fa-edit"></i>
                </IconButton>
                <IconButton
                  kind="btn-danger"
                  classes="p-4px"
                  @on-click="onClickDeleteWorkTableItemBtn(props.row)"
                >
                  <i class="fas fa-times-circle"></i>
                </IconButton>
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>
    </form>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import IconButton from "@/components/inputs/IconButton.vue";
import SearchSelectInput from "@/components/inputs/SearchSelectInput.vue";
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import Validator from "@/utils/Validator";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

let getFormData = function () {
  return {
    maintainanceWorkTypeId: {
      id: "add-maintenance-asset-input",
      label: "Maintenance Work Type",
      tooltip: "What type of wotk is this maintenance work",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Asset is required",
      },
      ref: "maintainance_work_type_id",
    },
    name: {
      id: "add-maintenance-work-name-input",
      label: "Item Title",
      tooltip: "Title of the work to be done",
      value: "",
      isValid: null,
      validations: {
        // required: "Work title is required",
        // maxLength: {
        //   value: 200,
        //   error: "Cannot be more than 200 letters",
        // },
        // minLength: {
        //   value: 2,
        //   error: "Atleast 2 letters are required",
        // },
      },
    },
    unitCost: {
      id: "add-maintenance-work-cost-input",
      label: "Unit Cost",
      tooltip: "Unit cost of the asset",
      value: "",
      isValid: null,
      validations: {
        required: "Required",
        maxLength: {
          value: 30,
          error: "< 30 digits",
        },
        numeric: "Numeric only",
      },
      ref: "unit_cost",
    },
    quantity: {
      id: "add-maintenance-work-quantity-input",
      label: "Quanity",
      tooltip: "Quantity must be a whole number e.g 34, 105, 2 - no decimals",
      value: "",
      isValid: null,
      validations: {
        required: "Required",
        maxLength: {
          value: 10,
          error: "< 10 digits",
        },
        digitsOnly: "Only digits",
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
      label: "Notes",
      tooltip: "Any remarks on this item",
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
    FormErrors,
    TextInput,
    IconButton,
    SearchSelectInput,
    TextAreaInput,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    edits: {
      type: Object,
      default: function () {
        return null;
      },
    },
    classes: {
      type: String,
      default: "",
    },
    pst: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      errors: [],
      formData: getFormData(),
      isFormSubmitting: false,
      workTypesToSearch: [],
      workTypes: [],
      workItems: [],
      nextItemId: 1,
      workItemColumns: [
        {
          label: "Name",
          field: "name.value",
          sortable: false,
        },
        {
          label: "Qty",
          field: "quantity.value",
          type: "number",
          sortable: false,
          formatFn: function (value) {
            return Utils.comma(value);
          },
        },
        {
          label: "Unit",
          field: "unitCost.value",
          type: "number",
          sortable: false,
          formatFn: function (value) {
            return Utils.comma(value);
          },
        },
        {
          label: "Total",
          field: "lineTotalAmount.value",
          type: "number",
          sortable: false,
          formatFn: function (value) {
            return Utils.comma(value);
          },
        },
        {
          label: "",
          field: "btn",
        },
      ],
      asset: null
    };
  },
  watch: {
    pst(val) {
      this.onSubmit();
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
      var vm = this;
      vm.fetch("scheduleAssetMaintenanceDependencies", function (thisVm, res) {
        thisVm.workTypes = res.maintainanceWorkTypes;
        thisVm.workTypesToSearch = Utils.toSearchValueLabelList(
          res.maintainanceWorkTypes,
          "id",
          "name"
        );
        thisVm.asset = res.asset;
      });
    },
    updateTotalInput() {
      let unitCostStr = this.formData.unitCost.value;
      unitCostStr = unitCostStr.trim ? unitCostStr.trim() : "";
      let quantityStr = this.formData.quantity.value;
      quantityStr = quantityStr.trim ? quantityStr.trim() : "";
      let unitCost = parseFloat(unitCostStr);
      let quantity = parseInt(quantityStr);
      if (isNaN(unitCost) || isNaN(quantity)) {
        this.formData.lineTotalAmount.value = "";
      } else {
        let total = unitCost * quantity;
        this.formData.lineTotalAmount.value = total.toString();
      }
    },
    onClickAddWorkItemBtn(e) {
      if (e) {
        let validationRes = Validator.validateFormData(this.formData);
        if (validationRes.isValid) {
          this.errors = [];
          var item = {
            ...validationRes.formData,
            tableId: this.nextItemId,
          };

          var typeId = parseFloat(item.maintainanceWorkTypeId.value);
          let workType = Utils.pick(this.workTypes, "id", typeId);
          item.name.value = workType.name;
          this.workItems.push(item);
          this.formData = getFormData();
          this.nextItemId += 1;
        } else {
          this.formData = validationRes.formData;
        }
      }
    },
    onClickCancelUpdateWorkItemBtn() {
      this.formData = getFormData();
    },
    onClickUpdateWorkItemBtn(e) {
      if (e) {
        var tempForm = { ...this.formData };
        let validationRes = Validator.validateFormData(this.formData);
        if (validationRes.isValid) {
          this.errors = [];
          //find the item to be updated
          for (let index = 0; index < this.workItems.length; index++) {
            const workItem = this.workItems[index];
            if (parseInt(workItem.tableId) == parseInt(tempForm.tableId)) {
              var typeId = parseFloat(tempForm.maintainanceWorkTypeId.value);
              let workType = Utils.pick(this.workTypes, "id", typeId);
              tempForm.name.value = workType.name;

              this.workItems[index] = tempForm;
              break;
            }
          }
          this.formData = getFormData();
        } else {
          this.formData = validationRes.formData;
          this.formData.tableId = tempForm.tableId;
        }
      }
    },
    onClickEditWorkTableItemBtn(selectedItem) {
      let itemForm = getFormData();
      itemForm.maintainanceWorkTypeId.value =
        selectedItem.maintainanceWorkTypeId.value;
      itemForm.name.value = selectedItem.name.value;

      var typeId = parseFloat(selectedItem.maintainanceWorkTypeId.value);
      let workType = Utils.pick(this.workTypes, "id", typeId);
      itemForm.name.value = workType.name;

      itemForm.unitCost.value = selectedItem.unitCost.value;
      itemForm.quantity.value = selectedItem.quantity.value;
      itemForm.lineTotalAmount.value = selectedItem.lineTotalAmount.value;
      itemForm.notes.value = selectedItem.notes.value;
      itemForm.tableId = selectedItem.tableId;
      this.formData = itemForm;
    },
    onClickDeleteWorkTableItemBtn(selectedItem) {
      var vm = this;
      var temp = [];
      for (let index = 0; index < vm.workItems.length; index++) {
        var workItem = vm.workItems[index];
        if (parseInt(workItem.tableId) != parseInt(selectedItem.tableId)) {
          temp.push(workItem);
        }
      }
      vm.workItems = temp;
    },
    comma(val) {
      return Utils.comma(val);
    },
    onSubmit() {
      var vm = this;
      if (vm.workItems.length == 0) {
        vm.errors = ["Please add atleast one item to the work schedule"];
        return false;
      }
      let validateBeforePosting = false;
      vm.post("addAssetMaintenanceSchedule", "formData", function (thisVm, res) {
        thisVm.$emit("on-success", res);
      }, validateBeforePosting);
    },
  },
  computed: {
    cmpTotalAmount() {
      let total = 0;
      for (let index = 0; index < this.workItems.length; index++) {
        const workItem = this.workItems[index];
        total += parseFloat(workItem.lineTotalAmount.value);
      }
      return this.comma(total);
    },
    cmpTotalDays() {
      let total = 0;
      for (let index = 0; index < this.workItems.length; index++) {
        const workItem = this.workItems[index];
        var typeId = parseFloat(workItem.maintainanceWorkTypeId.value);
        let workType = Utils.pick(this.workTypes, "id", typeId);
        total += parseInt(workType.life_time_increase_days);
      }
      var days = this.workItems.length > 0? Math.ceil(total/ this.workItems.length) : 0;
      return this.comma(days);
    },
  },
  mounted() {
    this.loadDependencies();
  },
};
</script> 