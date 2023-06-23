<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1 bg-light">
    <div class="w-75 bg-white" style="padding: 0px 5px; height:620px; overflow-y: auto;">
      <div class="d-flex justify-content-center align-items-center " style="border-bottom: 1px solid #aba2a2;">
        <h4 style="padding: 5px 0px; margin: 0px;"><b>General Journal</b></h4>
      </div>
      <div class="gj-table">
        <table
            class="w-100 gj-table"
            style="border-top: 1px solid #aba2a2; margin-top: 1px;  border-bottomx: 3px double #aba2a2; padding-bottom: 5px; "
        >
            <thead style="border-bottom: 2px solid black; ">
                <tr>
                    <th colspan="2" style="border-right: 1px solid black; padding: 5px 0px;">
                        <b>&nbsp;</b>
                    </th>
                    <th style="border-right: 1px solid black; padding: 5px 0px;">
                        <b>&nbsp;</b>
                    </th>
                    <th style="border-right: 1px solid black; padding: 5px 0px;">
                        <b>&nbsp;</b>
                    </th>
                    <th colspan="2" class="text-center" style="border-bottom: 1px solid black; padding: 5px 0px;" >
                        <b>Amount (Ugx)</b>
                    </th>
                </tr>
                <tr class="bottom" style="border-bottom: 1px solid black; margin-top: 1px;">
                    <th colspan="2" class="text-center" style="border-right: 1px solid black; padding: 5px 0px;">
                        <b>Date</b>
                    </th>
                    <th class="text-center" style="border-right: 1px solid black; padding: 5px 0px;">
                        <b>Account Title and Explanations</b>
                    </th>
                    <th class="text-center" style="border-right: 1px solid black; padding: 5px 0px;" >
                        <b>Ref</b>
                    </th>
                    <th class="text-center" style="border-right: 1px solid black; padding: 5px 0px;">
                        <b>Debit</b>
                    </th>
                    <th class="text-center" style="padding: 5px 0px;">
                        <b>Credit</b>
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="row in rows" >
                    <tr v-if="row.rowType == 'year_row'" :key="row.id" style="margin-top: 1px;" >
                        <td colspan="2" class="text-center" style="border-bottom: 1px solid #aba2a2; border-right: 1px  solid black; padding: 5px 0px;">
                            <i><b>{{row.formatedYear}}</b></i>
                        </td>
                        <td  style="border-right: 1px solid black; padding: 5px 10px;">
                            <b>&nbsp;</b>
                        </td>
                        <td class="text-center" style="border-right: 1px solid black; padding: 5px 0px;" >
                            <b>&nbsp;</b>
                        </td>
                        <td class="text-center" style="border-right: 1px solid black; padding: 5px 0px;">
                            <b>&nbsp;</b>
                        </td>
                        <td class="text-center" style="padding: 5px 0px;">
                            <b>&nbsp;</b>
                        </td>
                    </tr>
                    <tr v-else-if="row.rowType == 'debit_row'" :key="row.id">
                        <td class="text-center" style="border-right: 1px solid #aba2a2; padding: 5px 0px;">
                            <i><b>{{row.formatedMonth}}</b></i>
                        </td>
                        <td class="text-center" style="border-right: 1px solid black; padding: 5px 0px;">
                            <i><b>{{row.formatedDay}}</b></i>
                        </td>
                        <td  style="border-right: 1px solid black; padding: 5px 10px;">
                            <b>{{row.accountName}}</b>
                        </td>
                        <td class="text-center" style="border-right: 1px solid black; padding: 5px 0px;" >
                            <b>&nbsp;</b>
                        </td>
                        <td class="text-end" style="border-right: 1px solid black; padding: 5px 10px;">
                            <b>{{row.formatedDebitAmount}}</b>
                        </td>
                        <td class="text-center" style="padding: 5px 0px;">
                            <b>&nbsp;</b>
                        </td>
                    </tr>
                    <tr v-else-if="row.rowType == 'credit_row'" :key="row.id">
                        <td class="text-center" style="border-right: 1px solid #aba2a2; padding: 5px 0px; width: 50px;">
                            <i><b>&nbsp;</b></i>
                        </td>
                        <td class="text-center" style="border-right: 1px solid black; padding: 5px 0px; width: 50px;">
                            <i><b></b></i>
                        </td>
                        <td  style="border-right: 1px solid black; padding: 5px 10px 5px 50px;">
                            <b>{{row.accountName}}</b>
                        </td>
                        <td class="text-center" style="border-right: 1px solid black; padding: 5px 0px;" >
                            <b>&nbsp;</b>
                        </td>
                        <td class="text-end" style="border-right: 1px solid black; padding: 5px 10px;">
                            <b>&nbsp;</b>
                        </td>
                        <td class="text-end" style="padding: 5px 10px;">
                            <b>{{row.formatedCreditAmount}}</b>
                        </td>
                    </tr>
                    <tr v-else-if="row.rowType == 'explain_row'" :key="row.id">
                        <td class="text-center" style="border-right: 1px solid #aba2a2; padding: 5px 0px; width: 50px;">
                            <i><b>&nbsp;</b></i>
                        </td>
                        <td class="text-center" style="border-right: 1px solid black; padding: 5px 0px; width: 50px;">
                            <i><b>&nbsp;</b></i>
                        </td>
                        <td  style="border-right: 1px solid black;  border-bottom: 1px solid #aba2a2; padding: 5px 10px 5px 10px;">
                            <b>(</b>{{row.accountName}}<b>)</b>
                        </td>
                        <td class="text-center" style="border-right: 1px solid black; padding: 5px 0px;" >
                            <b>&nbsp;</b>
                        </td>
                        <td class="text-end" style="border-right: 1px solid black; padding: 5px 10px;">
                            <b>&nbsp;</b>
                        </td>
                        <td class="text-end" style="padding: 5px 10px;">
                            <b></b>
                        </td>
                    </tr>
                </template>
                
            </tbody>
            <tfoot>
                <tr style="border-topx: 2px solid black; margin-top: 1px;">
                    <th colspan="4" class="text-center" style="border-bottom: 1px solid #aba2a2; border-right: 1px  solid black; padding: 5px 0px;">
                        <b>Total</b>
                    </th>
                    <th class="text-end" style="border-right: 1px solid black; border-bottom: 1px solid #aba2a2; padding: 5px 10px;">
                        <b>Ugx 130,050</b>
                    </th>
                    <th class="text-center" style="border-bottom: 1px solid #aba2a2; padding: 5px 10px;">
                        <b>Ugx 130,050</b>
                    </th>
                </tr>
            </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Vm from "@/utils/Vm";
import Data from "@/data";

let getFormData = function () {
  return {
    latestReadNotificationId: {
      id: "alerts-last-read-id-input",
      label: "",
      tooltip: "",
      value: -1,
      isValid: null,
      validations: {},
      ref: "last_seen_notification_id",
    }
  };
};

export default {
  components: {
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      notifications: [],
      errors: [],
      formData: getFormData(),
      isFormSubmitting: false,
      isUpdateNecessary: false,
      rows: []
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.update,
    loadDependencies() {
      var vm = this;
      vm.fetch("generalJournalDependencies", function (thisVm, res) {
        //prepare rows and totals
        if(res.transactions.length > 0){
            thisVm.rows = res.transactions;
        }else{
            //nyd
            //remove this if condition
            thisVm.rows = Data.generalJournalExampleRows;
        }
      });
    }
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>