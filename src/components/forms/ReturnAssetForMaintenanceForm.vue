<template>
  <CardContainer :hasShadow="false" :show-title="false" :show-sub-title="false">
    <div
      class="alert alert-warningx text-muted text-start w-fit"
      role="alert"
      data-mdb-color="warning"
      v-if="previousCustodian.length && previousCustodian.length > 0"
    >
      The asset was previously collected by: 
      <b style="color: black !important; text-transform: capitalize;">{{previousCustodian}}</b>
    </div>
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-containerx pe-1 w-50">

          <SearchSelectInput
            :id="formData.custodianId.id"
            :label="formData.custodianId.label"
            :tooltip="formData.custodianId.tooltip"
            :errors="formData.custodianId.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.custodianId.value"
            classes="ps-0 pe-0"
            :items="custodiansToSearch"
            :is-required="false"
          />

        <div class="d-flex flex-row">

            <TextInput
                :id="formData.returnedDate.id"
                :label="formData.returnedDate.label"
                :errors="formData.returnedDate.errors"
                :tooltip="formData.returnedDate.tooltip"
                :is-disabled="isLoading || isFormSubmitting"
                type="date"
                v-model="formData.returnedDate.value"
                classes="ps-0 pe-0"
                :is-required="true"
              />

            <SelectInput
                :id="formData.returnedCondition.id"
                :label="formData.returnedCondition.label"
                :errors="formData.returnedCondition.errors"
                :tooltip="formData.returnedCondition.tooltip"
                :is-disabled="isLoading || isFormSubmitting"
                v-model="formData.returnedCondition.value"
                :items="conditionItems"
                classes="ps-1 pe-0"
            />

        </div>

        <TextAreaInput
          :id="formData.returnedNotes.id"
          :label="formData.returnedNotes.label"
          :tooltip="formData.returnedNotes.tooltip"
          :errors="formData.returnedNotes.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.returnedNotes.value"
          classes="ps-0 pe-0"
          :is-required="false"
          rows="2"
        />
      </div>
    </form>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextAreaInput from "@/components/inputs/TextAreaInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import SearchSelectInput from "@/components/inputs/SearchSelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import Data from "@/data/";

let getFormData = function () {
  return {
    returnedDate: {
      id: "return-maintenance-returned-date-input",
      label: "Return Date",
      tooltip: "The date when this asset was returned",
      value: "",
      isValid: null,
      validations: {
        required: "Returned date is required",
        maxLength: {
          value: 10,
          error: "Cannot be more than 10 digits",
        },
      },
      ref: "returned_date",
    },
    custodianId: {
      id: "return-maintenance-custodian-input",
      label: "Custodian",
      tooltip: "Which custodian is returning this asset, this could be different from the one who collected it",
      errors: [],
      value: "",
      isValid: null,
      validations: {
      },
      ref: "custodian_id",
    },
    returnedNotes: {
      id: "return-maintenance-custodian-input",
      label: "Notes:",
      tooltip:
        "If you want, you can provide more info along the return of this asset",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 500,
          error: "Cannot be more than 500 lettersx",
          trim: true
        },
      },
      setEmptyStringIfNull: true,
      ref: "returned_notes",
    },
    returnedCondition: {
      id: "return-maintenance-custodian-input",
      label: "Asset's Condition",
      tooltip: "In what condition is the asset returned",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Condition is required",
      },
      ref: "returned_condition",
    },
    returnedStatus: {
      id: "return-maintenance-status-input",
      label: "Asset's Status",
      tooltip: "",
      errors: [],
      value: "",
      isValid: null,
      validations: {
      },
      ref: "returned_status",
    },
  };
};
export default {
  components: {
    CardContainer,
    TextAreaInput,
    FormErrors,
    SelectInput,
    SearchSelectInput,
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
  },
  data() {
    return {
      errors: [],
      formData: getFormData(),
      isFormSubmitting: false,
      assetUploadConditions: Data.conditions,
      conditionItems: Utils.toValueLabelList(Data.conditions, "value", "label"),
      previousCustodian: "",
      custodiansToSearch: [],
      custodians: []
    };
  },
  watch: {
    pst(val) {
      this.onSaveEdits();
    },
  },
  methods: {
    ...Vm.fetch,
    ...Vm.queryPost,
    ...Vm.update,
    ...Vm.loaders,
    loadDependencies() {
      var vm = this;
      vm.fetch("returnAssetMaintenanceDependencies", function (thisVm, res) {
        thisVm.custodians = res.custodians;
        //get the custodian
        let custodian = (res.allocation != null) ?res.allocation.custodian: null;
        if (custodian != null) {
          thisVm.formData.custodianId.value = parseInt(custodian.id.toString());
        }
        thisVm.custodiansToSearch = Utils.toSearchValueLabelList(
          res.custodians,
          "id",
          function (item) {
            return item.name + " - " + item.contact;
          }
        );
        if(custodian != null){
            thisVm.previousCustodian = `${custodian.name} / ${custodian.contact} in ${res.allocation.allocation_condition} condition`;
        }
        thisVm.formData.returnedStatus.value = res.asset.status;
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update(
        "returnAssetForMaintenance",
        "formData",
        this.edits.id,
        function (thisVm, res) {
          thisVm.$emit("on-success", res);
        }
      );
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
