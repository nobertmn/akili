<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="">
        <div class="d-flex justify-content-between">
          <TextInput
            :id="formData.name.id"
            :label="formData.name.label"
            :tooltip="formData.name.tooltip"
            :errors="formData.name.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.name.value"
            classes="ps-0 pe-1"
          />

          <SelectInput
            :id="formData.type.id"
            :label="formData.type.label"
            :tooltip="formData.type.tooltip"
            :errors="formData.type.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.type.value"
            :items="supplierTypes"
            classes="ps-1 pe-0"
          />
        </div>
        <div class="d-flex justify-content-between">
          <TextInput
            :id="formData.primaryContact.id"
            :label="formData.primaryContact.label"
            :tooltip="formData.primaryContact.tooltip"
            :errors="formData.primaryContact.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.primaryContact.value"
            classes="ps-0 pe-1"
          />
          <TextInput
            :id="formData.otherContact.id"
            :label="formData.otherContact.label"
            :tooltip="formData.otherContact.tooltip"
            :errors="formData.otherContact.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.otherContact.value"
            :is-required="false"
            classes="ps-1 pe-0"
          />
        </div>
        <div class="d-flex justify-content-between">
          <TextInput
            :id="formData.email.id"
            :label="formData.email.label"
            :tooltip="formData.email.tooltip"
            :errors="formData.email.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.email.value"
            classes="ps-0 pe-1"
            :is-required="false"
          />
          <TextInput
            :id="formData.website.id"
            :label="formData.website.label"
            :tooltip="formData.website.tooltip"
            :errors="formData.website.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.website.value"
            :is-required="false"
            classes="ps-1 pe-0"
          />
        </div>
        <TextInput
          :id="formData.address.id"
          :label="formData.address.label"
          :tooltip="formData.address.tooltip"
          :errors="formData.address.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.address.value"
          classes="ps-0 pe-0"
          :is-required="false"
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
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import Data from "@/data/";

let getFormData = function () {
  return {
    name: {
      id: "addsupplier-name-input",
      label: "Suppliers Name",
      tooltip: "Specify a name of the supplier",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Supplier's name is required",
        maxLength: {
          value: 150,
          error: "Cannot be more than 150 letters",
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required",
        },
      },
    },
    type: {
      id: "addsupplier-type-input",
      label: "Type",
      tooltip: "What type of supplier is this",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Supplier Type is required",
      },
    },
    primaryContact: {
      id: "addsupplier-primary-contact-input",
      label: "Primary Contact",
      tooltip: "The main contact info for the supplier",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Primary contact is required",
        maxLength: {
          value: 150,
          error: "Cannot be more than 150 letters",
        },
        minLength: {
          value: 7,
          error: "Atleast 7 letters are required",
        },
      },
      ref: "primary_contact",
    },
    otherContact: {
      id: "addsupplier-other-contact-input",
      label: "Other Contact",
      tooltip: "Any other contact info for the supplier",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 150,
          error: "Cannot be more than 150 letters",
        },
      },
      setEmptyStringIfNull: true,
      ref: "other_contact",
    },
    email: {
      id: "addsupplier-email-input",
      label: "Email Address",
      tooltip: "The email address for the supplier",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 60,
          error: "Cannot be more than 60 letters",
        },
        emailFormat: {
          ignoreIfEmpty: true,
          error: "Invalid email address",
        },
      },
      setEmptyStringIfNull: true,
    },
    website: {
      id: "addsupplier-website-input",
      label: "Website URL",
      tooltip: "The website url for the supplier",
      errors: [],
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
    address: {
      id: "addsupplier-address-input",
      label: "Physical Address",
      tooltip: "The location of the supplier",
      errors: [],
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
      supplierTypes: Data.supplierTypes,
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
    ...Vm.post,
    ...Vm.update,
    onSubmit() {
      var vm = this;
      vm.post("addSupplier", "formData", function (vm, res) {
        vm.$emit("on-success");
      });
    },
    onSaveEdits() {
      var vm = this;
      vm.update(
        "updateSupplier",
        "formData",
        this.edits.id,
        function (vm, res) {
          vm.$emit("on-success");
        }
      );
    },
  },
  mounted() {
    if (this.edits != null) {
      this.formData = Utils.fillValues(this.formData, this.edits);
    }
  },
};
</script>
