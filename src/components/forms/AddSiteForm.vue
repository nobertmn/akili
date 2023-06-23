<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-container pe-3">
        <SelectInput
            :id="formData.branchId.id"
            :label="formData.branchId.label"
            :tooltip="formData.branchId.tooltip"
            :errors="formData.branchId.errors"
            :required="true"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.branchId.value"
            :items="branches"
            classes="ps-0 pe-0" />
        <TextInput
          :id="formData.name.id"
          :label="formData.name.label"
          :tooltip="formData.name.tooltip"
          :errors="formData.name.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.name.value"
          classes="ps-0 pe-0"
        />
        <TextInput
          :id="formData.location.id"
          :label="formData.location.label"
          :tooltip="formData.location.tooltip"
          :errors="formData.location.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.location.value"
          :is-required="false"
          classes="ps-0 pe-0"
        />
        <TextInput
          :id="formData.remarks.id"
          :label="formData.remarks.label"
          :tooltip="formData.remarks.tooltip"
          :errors="formData.remarks.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.remarks.value"
          :is-required="false"
          classes="ps-0 pe-0"
        />
      </div>
    </form>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Validator from "@/utils/Validator";
import Http from "@/utils/Http";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

let getFormData = function () {
  return {
    branchId: {
        id: "addsite-branchid-input",
        label: "Branch",
        tooltip: "Select the branch that owns this site",
        errors: [],
        value: "",
        isValid: null,
        validations: {
            required: "Select a branch"
        },
    },
    name: {
        id: "addsite-name-input",
        label: "Site Name",
        tooltip: "Specify a name for the site",
        errors: [],
        value: "",
        isValid: null,
        validations: {
            required: "Sites's name is required",
            maxLength: {
                value: 150,
                error: "Cannot be more than 150 letters"
            },
            minLength: {
                value: 3,
                error: "Atleast 3 letters are required"
            }
        },
    },
    location: {
        id: "addsite-location-input",
        label: "Location",
        tooltip: "The location of the site",
        errors: [],
        value: "",
        isValid: null,
        validations: {
            required: "Site location is required",
            maxLength: {
                value: 150,
                error: "Cannot be more than 150 letters"
            },
            minLength: {
                value: 3,
                error: "Atleast 3 letters are required"
            }
        },
    },
    remarks: {
        id: "addsite-remarks-input",
        label: "Remarks",
        tooltip: "Optional: any thing to note about this company site",
        errors: [],
        value: "",
        isValid: null,
        validations: {
            maxLength: {
                value: 250,
                error: "Cannot be more than 250 letters"
            }
        },
    },
  };
};
export default {
  components: {
    CardContainer,
    TextInput,
    FormErrors,
    SelectInput,
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
      branches: [],
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
    loadDependencies(){
        this.fetch("addSitesDependencies", function(vm, res){
            vm.branches = res.branches;
        });
    },
    onSubmit() {
        var vm = this;
        vm.post("addSite", "formData", function(vm, res){
            vm.$emit("on-success");
        });
    },
    onSaveEdits() {
        var vm = this;
        vm.update("updateSite", "formData", this.edits.id, function(vm, res){
            vm.$emit("on-success");
        });
    },
  },
  mounted() {
    if (this.edits != null) {
        this.siteToEdit = {
            ...this.edits,
            branchId: this.edits.branch_id,
        }
        this.formData = Utils.fillValues(this.formData, this.siteToEdit);
    }
    this.loadDependencies();
  },
};
</script>
