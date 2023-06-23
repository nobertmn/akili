<template>
  <div class="d-flex flex-column">
    <div class="xmx-2">
      <div
        class="alert alert-info text-start w-fit"
        role="alert"
        data-mdb-color="primary"
      >
        <b>*</b>
        <a href="" style="text-decoration: underline"
          ><b>Download the excell template</b></a
        >, watch this
        <a href="" style="text-decoration: underline"
          ><b>video to guide you</b></a
        >
        on how to use the template
      </div>
    </div>
    <div class="flex-grow-1">
      <div class="d-flex flex-column">
        <div class="d-flex flex-column mt-2">
          <vue-good-table
            :columns="columns"
            :rows="rows"
            max-height="300px"
            :fixed-header="false"
            :line-numbers="true"
            compactMode
          >
            <template #table-actions>
              <IconButton
                kind="btn-danger"
                classes="p-8px mr-4px"
                @click="onClickReset"
              >
                <i class="fas fa-circle-xmark"></i> Reset Upload Form
              </IconButton>
              <IconButton
                kind="btn-primary"
                classes="p-8px mr-4px"
                @click="onClickSelectExcellFile"
              >
                <i class="fas fa-file-excel"></i> Upload Excell
              </IconButton>
              <input
                type="file"
                ref="uploadFileRef"
                id="input"
                @change="onSelectExcellFile"
                style="width: 0px; height: 0px"
              />
              <IconButton
                kind="btn-primary"
                classes="p-8px mr-4px"
                @click="onClickSaveAssets"
                v-if="rows.length > 0"
              >
                <i class="fas fa-save"></i> Save Assets
              </IconButton>
            </template>
            <template #emptystate>
              {{
                isLoading
                  ? "Loading..."
                  : rows.length == 0
                  ? "There are no uploaded records"
                  : ""
              }}
            </template>
            <template #table-row="props">
              <div
                v-if="props.column.field == 'actions'"
                style="text-align: right"
              >
                <IconButton
                  kind="btn-warning"
                  classes="p-4px mr-4px"
                  @click="onClickEditUploadRow(props.row)"
                  v-if="props.formattedRow.upload_status == 'failed'"
                >
                  <i class="fas fa-edit"></i> Edit
                </IconButton>
              </div>
              <span v-if="props.column.field == 'upload_status'">
                <span
                  class="text-warning"
                  v-if="
                    props.formattedRow[props.column.field] == 'not yet saved'
                  "
                >
                  <b>{{ props.formattedRow[props.column.field] }}</b>
                </span>
                <span
                  class="text-danger"
                  v-else-if="props.formattedRow[props.column.field] == 'failed'"
                >
                  <b>{{ props.formattedRow[props.column.field] }}</b>
                </span>
                <span
                  class="text-primary"
                  v-else-if="
                    props.formattedRow[props.column.field] == 'uploading ...'
                  "
                >
                  <b>{{ props.formattedRow[props.column.field] }}</b>
                </span>
                <span
                  class="text-success"
                  v-else-if="
                    props.formattedRow[props.column.field] == 'success'
                  "
                >
                  <b>{{ props.formattedRow[props.column.field] }}</b>
                </span>
                <span
                  class="text-warning"
                  v-else-if="
                    props.formattedRow[props.column.field] == 'not yet cached'
                  "
                >
                  <b>{{ props.formattedRow[props.column.field] }}</b>
                </span>
                <span
                  class="text-primary"
                  v-else-if="
                    props.formattedRow[props.column.field] ==
                    'caching record ...'
                  "
                >
                  <b>{{ props.formattedRow[props.column.field] }}</b>
                </span>
              </span>
              <span v-else>
                {{ props.formattedRow[props.column.field] }}
              </span>
            </template>
          </vue-good-table>
        </div>
      </div>
    </div>
    <SimpleModal
      id="onboardingEditUploadRowModal"
      title="Edit Record From Excell"
      v-model="showModal"
      :show-close-btn="true"
      ok-btn-text="Update"
      @on-ok-btn-click="onClickSubmitUpdateUploadItemBtn"
      @on-close-btn-click="onClickCloseEditUploadBtn"
      :show-top-close-btn="false"
      size="xl"
    >
      <form novalidate class="d-flex flex-column">
        <FormErrors
          :errors="errors.length > 0 ? [errors.join(', ')] : []"
          classes="ps-0 pe-0"
        />

        <div class="d-flex flex-row">
          <TextInput
            :id="formData.name.id"
            :label="formData.name.label"
            :errors="formData.name.errors"
            :tooltip="formData.name.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.name.value"
            classes="ps-0"
          />

          <SelectInput
            :id="formData.categoryName.id"
            :label="formData.categoryName.label"
            :errors="formData.categoryName.errors"
            :tooltip="formData.categoryName.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.categoryName.value"
            :items="assetCategories"
          />

          <SelectInput
            :id="formData.branchName.id"
            :label="formData.branchName.label"
            :errors="formData.branchName.errors"
            :tooltip="formData.branchName.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.branchName.value"
            :items="companyBranches"
          />

          <TextInput
            :id="formData.currency.id"
            :label="formData.currency.label"
            :errors="formData.currency.errors"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.currency.value"
            classes="pe-0"
          />
        </div>

        <div class="d-flex flex-row">
          <SelectInput
            :id="formData.isShared.id"
            :label="formData.isShared.label"
            :errors="formData.isShared.errors"
            :tooltip="formData.isShared.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.isShared.value"
            :items="shareOptions"
            classes="ps-0"
          />

          <TextInput
            :id="formData.description.id"
            :label="formData.description.label"
            :errors="formData.description.errors"
            :tooltip="formData.description.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.description.value"
            :is-required="false"
          />

          <SelectInput
            :id="formData.siteName.id"
            :label="formData.siteName.label"
            :errors="formData.siteName.errors"
            :tooltip="formData.siteName.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.siteName.value"
            :items="companySites"
          />

          <SelectInput
            :id="formData.departmentName.id"
            :label="formData.departmentName.label"
            :errors="formData.departmentName.errors"
            :tooltip="formData.departmentName.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.departmentName.value"
            :items="companyDepartments"
            classes="pe-0"
          />
        </div>

        <div class="d-flex flex-row">
          <TextInput
            :id="formData.custodian.id"
            :label="formData.custodian.label"
            :errors="formData.custodian.errors"
            :tooltip="formData.custodian.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.custodian.value"
            classes="ps-0"
          />

          <TextInput
            :id="formData.custodianContact.id"
            :label="formData.custodianContact.label"
            :errors="formData.custodianContact.errors"
            :tooltip="formData.custodianContact.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.custodianContact.value"
          />

          <TextInput
            :id="formData.purchaseCost.id"
            :label="formData.purchaseCost.label"
            :errors="formData.purchaseCost.errors"
            :tooltip="formData.purchaseCost.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.purchaseCost.value"
          />

          <TextInput
            :id="formData.purchaseDate.id"
            :label="formData.purchaseDate.label"
            :errors="formData.purchaseDate.errors"
            :is-disabled="isLoading || isFormSubmitting"
            type="date"
            v-model="formData.purchaseDate.value"
            classes="pe-0"
          />
        </div>

        <div class="d-flex flex-row">
          <TextInput
            :id="formData.usefulYears.id"
            :label="formData.usefulYears.label"
            :errors="formData.usefulYears.errors"
            :tooltip="formData.usefulYears.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.usefulYears.value"
            classes="ps-0"
          />

          <SelectInput
            :id="formData.status.id"
            :label="formData.status.label"
            :errors="formData.status.errors"
            :tooltip="formData.status.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.status.value"
            :items="assetStatuses"
          />

          <TextInput
            :id="formData.extraField1.id"
            :label="formData.extraField1.label"
            :errors="formData.extraField1.errors"
            :tooltip="formData.extraField1.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.extraField1.value"
            :is-required="false"
          />

          <TextInput
            :id="formData.extraField2.id"
            :label="formData.extraField2.label"
            :errors="formData.extraField2.errors"
            :tooltip="formData.extraField2.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.extraField2.value"
            :is-required="false"
            classes="pe-0"
          />
        </div>

        <div class="d-flex flex-row">
          <TextInput
            :id="formData.extraField3.id"
            :label="formData.extraField3.label"
            :errors="formData.extraField3.errors"
            :tooltip="formData.extraField3.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.extraField3.value"
            :is-required="false"
            classes="ps-0"
          />

          <TextInput
            :id="formData.extraField4.id"
            :label="formData.extraField4.label"
            :errors="formData.extraField4.errors"
            :tooltip="formData.extraField4.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.extraField4.value"
            :is-required="false"
          />

          <TextInput
            :id="formData.extraField5.id"
            :label="formData.extraField5.label"
            :errors="formData.extraField5.errors"
            :tooltip="formData.extraField5.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.extraField5.value"
            :is-required="false"
          />

          <TextInput
            :id="formData.extraField6.id"
            :label="formData.extraField6.label"
            :errors="formData.extraField6.errors"
            :tooltip="formData.extraField6.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            :is-required="false"
            v-model="formData.extraField6.value"
            classes="pe-0"
          />
        </div>

        <div class="d-flex flex-row">
          <TextInput
            :id="formData.extraField7.id"
            :label="formData.extraField7.label"
            :errors="formData.extraField7.errors"
            :tooltip="formData.extraField7.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.extraField7.value"
            :is-required="false"
            classes="ps-0"
          />

          <TextInput
            :id="formData.extraField8.id"
            :label="formData.extraField8.label"
            :errors="formData.extraField8.errors"
            :tooltip="formData.extraField8.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.extraField8.value"
            :is-required="false"
          />

          <TextInput
            :id="formData.extraField9.id"
            :label="formData.extraField9.label"
            :errors="formData.extraField9.errors"
            :tooltip="formData.extraField9.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.extraField9.value"
            :is-required="false"
          />

          <TextInput
            :id="formData.extraField10.id"
            :label="formData.extraField10.label"
            :errors="formData.extraField10.errors"
            :tooltip="formData.extraField10.tooltip"
            :is-disabled="isLoading || isFormSubmitting"
            v-model="formData.extraField10.value"
            :is-required="false"
            classes="pe-0"
          />
        </div>
      </form>
      <template v-slot:leftfooter>
        <div class="upload-asset-footer-errors">
          {{ this.editItemUploadErrors }}
        </div>
      </template>
    </SimpleModal>
  </div>
</template>

<script >
import TextInput from "@/components/inputs/TextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import FormErrors from "@/components/forms/FormErrors.vue";
import CompanyUsersImage from "@/components/images/CompanyUsersImage.vue";
import KeyValueList from "@/components/lists/KeyValueList.vue";
import InlineButton from "@/components/inputs/InlineButton.vue";
import Button from "../inputs/Button.vue";
import IconButton from "../inputs/IconButton.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import Validator from "@/utils/Validator";
import SimpleModal from "@/components/modals/SimpleModal.vue";
import readXlsxFile from "read-excel-file";
import Data from "@/data/";

let getFormData = function (formDeps) {
  if (typeof formDeps == "undefined") {
    formDeps = {
      categoriesValues: [],
      branchesValues: [],
      sitesValues: [],
      departmentValues: [],
      statusValues: [],
    };
  }
  return {
    name: {
      id: "onbaording-asset-name-input",
      label: "Asset Name",
      tooltip: "The name of the asset",
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
    categoryName: {
      id: "onbaording-asset-category-name-input",
      label: "Category",
      tooltip: "The name of the category of the asset",
      value: "",
      isValid: null,
      validations: {
        required: "Catgeory name is required",
        maxLength: {
          value: 200,
          error: "Cannot be more than 200 letters",
        },
        minLength: {
          value: 2,
          error: "Atleast 2 letters are required",
        },
        inList: {
          value: formDeps.categoriesValues,
          error: "Invalid category",
        },
      },
      ref: "category_name",
    },
    branchName: {
      id: "onbaording-asset-branch-name-input",
      label: "Company Branch",
      tooltip:
        "Specify the branch of the company that currently utilizes this asset",
      value: "",
      isValid: null,
      validations: {
        required: "Branch name is required",
        maxLength: {
          value: 200,
          error: "Cannot be more than 200 letters",
        },
        minLength: {
          value: 2,
          error: "Atleast 2 letters are required",
        },
        inList: {
          value: formDeps.branchesValues,
          error: "Invalid branch",
        },
      },
      ref: "branch_name",
    },
    currency: {
      id: "onbaording-asset-currency-input",
      label: "Currency",
      tooltip: "What currency is this asset tracked?",
      value: "",
      isValid: null,
      validations: {
        required: "Currency is required",
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 letters",
        },
        minLength: {
          value: 2,
          error: "Atleast 2 letters are required",
        },
      },
      ref: "currency_name",
    },
    isShared: {
      id: "onbaording-asset-isshared-input",
      label: "Is a Shared Assset ?",
      tooltip: "Is this a shared asset",
      value: "",
      isValid: null,
      validations: {
        required: "Required",
      },
      ref: "is_shared",
    },
    description: {
      id: "onbaording-asset-description-input",
      label: "Description",
      tooltip: "provide a description for the asset",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 200,
          error: "Cannot be more than 200 letters",
        },
      },
    },
    siteName: {
      id: "onbaording-asset-site-input",
      label: "Company Site",
      tooltip: "Specify the company site where the asset is in use or storage",
      value: "",
      isValid: null,
      validations: {
        required: "Site's name is required",
        maxLength: {
          value: 200,
          error: "Cannot be more than 200 letters",
        },
        minLength: {
          value: 2,
          error: "Atleast 2 letters are required",
        },
        inList: {
          value: formDeps.sitesValues,
          error: "Invalid site",
        },
      },
      ref: "site_name",
    },
    departmentName: {
      id: "onbaording-asset-department-input",
      label: "Company Department",
      tooltip: "Specify the department in use or storage",
      value: "",
      isValid: null,
      validations: {
        required: "Department is required",
        maxLength: {
          value: 200,
          error: "Cannot be more than 200 letters",
        },
        minLength: {
          value: 2,
          error: "Atleast 2 letters are required",
        },
        inList: {
          value: formDeps.departmentValues,
          error: "Invalid department",
        },
      },
      ref: "department_name",
    },
    status: {
      id: "onbaording-asset-status-input",
      label: "Asset Status",
      tooltip: "In what state is the asset",
      value: "",
      isValid: null,
      validations: {
        required: "Status is required",
        maxLength: {
          value: 200,
          error: "Cannot be more than 200 letters",
        },
        minLength: {
          value: 2,
          error: "Atleast 2 letters are required",
        },
        inList: {
          value: formDeps.statusValues,
          error: "Invalid status",
        },
      },
    },
    custodian: {
      id: "onbaording-asset-custodian-input",
      label: "Custodian Name",
      tooltip: "The first and last name of the person inpossation of the asset",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 200,
          error: "Cannot be more than 200 letters",
        },
      },
      ref: "custodian_name",
    },
    custodianContact: {
      id: "onbaording-asset-custodian-contact-input",
      label: "Custodian Contact",
      tooltip: "The the contact of the person with the asset",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 200,
          error: "Cannot be more than 200 letters",
        },
      },
      ref: "custodian_contact",
    },
    purchaseCost: {
      id: "onbaording-asset-purchase-cost-input",
      label: "Purchase Cost",
      tooltip: "How much did the asset cost",
      value: "",
      isValid: null,
      validations: {
        required: "Purchase amount is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        },
        digitsOnly: "Only digits 0-9 are allowed",
      },
      ref: "purchase_cost",
    },
    purchaseDate: {
      id: "onbaording-asset-purchase-date-input",
      label: "Purchase Date",
      tooltip: "When was this asset bought",
      value: "",
      isValid: null,
      validations: {
        required: "Purchase date is required",
        maxLength: {
          value: 30,
          error: "Cannot be more than 30 digits",
        },
      },
      ref: "date_purchased",
    },
    condition: {
      id: "onbaording-asset-condition-input",
      label: "Condition",
      tooltip: "In what condition is the asset",
      value: "",
      isValid: null,
      validations: {
        required: "Condition is required",
        maxLength: {
          value: 20,
          error: "Cannot be more than 20 digits",
        },
      },
    },
    extraField1: {
      id: "onbaording-extra-field1-input",
      label: "Extra Field 1",
      tooltip:
        "The first extra field, use the format [Field Name]:[Field Value], dont include the brackets",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 letters",
        },
        extraField: "Invalid extra field format",
      },
      ref: "extra_field_1",
    },
    extraField2: {
      id: "onbaording-extra-field2-input",
      label: "Extra Field 2",
      tooltip:
        "The  second extra field, use the format [Field Name]:[Field Value], dont include the brackets",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 letters",
        },
        extraField: "Invalid extra field format",
      },
      ref: "extra_field_2",
    },
    extraField3: {
      id: "onbaording-extra-field3-input",
      label: "Extra Field 3",
      tooltip:
        "The third extra field, use the format [Field Name]:[Field Value], dont include the brackets",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 letters",
        },
        extraField: "Invalid extra field format",
      },
      ref: "extra_field_3",
    },
    extraField4: {
      id: "onbaording-extra-field4-input",
      label: "Extra Field 4",
      tooltip:
        "The fourth extra field, use the format [Field Name]:[Field Value], dont include the brackets",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 letters",
        },
        extraField: "Invalid extra field format",
      },
      ref: "extra_field_4",
    },
    extraField5: {
      id: "onbaording-extra-field5-input",
      label: "Extra Field 5",
      tooltip:
        "The fifth extra field, use the format [Field Name]:[Field Value], dont include the brackets",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 letters",
        },
        extraField: "Invalid extra field format",
      },
      ref: "extra_field_5",
    },
    extraField6: {
      id: "onbaording-extra-field6-input",
      label: "Extra Field 6",
      tooltip:
        "The sixth extra field, use the format [Field Name]:[Field Value], dont include the brackets",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 letters",
        },
        extraField: "Invalid extra field format",
      },
      ref: "extra_field_6",
    },
    extraField7: {
      id: "onbaording-extra-field7-input",
      label: "Extra Field 7",
      tooltip:
        "The seventh extra field, use the format [Field Name]:[Field Value], dont include the brackets",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 letters",
        },
        extraField: "Invalid extra field format",
      },
      ref: "extra_field_7",
    },
    extraField8: {
      id: "onbaording-extra-field8-input",
      label: "Extra Field 8",
      tooltip:
        "The eigth extra field, use the format [Field Name]:[Field Value], dont include the brackets",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 letters",
        },
        extraField: "Invalid extra field format",
      },
      ref: "extra_field_8",
    },
    extraField9: {
      id: "onbaording-extra-field9-input",
      label: "Extra Field 9",
      tooltip:
        "The ninth extra field, use the format [Field Name]:[Field Value], dont include the brackets",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 letters",
        },
        extraField: "Invalid extra field format",
      },
      ref: "extra_field_9",
    },
    extraField10: {
      id: "onbaording-extra-field10-input",
      label: "Extra Field 10",
      tooltip:
        "The tenth extra field, use the format [Field Name]:[Field Value], dont include the brackets",
      value: "",
      isValid: null,
      validations: {
        maxLength: {
          value: 100,
          error: "Cannot be more than 100 letters",
        },
        extraField: "Invalid extra field format",
      },
      ref: "extra_field_10",
    },
    identifier: {
      id: "onbaording-identifier-input",
      label: "Identifier",
      tooltip: "The unique identifier number/label for the asset",
      value: "",
      isValid: null,
      validations: {
        //nyd
        //for now there are no validations
      },
    },
    rowId: {
      id: "onbaording-id-input",
      label: "Id",
      tooltip:
        "The assigned id from the process of reading the record from the excell document",
      value: "",
      isValid: null,
      validations: {
        //nyd
        //for now there are no validations
      },
      ref: "id",
    },
    usefulYears: {
      id: "onbaording-useful-years-input",
      label: "Useful Years",
      tooltip: "The useful years of the asset",
      value: "",
      isValid: null,
      validations: {
        required: "Useful years is required",
        maxLength: {
          value: 4,
          error: "Cannot be more than 4 digits",
        },
        digitsOnly: "Only digits 0-9 are allowed",
      },
      ref: "useful_years",
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
    IconButton,
    SelectInput,
    SimpleModal,
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
    onFinishClick: {
      type: Number,
      default: 0,
    },
    isInRegistry: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      errors: [],
      formData: getFormData(),
      showModal: false,
      isFormSubmitting: false,
      columns: [
        {
          field: "upload_status",
          label: "UPLOAD STATUS",
        },
        {
          field: "identifier",
          label: "UNIQUE IDENTIFIER",
        },
        {
          field: "name",
          label: "NAME",
        },
        {
          field: "category_name",
          label: "CATEGORY",
        },
        {
          field: "upload_remarks",
          label: "REMARKS",
        },
        {
          label: "",
          field: "actions",
        },
      ],
      rows: [],
      formMode: "add",
      categories: [],
      uploadIndex: 0,
      previousUploadAsset: null,
      newUploadAssetId: 0,
      cacheIndex: 0,
      itemToEdit: null,
      assetUploadConditions: Data.conditions,
      assetCategories: [],
      companyBranches: [],
      companySites: [],
      shareOptions: [
        {
          value: "yes",
          label: "Yes",
        },
        {
          value: "no",
          label: "No",
        },
      ],
      companyDepartments: Utils.toValueLabelList(
        Data.departments,
        "name",
        "name"
      ),
      assetStatuses: Utils.toValueLabelList(Data.assetStatuses, "name", "name"),
      indexedCategories: {},
      indexedCompanyBranches: {},
      indexedSharedOptions: {},
      indexedCompanySites: {},
      indexedDepartments: Utils.index(Data.departments, "name"),
      indexedAssetStatuses: Utils.index(Data.assetStatuses, "name"),
      editItemUploadErrors: "",
    };
  },
  watch: {
    onNextClick(val) {
      this.onClickNextBtn();
    },
    onSkipClick(val) {
      this.onClickSkipBtn();
    },
    onFinishClick(val) {
      this.onClickFinishBtn();
    },
  },
  methods: {
    ...Vm.fetch,
    ...Vm.post,
    ...Vm.update,
    ...Vm.delete,
    ...Vm.queryPost,
    loadDependencies() {
      this.fetch("onBoardingAssetsDependencies", function (vm, res) {
        vm.indexedCategories = Utils.index(res.categories, "name");
        vm.categories = res.categories;
        vm.assetCategories = Utils.toValueLabelList(
          res.categories,
          "name",
          "name"
        );
        vm.companyBranches = Utils.toValueLabelList(
          res.branches,
          "name",
          "name"
        );
        vm.indexedCompanyBranches = Utils.index(res.branches, "name");
        vm.companySites = Utils.toValueLabelList(res.sites, "name", "name");
        vm.indexedCompanySites = Utils.index(res.sites, "name");
        vm.indexedSharedOptions = Utils.index(vm.shareOptions, "value");
        vm.previousUploadAsset = res.upload_assets;
        if (res.upload_assets !== null) {
          //fill in staff
          var fileName = vm.previousUploadAsset.file_name;
          var tableData = [];
          for (
            var index = 0;
            index < vm.previousUploadAsset.upload_asset_items.length;
            index++
          ) {
            var row = vm.previousUploadAsset.upload_asset_items[index];
            tableData.push({
              id: parseInt(row.id),
              table_id: parseInt(row.table_id),
              source: row.source,
              identifier: row.identifier,
              name: row.name,
              category_name: row.category_name,
              upload_status: row.upload_status,
              upload_remarks: row.upload_remarks,
              has_errors: row.has_errors,
              excell_row_object: JSON.parse(row.excell_row_object),
            });
          }
          vm.rows = tableData;
          vm.newUploadAssetId = parseInt(vm.previousUploadAsset.id);
          vm.cacheIndex = 0;
        }
        vm.formDeps = {
          categoriesValues: Utils.extractValuesList(vm.assetCategories),
          branchesValues: Utils.extractValuesList(vm.companyBranches),
          sitesValues: Utils.extractValuesList(vm.companySites),
          departmentValues: Utils.extractValuesList(vm.companyDepartments),
          statusValues: Utils.extractValuesList(vm.assetStatuses),
        };
        vm.formData = getFormData(vm.formDeps);
        vm.showFinishButton();
      });
    },
    onClickCloseEditUploadBtn() {
      this.onClickCancelEditUploadItem();
    },
    extractExcellRowObjectFromFormData(formData) {
      var excell_row_object = {
        id: formData.rowId.value,
        name: formData.name.value,
        category_name: formData.categoryName.value,
        branch_name: formData.branchName.value,
        currency_name: formData.currency.value,
        is_shared: formData.isShared.value,
        description: formData.description.value,
        site_name: formData.siteName.value,
        department_name: formData.departmentName.value,
        status: formData.status.value,
        custodian_name: formData.custodian.value,
        custodian_contact: formData.custodianContact.value,
        purchase_cost: formData.purchaseCost.value,
        useful_years: formData.usefulYears.value,
        date_purchased: formData.purchaseDate.value,
        condition: formData.condition.value,
        extra_field_1: formData.extraField1.value,
        extra_field_2: formData.extraField2.value,
        extra_field_3: formData.extraField3.value,
        extra_field_4: formData.extraField4.value,
        extra_field_5: formData.extraField5.value,
        extra_field_6: formData.extraField6.value,
        extra_field_7: formData.extraField7.value,
        extra_field_8: formData.extraField8.value,
        extra_field_9: formData.extraField9.value,
        extra_field_10: formData.extraField10.value,
      };
      return excell_row_object;
    },
    extractAssetUploadFormData(xcellAsset) {
      var vm = this;
      var errors = [];
      //category
      var categoryId = 0;
      var usefulYears = 0;
      var itemCatName = xcellAsset.category_name.trim().toLowerCase();
      if (Object.hasOwnProperty.call(vm.indexedCategories, itemCatName)) {
        var category = vm.indexedCategories[itemCatName];
        categoryId = parseInt(category.id);
        usefulYears = parseInt(category.useful_years);
      } else {
        //error unknown category name
        errors.push("Unknown category name: " + xcellAsset.category_name);
      }

      //branch
      var branchId = 0;
      var itemBranchName = xcellAsset.branch_name.trim().toLowerCase();
      if (
        Object.hasOwnProperty.call(vm.indexedCompanyBranches, itemBranchName)
      ) {
        var branch = vm.indexedCompanyBranches[itemBranchName];
        branchId = parseInt(branch.id);
      } else {
        //error unknown branch name
        errors.push("Invalid company branch: " + xcellAsset.branch_name);
      }

      //is shared asset, has to be either yes or no
      var isShared = xcellAsset.is_shared.trim().toLowerCase();
      if (
        Object.hasOwnProperty.call(vm.indexedSharedOptions, isShared) == false
      ) {
        //error unknown is shared value
        errors.push("Is shared must be yes or no");
      }

      //site
      var siteId = 0;
      var itemSiteName = xcellAsset.site_name.trim().toLowerCase();
      if (Object.hasOwnProperty.call(vm.indexedCompanySites, itemSiteName)) {
        var site = vm.indexedCompanySites[itemSiteName];
        siteId = parseInt(site.id);
      } else {
        //error unknown site name
        errors.push("Invalid company site: " + xcellAsset.site_name);
      }

      //departments
      var departmentId = 0;
      var itemDepartmentName = xcellAsset.department_name.trim().toLowerCase();
      if (
        Object.hasOwnProperty.call(vm.indexedDepartments, itemDepartmentName)
      ) {
        var department = vm.indexedDepartments[itemDepartmentName];
        departmentId = parseInt(department.id);
      } else {
        //error unknown site name
        errors.push("Invalid department: " + xcellAsset.department_name);
      }

      //custodian name
      var itemCustodianName = xcellAsset.custodian_name.trim();
      if (itemCustodianName.length > 30) {
        errors.push("Custodian name cannot be more than 30 letters");
      }

      //custodian contact
      var itemCustodianContact = xcellAsset.custodian_contact.trim();
      if (itemCustodianContact.length > 30) {
        errors.push("Custodian contact cannot be more than 30 letters");
      }

      //purchase cost
      var itemPurchaseCost = xcellAsset.purchase_cost.toString().trim();
      if (itemPurchaseCost.length > 12) {
        errors.push("Purchase cost cannot be more than 12 digits");
      } else if (itemPurchaseCost.length > 0) {
        if (/^\d+$/.test(itemPurchaseCost) !== true) {
          errors.push("Purchase cost has to be digits only");
        } else {
          itemPurchaseCost = parseFloat(itemPurchaseCost);
        }
      }

      //purchase date
      var itemDatePurchased = xcellAsset.date_purchased.trim();
      if (itemDatePurchased.length > 12) {
        errors.push("Purchase date cannot be more than 12 digits");
      } else if (itemDatePurchased.length > 0) {
        var errx = "Invalid date of purchase: " + itemDatePurchased;
        var valRes = Validator.standardDateFormatStr(
          itemDatePurchased,
          errx,
          {}
        );
        if (valRes !== true) {
          errors.push(valRes);
        }
      }

      //item status
      var itemStatus = xcellAsset.status.trim().toLowerCase();
      if (
        Object.hasOwnProperty.call(vm.indexedAssetStatuses, itemStatus) == false
      ) {
        errors.push("Invalid status: " + xcellAsset.status);
      }

      //extra fields
      errors = vm.validateExtraField(xcellAsset.extra_field_1, errors);
      errors = vm.validateExtraField(xcellAsset.extra_field_2, errors);
      errors = vm.validateExtraField(xcellAsset.extra_field_3, errors);
      errors = vm.validateExtraField(xcellAsset.extra_field_4, errors);
      errors = vm.validateExtraField(xcellAsset.extra_field_5, errors);
      errors = vm.validateExtraField(xcellAsset.extra_field_6, errors);
      errors = vm.validateExtraField(xcellAsset.extra_field_7, errors);
      errors = vm.validateExtraField(xcellAsset.extra_field_8, errors);
      errors = vm.validateExtraField(xcellAsset.extra_field_9, errors);
      errors = vm.validateExtraField(xcellAsset.extra_field_10, errors);

      var formData = null;
      var extraFields = [];
      var extraFields = [];
      var assetExtraFields = [];
      var allocation = null;
      var custodian = null;
      if (errors.length == 0) {
        formData = {
          categoryId: {
            value: categoryId,
            isValid: null,
            validations: {},
          },
          identifier: {
            value: xcellAsset.identifier,
            isValid: null,
            validations: {},
          },
          name: {
            value: xcellAsset.name,
            isValid: null,
            validations: {},
          },
          isShared: {
            value: xcellAsset.is_shared,
            isValid: null,
            validations: {},
          },
          purchasedDate: {
            value: xcellAsset.date_purchased,
            isValid: null,
            validations: {},
          },
          purchaseCost: {
            value: xcellAsset.purchase_cost,
            isValid: null,
            validations: {},
          },
          usefulYears: {
            value: usefulYears,
            isValid: null,
            validations: {},
          },
          description: {
            value: xcellAsset.description,
            isValid: null,
            validations: {},
          },
          condition: {
            value: xcellAsset.condition,
            isValid: null,
            validations: {},
          },
          status: {
            value: xcellAsset.status,
            isValid: null,
            validations: {},
          },
        };

        for (let num = 1; num <= 10; num++) {
          let ef = vm.getExtraField(xcellAsset["extra_field_" + num]);
          if (ef.name.length > 0 && ef.value.length > 0) {
            extraFields.push({
              name: ef.name,
              type: "",
            });
            assetExtraFields.push({
              extra_field_index: extraFields.length - 1,
              value: ef.value,
            });
          }
        }

        allocation = {
          branch_id: branchId,
          site_id: siteId,
          department_id: departmentId,
          custodian_id: 0,
          allocation_condition: xcellAsset.condition,
          status: "allocated"
        };

        custodian = {
          name: itemCustodianName,
          contact: itemCustodianContact,
        };
      }

      return {
        errors: errors,
        formData: formData,
        extraFields: extraFields,
        assetExtraFields: assetExtraFields,
        allocation: allocation,
        custodian: custodian,
      };
    },
    onClickSubmitUpdateUploadItemBtn() {
      var vm = this;
      var xcellAsset = Utils.formDataToObject(vm.formData);
      var assetForm = vm.extractAssetUploadFormData(xcellAsset);
      if (assetForm.errors.length == 0) {
        vm.errors = [];
        vm.formData["newAsset"] = {
          value: {
            asset: assetForm.formData,
            extraFields: assetForm.extraFields,
            assetExtraFields: assetForm.assetExtraFields,
            allocation: assetForm.allocation,
            custodian: assetForm.custodian,
          },
          isValid: null,
          validations: {},
        };
        vm.update(
          "onBoardingUpdateCachedFailedItem",
          "formData",
          this.itemToEdit.id,
          function (vm, res) {
            console.log("but the vm ", vm);
            console.log("Here we come ", res);
            vm.onClickCancelEditUploadItem();
            vm.loadDependencies();
          },
          function (vm, errors) {
            vm.errors = errors;
          }
        );
      } else {
        vm.errors = assetForm.errors;
      }
    },
    onClickNextBtn() {
      this.queryPost(
        "saveOnBoardingStep4",
        {},
        function (vm) {
          //go to the next step
          vm.formData = getFormData(vm.formDeps);
          vm.errors = []; //nyd apply these two lines to other pages that use Vm.js
          vm.$emit("on-proceed-to-next");
        },
        function (vm, validatedFormData) {
          //this is just a dummy function, we dont have anything to do at this moment
        }
      );
    },
    onClickCancelEditUploadItem() {
      this.showModal = false;
      this.formData = getFormData(this.formDeps);
      this.errors = [];
    },
    onClickEditUploadRow(uploadRow) {
      var itemToEdit = { ...uploadRow };
      this.formData = getFormData(this.formDeps);
      var extraFieldNames = [];
      for (let index = 0; index < 10; index++) {
        extraFieldNames.push("extra_field_" + (index + 1));
      }
      this.formData = Utils.fillValues(
        this.formData,
        itemToEdit.excell_row_object,
        function (name, value, item) {
          if (extraFieldNames.indexOf(name) >= 0 && typeof value == "object") {
            return value.name.length > 0 ? value.name + ":" + value.value : "";
          } else {
            return value;
          }
        }
      );
      this.itemToEdit = itemToEdit;
      this.editItemUploadErrors = itemToEdit.has_errors;
      this.showModal = true;
    },
    onClickDeleteAccount(account) {
      var vm = this;
      vm.delete("onBoardingDeleteAccount", account, function (vm, res) {
        vm.onClickCancelEditAccount();
        vm.loadDependencies();
      });
    },
    onClickSkipBtn() {
      this.onClickNextBtn();
    },
    onClickSelectExcellFile(e) {
      e.preventDefault();
      this.$refs.uploadFileRef.click();
    },
    getExtraField: function (encodedValue) {
      if (encodedValue == null || typeof encodedValue == "undefined") {
        return {
          name: "",
          data_type: "",
          value: "",
          units: "",
        };
      } else {
        var parts = encodedValue.split(":");
        var name = "";
        var value = "";
        if (parts.length > 1) {
          name = parts[0].trim();
          value = parts[1].trim();
        } else {
          value = parts[0].trim();
        }
        return {
          name: name,
          data_type: "",
          value: value,
          units: "",
        };
      }
    },
    onSelectExcellFile(e) {
      var vm = this;
      e.preventDefault();
      var fileInput = e.target;
      var fileName = fileInput.files[0].name;
      readXlsxFile(fileInput.files[0]).then((rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.
        var getExtraField = vm.getExtraField;

        var tableData = [];
        //rows 0 and 1 are header rows, so we skip them
        for (var index = 0; index < rows.length; index++) {
          const row = rows[index];
          if (index >= 2) {
            var name = row[0];
            var category_name = row[1];
            var branch_name = row[2];
            //nyd
            //please remove the currency from the excell sheet
            var currency_name = row[3];
            var is_shared = row[4];
            var description = row[5];
            var site_name = row[6];
            //nyd
            //provide a list of standard company departments
            var department_name = row[7];
            var status = row[8];
            var custodian_name = row[9];
            var custodian_contact = row[10];
            var purchase_cost = row[11];
            //nyd
            //please remove useful years from the excell template
            var useful_years = row[12];
            var date_purchased_temp = row[13];
            var date_purchased =
              Utils.dateToStandardDateString(date_purchased_temp);
            //nyd
            //please provide a list of known conditions
            var condition = row[14];
            //10 extra fields
            //these must match the asset catgeory extra fields

            var extra_field_1 =
              row.length > 15 ? getExtraField(row[15]) : getExtraField();
            var extra_field_2 =
              row.length > 16 ? getExtraField(row[16]) : getExtraField();
            var extra_field_3 =
              row.length > 17 ? getExtraField(row[17]) : getExtraField();
            var extra_field_4 =
              row.length > 18 ? getExtraField(row[18]) : getExtraField();
            var extra_field_5 =
              row.length > 19 ? getExtraField(row[19]) : getExtraField();
            var extra_field_6 =
              row.length > 20 ? getExtraField(row[20]) : getExtraField();
            var extra_field_7 =
              row.length > 21 ? getExtraField(row[21]) : getExtraField();
            var extra_field_8 =
              row.length > 22 ? getExtraField(row[22]) : getExtraField();
            var extra_field_9 =
              row.length > 23 ? getExtraField(row[23]) : getExtraField();
            var extra_field_10 =
              row.length > 24 ? getExtraField(row[24]) : getExtraField();

            tableData.push({
              id: index,
              source: "excell",
              identifier: "",
              name: name,
              category_name: category_name,
              upload_status: "not yet cached",
              upload_remarks: "",
              has_errors: "",
              excell_row_object: {
                id: index,
                name: name,
                category_name: category_name,
                branch_name: branch_name,
                currency_name: currency_name,
                is_shared: is_shared,
                description: description,
                site_name: site_name,
                department_name: department_name,
                status: status,
                custodian_name: custodian_name,
                custodian_contact: custodian_contact,
                purchase_cost: purchase_cost,
                useful_years: useful_years,
                date_purchased: date_purchased,
                condition: condition,
                extra_field_1: extra_field_1,
                extra_field_2: extra_field_2,
                extra_field_3: extra_field_3,
                extra_field_4: extra_field_4,
                extra_field_5: extra_field_5,
                extra_field_6: extra_field_6,
                extra_field_7: extra_field_7,
                extra_field_8: extra_field_8,
                extra_field_9: extra_field_9,
                extra_field_10: extra_field_10,
              },
            });
          }
        }

        vm.rows = tableData;
        //cache/save items to the db
        var formData = {
          fileName: {
            value: fileName,
            isValid: null,
            validations: {},
          },
          totalRows: {
            value: tableData.length,
            isValid: null,
            validations: {},
          },
        };
        vm.queryPost(
          "saveUploadAsset",
          formData,
          function (vm, res) {
            vm.newUploadAssetId = res.upload_asset;
            vm.cacheIndex = 0;
            vm.cacheNextFileRecord();
          },
          function (vm, validatedFormData) {
            console.log("errors");
          }
        );
      });
    },
    onClickSaveAssets(e) {
      e.preventDefault();
      var vm = this;
      if (vm.formMode != "uploading") {
        vm.formMode = "uploading";
        vm.uploadIndex = 0;
        vm.uploadNextItem();
      }
    },
    uploadNextItem() {
      var vm = this;
      if (vm.uploadIndex < vm.rows.length) {
        vm.rows[vm.uploadIndex].upload_status = "uploading ...";
        setTimeout(function () {
          vm.uploadItemToServer();
        }, 1000);
      } else {
        vm.formMode = "add";
        vm.uploadIndex = 0;
        vm.loadDependencies();
      }
    },
    cacheNextFileRecord() {
      var vm = this;
      if (vm.cacheIndex < vm.rows.length) {
        //only cache those items that are not yet cached
        if (vm.rows[vm.cacheIndex].upload_status == "not yet cached") {
          vm.rows[vm.cacheIndex].upload_status = "caching record ...";
          setTimeout(function () {
            //cache this item
            vm.catchItemToServer();
          }, 1000);
        } else {
          vm.cacheIndex += 1;
          vm.cacheNextFileRecord();
        }
      } else {
        //finished caching item
        //update upload asset
        //nyd: show dialogue
        vm.formMode = "add";
        vm.cacheIndex = 0;
        location.reload(); //lets reload the page
      }
    },
    catchItemToServer() {
      var vm = this;
      var item = vm.rows[vm.cacheIndex];
      var formData = {
        uploadAssetId: {
          value: vm.newUploadAssetId,
          isValid: null,
          validations: {},
        },
        tableId: {
          value: vm.cacheIndex,
          isValid: null,
          validations: {},
        },
        source: {
          value: "excell",
          isValid: null,
          validations: {},
        },
        identifier: {
          value: item.identifier,
          isValid: null,
          validations: {},
        },
        name: {
          value: item.name,
          isValid: null,
          validations: {},
        },
        categoryName: {
          value: item.category_name,
          isValid: null,
          validations: {},
        },
        uploadStatus: {
          value: "not yet saved",
          isValid: null,
          validations: {},
        },
        uploadRemarks: {
          value: item.upload_remarks,
          isValid: null,
          validations: {},
        },
        hasErrors: {
          value: "",
          isValid: null,
          validations: {},
        },
        excellRowObject: {
          value: JSON.stringify(item.excell_row_object),
          isValid: null,
          validations: {},
        },
      };
      vm.queryPost(
        "saveCacheItemAsset",
        formData,
        function (vm, res) {
          //cache the next item
          vm.rows[vm.cacheIndex].upload_status = "not yet saved";
          vm.cacheIndex += 1;
          vm.cacheNextFileRecord();
        },
        function (vm, validatedFormData) {
          //console.log("errors");
        }
      );
    },
    validateExtraField(value, errors) {
      if (typeof value == "object") {
        value = `${value.name.trim()}:${value.value.trim()}`;
      } else {
        value = value.trim();
      }
      if (value.length == 0) {
        return errors;
      }
      var parts = value.split(":");
      if (value.indexOf("[") == 0 || value.indexOf("]") == value.length - 1) {
        errors.push("Invalid extra field entry format for " + value);
      } else if (parts.length != 2 && value.length > 0) {
        errors.push("Invalid extra field entry format for " + value);
      }
      return errors;
    },
    uploadItemToServer() {
      var vm = this;
      var item = vm.rows[vm.uploadIndex];
      var xcellAsset = item.excell_row_object;
      if (typeof item.excellRowObject == "string") {
        xcellAsset = JSON.parse(item.excellRowObject);
      }
      var temp = vm.extractAssetUploadFormData(xcellAsset);
      var errors = temp.errors;

      if (errors.length == 0) {
        var formData = temp.formData;
        formData["others"] = {
          value: {
            extraFields: temp.extraFields,
            assetExtraFields: temp.assetExtraFields,
            allocation: temp.allocation,
            custodian: temp.custodian,
          },
          isValid: null,
          validations: {},
        };
        vm.queryPost(
          "saveUploadedAssetItem",
          formData,
          function (vm, res) {
            vm.rows[vm.uploadIndex].upload_status = "success";
            vm.uploadIndex += 1;
            vm.uploadNextItem();
          },
          function (vm, validatedFormData) {
            //console.log("errors");
          }
        );
      } else {
        vm.rows[vm.uploadIndex].upload_status = "failed";
        vm.rows[vm.uploadIndex].upload_remarks = `Has ${errors.length} error${
          errors.length > 1 ? "s" : ""
        }`;
        vm.rows[vm.uploadIndex].has_errors = errors.join(", ");
        vm.updateCatchedItemToServer(vm.uploadIndex, function (vmx, res) {
          vm.uploadIndex += 1;
          vm.uploadNextItem();
        });
      }
    },
    updateCatchedItemToServer(index, successCallback) {
      var vm = this;
      var item = vm.rows[index];
      var formData = {
        identifier: {
          value: item.identifier,
          isValid: null,
          validations: {},
        },
        name: {
          value: item.name,
          isValid: null,
          validations: {},
        },
        categoryName: {
          value: item.category_name,
          isValid: null,
          validations: {},
        },
        uploadStatus: {
          value: item.upload_status,
          isValid: null,
          validations: {},
        },
        uploadRemarks: {
          value: item.upload_remarks,
          isValid: null,
          validations: {},
        },
        hasErrors: {
          value: item.has_errors,
          isValid: null,
          validations: {},
        },
        excellRowObject: {
          value: JSON.stringify(item.excell_row_object),
          isValid: null,
          validations: {},
        },
      };
      vm.update(
        "updateCacheItemAsset",
        formData,
        item.id,
        function (vm, res) {
          successCallback(vm, res);
        },
        function (vm, validatedFormData) {
          //console.log("errors");
        }
      );
    },
    showFinishButton() {
      if (this.isInRegistry == false) {
        let isEnabled = true;
        for (let index = 0; index < this.rows.length; index++) {
          const row = this.rows[index];
          if (row.upload_status != "success") {
            isEnabled = false;
            break;
          }
        }
        if (isEnabled == true) {
          console.log("ace 1");
          this.$emit("on-enable-finish-button");
        } else {
          console.log("ace 2");
          this.$emit("on-disable-finish-button");
        }
      }
    },
    onClickFinishBtn() {
      var vm = this;
      vm.errorMessage = "";
      var formData = {};
      this.queryPost(
        "saveOnBoardingStep6",
        formData,
        function (vm) {
          //go to the dashboard
          vm.formData = getFormData();
          vm.errorMessage = "";
          vm.$router.push("/dashboard");
        },
        function (vm, validatedFormData) {}
      );
    },
    onClickReset() {
      var vm = this;
      vm.delete("clearAssetBatchUpload", {}, function (vm, res) {
        location.reload(); //lets reload the page
      });
    },
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>

