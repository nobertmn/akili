<template>
  <form novalidate class="d-flex">
    <div class="">
      <CompanyUsersImage />
      <div class="m-2">
        <div
          class="alert alert-info text-start"
          role="alert"
          data-mdb-color="primary"
        >
          <b>*</b> A super admin user was automatically created.<br />
          <b>*</b> Invite other team members for the following roles
        </div>
      </div>
      <KeyValueList :items="basicInfo" />
    </div>
    <div class="flex-grow-1">
      <div class="d-flex flex-column">
        <FormErrors :errors="errors" />
        <div class="d-flex flex-column mt-2">
          <MDBTable sm class="table table-borderless">
            <tbody>
              <tr class="">
                <td style="" class="text-start pt-0">
                    <TextInput
                        :id="formData.assetManagerName.id"
                        :label="formData.assetManagerName.label"
                        :tooltip="formData.assetManagerName.tooltip"
                        :errors="formData.assetManagerName.errors"
                        :required="true"
                        :is-disabled="isLoading || isFormSubmitting"
                        v-model="formData.assetManagerName.value"
                        classes="ps-0 bold-label pt-0"
                    />
                </td>
                <td style="" class="text-start pt-0">
                    <TextInput
                        :id="formData.assetManager.id"
                        :label="formData.assetManager.label"
                        :tooltip="formData.assetManager.tooltip"
                        :errors="formData.assetManager.errors"
                        :required="true"
                        :is-disabled="isLoading || isFormSubmitting"
                        v-model="formData.assetManager.value"
                        classes="ps-0 bold-label pt-0"
                    />
                </td>
                <td class="text-start pe-0">
                  <div class="middle-td pt-2 fw-bolder justify-content-end">
                      {{Object.hasOwnProperty.call(emailStatuses,formData.assetManager.value+'2')?emailStatuses[formData.assetManager.value+'2']:""}}
                  </div>
                </td>
              </tr>
              <tr class="">
                <td style="" class="text-start pt-0">
                    <TextInput
                        :id="formData.headOfAccountsName.id"
                        :label="formData.headOfAccountsName.label"
                        :tooltip="formData.headOfAccountsName.tooltip"
                        :errors="formData.headOfAccountsName.errors"
                        :required="true"
                        :is-disabled="isLoading || isFormSubmitting"
                        v-model="formData.headOfAccountsName.value"
                        classes="ps-0 bold-label pt-0"
                    />
                </td>
                <td style="" class="text-start">
                  <TextInput
                    :id="formData.headOfAccounts.id"
                    :label="formData.headOfAccounts.label"
                    :tooltip="formData.headOfAccounts.tooltip"
                    :errors="formData.headOfAccounts.errors"
                    :required="true"
                    :is-disabled="isLoading || isFormSubmitting"
                    v-model="formData.headOfAccounts.value"
                    classes="ps-0 bold-label pt-0"
                  />
                </td>
                <td class="text-start pe-0">
                  <div class="middle-td pt-2 fw-bolder justify-content-end">
                      {{Object.hasOwnProperty.call(emailStatuses,formData.headOfAccounts.value+'3')?emailStatuses[formData.headOfAccounts.value+'3']:""}}
                  </div>
                </td>
              </tr>
              <tr class="">
                <td style="" class="text-start pt-0">
                    <TextInput
                        :id="formData.storeManagersName.id"
                        :label="formData.storeManagersName.label"
                        :tooltip="formData.storeManagersName.tooltip"
                        :errors="formData.storeManagersName.errors"
                        :required="true"
                        :is-disabled="isLoading || isFormSubmitting"
                        v-model="formData.storeManagersName.value"
                        classes="ps-0 bold-label pt-0"
                    />
                </td>
                <td style="" class="text-start">
                  <TextInput
                    :id="formData.storeManager.id"
                    :label="formData.storeManager.label"
                    :tooltip="formData.storeManager.tooltip"
                    :errors="formData.storeManager.errors"
                    :required="true"
                    :is-disabled="isLoading || isFormSubmitting"
                    v-model="formData.storeManager.value"
                    classes="ps-0 bold-label pt-0"
                  />
                </td>
                <td class="text-start pe-0">
                  <div class="middle-td pt-2 fw-bolder justify-content-end">
                      {{Object.hasOwnProperty.call(emailStatuses,formData.storeManager.value+'4')?emailStatuses[formData.storeManager.value+'4']:""}}
                  </div>
                </td>
              </tr>
              <tr class="">
                <td style="" class="text-start pt-0">
                    <TextInput
                        :id="formData.companyStaffsName.id"
                        :label="formData.companyStaffsName.label"
                        :tooltip="formData.companyStaffsName.tooltip"
                        :errors="formData.companyStaffsName.errors"
                        :is-required="false"
                        :is-disabled="isLoading || isFormSubmitting"
                        v-model="formData.companyStaffsName.value"
                        classes="ps-0 bold-label pt-0"
                    />
                </td>
                <td style="" class="text-start">
                  <TextInput
                    :id="formData.companyStaff.id"
                    :label="formData.companyStaff.label"
                    :tooltip="formData.companyStaff.tooltip"
                    :errors="formData.companyStaff.errors"
                    :is-required="false"
                    :is-disabled="isLoading || isFormSubmitting"
                    v-model="formData.companyStaff.value"
                    classes="ps-0 bold-label pt-0"
                  />
                </td>
                <td class="text-start pe-0">
                  <div class="middle-td pt-2 fw-bolder justify-content-end">
                      {{Object.hasOwnProperty.call(emailStatuses,formData.companyStaff.value+'5')?emailStatuses[formData.companyStaff.value+'5']:""}}
                  </div>
                </td>
              </tr>
            </tbody>
          </MDBTable>
        </div>
      </div>
    </div>
  </form>
</template>

<script >
import TextInput from "@/components/inputs/TextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import CompanyUsersImage from "@/components/images/CompanyUsersImage.vue";
import KeyValueList from "@/components/lists/KeyValueList.vue";
import InlineButton from "@/components/inputs/InlineButton.vue";
import Button from "../inputs/Button.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

import { MDBTable } from "mdb-vue-ui-kit";

let getFormData = function () {
  return {
    assetManager: {
      id: "onbaording-users-assetmanager-input",
      label: "Email Address",
      tooltip: "Is responsible for managing all assets",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Email address is required",
        maxLength: {
          value: 60,
          error: "Cannot be more than 60 letters",
        },
        minLength: {
          value: 5,
          error: "Atleast 5 letters are required",
        },
        emailFormat: "Invalid email address",
      },
    },
    assetManagerName: {
      id: "onbaording-users-assetmangername-input",
      label: "Asset Manager's Name",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Name is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 letters"
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required"
        }
      }
    },
    headOfAccounts: {
      id: "onbaording-users-headofaccounts-input",
      label: "Email Address",
      tooltip: "Is responsible for accounting",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Email address is required",
        maxLength: {
          value: 60,
          error: "Cannot be more than 60 letters",
        },
        minLength: {
          value: 5,
          error: "Atleast 5 letters are required",
        },
        emailFormat: "Invalid email address",
      },
    },
    headOfAccountsName: {
      id: "onbaording-users-headofaccountsname-input",
      label: "Head Of Account's Name",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Name is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 letters"
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required"
        }
      }
    },
    storeManager: {
      id: "onbaording-users-storemanager-input",
      label: "Store Manager's Email",
      tooltip: "Is responsible for managing the store",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Email address is required",
        maxLength: {
          value: 60,
          error: "Cannot be more than 60 letters",
        },
        minLength: {
          value: 5,
          error: "Atleast 5 letters are required",
        },
        emailFormat: "Invalid email address",
      },
    },
    storeManagersName: {
      id: "onbaording-users-storemanagersname-input",
      label: "Store Manager's Name",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Name is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 letters"
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required"
        }
      }
    },
    companyStaff: {
      id: "onbaording-users-companystaff-input",
      label: "Email Address",
      tooltip: "A normal company employee that is not having the above roles",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 60,
          error: "Cannot be more than 60 letters",
        },
        emailFormat: {
          error: "Invalid email address",
          ignoreIfEmpty: true
        }
      },
    },
    companyStaffsName: {
      id: "onbaording-users-companystaffname-input",
      label: "Company Staff's Name",
      errors: [],
      value: "",
      isValid: null,
      validations: {
        required: "Name is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 letters"
        },
        minLength: {
          value: 3,
          error: "Atleast 3 letters are required"
        }
      }
    },
  };
};

export default {
  components: {
    FormErrors,
    TextInput,
    CompanyUsersImage,
    KeyValueList,
    InlineButton,
    Button,
    SelectInput,
    MDBTable,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    onNextClick: {
      type: Number,
      default: 0,
    },
    onSkipClick: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
        errors: [],
        formData: getFormData(),
        isFormSubmitting: false,
        basicInfo: [],
        users: [],
        emailStatuses: {}
    };
  },
  watch: {
    onNextClick(val) {
      this.onClickNextBtn();
    },
  },
  methods: {
    ...Vm.fetch,
    ...Vm.post,
    loadDependencies() {
      this.fetch("onBoardingUsersDependencies", function (vm, res) {
        var companyType = Utils.pick(
          res.companyTypes,
          "value",
          res.config.company_type
        );
        vm.basicInfo = [
          {
            key: "Company Name",
            value: res.config.company_name,
          },
          {
            key: "Country",
            value: res.config.country,
          },
          {
            key: "Currency",
            value: res.config.currency,
          },
          {
            key: "Company Type",
            value: companyType.label,
          },
        ];
        var emailStatus = {};
        var formData = {
            ...vm.formData
        }
        for (let index = 0; index < res.users.length; index++) {
            var user = res.users[index];
            var role_id = String(user.user_roles[0].role_id);
            emailStatus[user.email+role_id] = user.status;
            if(role_id == "2"){
                formData.assetManager.value = user.email;
                formData.assetManagerName.value = user.name;
            }else if(role_id == "3"){
                formData.headOfAccounts.value = user.email;
                formData.headOfAccountsName.value = user.name;
            }else if(role_id == "4"){
                formData.storeManager.value = user.email;
                formData.storeManagersName.value = user.name;
            }else if(role_id == "5"){
                formData.companyStaff.value = user.email;
                formData.companyStaffsName.value = user.name;
            }
        }
        vm.emailStatuses = emailStatus;
        vm.formData = formData;
      });
    },
    onClickNextBtn() {
        var vm = this;
        //nyd
        //remove all the previous invited users
        vm.post("saveOnBoardingStep3", "formData", function(vm, res){
            //go to the next step
            vm.formData = getFormData();
            vm.errors = []; 
            vm.$emit("on-proceed-to-next");
        });
    }
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>

