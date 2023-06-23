<template>
  <CardContainer :hasShadow="false">
    <FormErrors :errors="errors" classes="pe-0 ps-0" />
    <form novalidate>
      <div class="form-fields-containerx pe-3x">

        <SearchSelectInput
            :id="formData.userId.id"
            :label="formData.userId.label"
            :tooltip="formData.userId.tooltip"
            :errors="formData.userId.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.userId.value"
            classes="ps-0 pe-0"
            :items="usersToSearch"
            :is-required="false"
          />

        <hr class="mt-4"/>

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
          :id="formData.contact.id"
          :label="formData.contact.label"
          :tooltip="formData.contact.tooltip"
          :errors="formData.contact.errors"
          :is-disabled="isLoading || isFormSubmitting"
          v-model="formData.contact.value"
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
import SearchSelectInput from "@/components/inputs/SearchSelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import Validator from "@/utils/Validator";
import Http from "@/utils/Http";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

let getFormData = function () {
  return {
    name: {
      id: "addcustodian-name-input",
      label: "Name",
      tooltip: "The name of the custodian",
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
    contact: {
      id: "addcustodian-contact-input",
      label: "Contact",
      tooltip: "The contact of the custodian",
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
    userId: {
      id: "addcustodian-user-input",
      label: "System User",
      tooltip: "Add a system user as a custodian",
      errors: [],
      value: "",
      isValid: null,
      validations: {
      },
    },
  };
};
export default {
  components: {
    CardContainer,
    TextInput,
    FormErrors,
    SearchSelectInput
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
      usersToSearch: [],
      users: []
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
    "formData.userId.value": function(val){
      //set the name of the custodian
      if(val){
        let userId = parseInt(val);
        let user = Utils.pick(this.users,"id", userId);
        if(user){
          this.formData.name.value = user.name;
        }
      }
    }
  },
  methods: {
    ...Vm.fetch,
    ...Vm.post,
    ...Vm.update,
    loadDependencies() {
      var vm = this;
      vm.fetch("addCustodianDependencies", function (thisVm, res) {
        thisVm.users = res.users;
        //auto select assciated user
        if (thisVm.edits != null) {
          let userId = thisVm.edits.user_id.toString();
          if(userId != "0" && userId != ""){
            userId = parseInt(userId);
            thisVm.formData.userId.value = userId;
          }
        }
        thisVm.usersToSearch = Utils.toSearchValueLabelList(
          res.users,
          "id",
          function (item) {
            return item.name + " - " + item.email;
          }
        );
      });
    },
    onSubmit() {
        var vm = this;
        vm.post("addCustodian", "formData", function(vm, res){
            vm.$emit("on-success");
        });
    },
    onSaveEdits() {
        var vm = this;
        vm.update("updateCustodian", "formData", this.edits.id, function(vm, res){
            vm.$emit("on-success");
        });
    }
  },
  mounted() {
    if (this.edits != null) {
        this.formData = Utils.fillValues(this.formData, this.edits,);
    }
    this.loadDependencies();
  },
};
</script>
