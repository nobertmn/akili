<template>
  <CardContainer :hasShadow="false" :show-title="false" :show-sub-title="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-containerx pe-1">
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
            @change="onChangeBranch"
          />

          <SelectInput
            :id="formData.siteId.id"
            :label="formData.siteId.label"
            :errors="formData.siteId.errors"
            :tooltip="formData.siteId.tooltip"
            :is-disabled="
              isLoading || isFormSubmitting || siteItems.length == 0
            "
            v-model="formData.siteId.value"
            :items="siteItems"
            classes="ps-1 pe-0"
            :is-required="siteItems.length == 0 ? false : true"
            :note="cmptdSiteInputNote"
          />
        </div>

        <div class="d-flex flex-row">
          <SelectInput
            :id="formData.departmentId.id"
            :label="formData.departmentId.label"
            :errors="formData.departmentId.errors"
            :tooltip="formData.departmentId.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.departmentId.value"
            :items="departmentItems"
            classes="ps-0 pe-1"
          />

          <SelectInput
            :id="formData.condition.id"
            :label="formData.condition.label"
            :errors="formData.condition.errors"
            :tooltip="formData.condition.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.condition.value"
            :items="conditionItems"
            classes="ps-1 pe-0"
          />
        </div>

        <div class="d-flex flex-row">
          <SearchSelectInput
            :id="formData.custodianId.id"
            :label="formData.custodianId.label"
            :tooltip="formData.custodianId.tooltip"
            :errors="formData.custodianId.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.custodianId.value"
            :classes="
              cmptdRequesterIsNotInCustodians ? 'ps-0 pe-1' : 'ps-0 pe-0'
            "
            :items="custodiansToSearch"
          />

          <div
            class="text-end"
            style="padding-top: 38px"
            v-if="cmptdRequesterIsNotInCustodians"
          >
            <button
              style="height: 40px; width: 280px"
              color="warning"
              @click.stop="onClickAddRequesterAsCustodianBtn"
              class="ms-1 me-0 btn btn-warning"
              type="button"
              :is-disabled="isLoading || isFormSubmitting"
            >
              <i class="fas fa-plus"></i> Add Requester To Custodians
            </button>
          </div>
        </div>

        <TextAreaInput
          :id="formData.collectionNotes.id"
          :label="formData.collectionNotes.label"
          :tooltip="formData.collectionNotes.tooltip"
          :errors="formData.collectionNotes.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.collectionNotes.value"
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
import SearchSelectInput from "@/components/inputs/SearchSelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import Data from "@/data/";

let getFormData = function () {
  return {
    condition: {
      id: "collectrequisition-conditon-input",
      label: "Asset's Condition",
      tooltip: "In what condition is the asset",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Condition is required",
      },
      ref: "condition",
    },
    branchId: {
      id: "collectrequisition-branch-input",
      label: "Company Branch",
      tooltip: "Which company branch is this asset going to",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Company Branch is required",
      },
      ref: "branch_id",
    },
    siteId: {
      id: "collectrequisition-site-input",
      label: "Company Site",
      tooltip: "Which company site is this asset going to",
      errors: [],
      value: "0",
      isValid: null,
      validations: {
        required: "Company Site is required",
      },
      ref: "site_id",
    },
    departmentId: {
      id: "collectrequisition-department-input",
      label: "Department",
      tooltip: "Which department is this asset going to",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Company Department is required",
      },
      ref: "department_id",
    },
    custodianId: {
      id: "collectrequisition-custodian-input",
      label: "Custodian",
      tooltip: "Which custodian is gonna be allocated this asset",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Custodian is required",
      },
      ref: "custodian_id",
    },
    collectionNotes: {
      id: "collectrequisition-reason-input",
      label: "Any Allocation Remarks:",
      tooltip:
        "If you want, you can provide more info along your allocation of this asset",
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
      ref: "collection_notes",
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
      branchesItems: [],
      branches: [],
      sites: [],
      siteItems: [],
      departments: [],
      departmentItems: [],
      custodiansToSearch: [],
      custodians: [],
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
      vm.fetch("collectRequisitionDependencies", function (thisVm, res) {
        thisVm.branches = res.branches;
        thisVm.sites = res.sites;
        thisVm.departments = res.departments;
        thisVm.branchesItems = Utils.toValueLabelList(
          res.branches,
          "id",
          "name"
        );
        thisVm.departmentItems = Utils.toValueLabelList(
          res.departments,
          "id",
          "name"
        );
        thisVm.custodians = res.custodians;
        //set possible custodian 
        let custodian = thisVm.getPossibleContextCustodian();
        if(custodian != null){
            thisVm.formData.custodianId.value = parseInt(custodian.id.toString());
        }

        thisVm.custodiansToSearch = Utils.toSearchValueLabelList(
          res.custodians,
          "id",
          function (item) {
            return item.name + " - " + item.contact;
          }
        );
        thisVm.evaluateSitesDropDown();
        
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update(
        "collectRequisition",
        "formData",
        this.edits.id,
        function (thisVm, res) {
          thisVm.$emit("on-success", res);
        }
      );
    },
    onChangeBranch() {
      var branchId = this.formData.branchId.value;
      var branchSites = Utils.pickFilter(this.sites, "branch_id", branchId);
      this.siteItems = Utils.toValueLabelList(branchSites, "id", "name");
      this.evaluateSitesDropDown();
    },
    evaluateSitesDropDown() {
      if (this.siteItems.length == 0) {
        this.formData.siteId.value = "0";
        this.formData.siteId.validations = {};
      } else {
        this.formData.siteId.validations = {
          required: "Company Site is required",
        };
      }
    },
    onClickAddRequesterAsCustodianBtn() {
      var vm = this;
      var postQueryFormData = {
        name: {
          id: "",
          label: "",
          tooltip: "",
          errors: [],
          value: vm.edits.requesters_name,
          isValid: null,
          validations: {},
        },
        contact: {
          id: "",
          label: "",
          tooltip: "",
          errors: [],
          value: vm.edits.requesters_contact,
          isValid: null,
          validations: {},
        },
      };
      vm.queryPost(
        "addRequesterAsCustodian",
        postQueryFormData,
        function (thisVm, res) {
          thisVm.loadDependencies();
        }
      );
    },
    getPossibleContextCustodian() {
      let name = this.edits.requesters_name.toLowerCase();
      let contact = this.edits.requesters_contact.toLowerCase();
      let custodian = Utils.pick(this.custodians, "id", function (item) {
        //search contact
        if (item.contact.toLowerCase() == contact) {
          return true;
        }
        //search name
        if (item.name.toLowerCase() == name) {
          return true;
        }
        return false;
      });
      return custodian;
    },
  },
  computed: {
    cmptdSiteInputNote() {
      let note = "";
      if (this.siteItems.length == 0 && this.formData.branchId.value == "") {
        note = "select a branch ";
      } else if (
        this.siteItems.length == 0 &&
        this.formData.branchId.value != ""
      ) {
        note = "(selected branch has no sites)";
      }
      return note;
    },
    cmptdRequesterIsNotInCustodians() {
      let custodian = this.getPossibleContextCustodian();
      return custodian == null;
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
