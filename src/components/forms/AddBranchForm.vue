<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-container pe-3">
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
      </div>
    </form>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Validator from "@/utils/Validator";
import Http from "@/utils/Http";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

let getFormData = function () {
  return {
    name: {
      id: "addbranch-name-input",
      label: "Name",
      tooltip: "The name of the company branch",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Name is required",
        maxLength: {
          value: 60,
          error: "Cannot be more than 60 letters",
        },
        minLength: {
          value: 5,
          error: "Atleast 5 letters are required",
        },
      },
    },
    location: {
      id: "addbranch-location-input",
      label: "Location",
      tooltip: "The location of this company branch",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 60,
          error: "Cannot be more than 60 letters",
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
      roles: [],
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
    onSubmit() {
        var vm = this;
        vm.post("addBranch", "formData", function(vm, res){
            vm.$emit("on-success");
        });
    },
    onSaveEdits() {
        var vm = this;
        vm.update("updateBranch", "formData", this.edits.id, function(vm, res){
            vm.$emit("on-success");
        });
    },
  },
  mounted() {
    if (this.edits != null) {
        this.formData = Utils.fillValues(this.formData, this.edits);
    }
  },
};
</script>
