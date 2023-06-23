<template>
    <div class="notification-itemx" style="padding:0px; background-color: white; margin-bottom:15px; " >
        <div class="d-flex justify-content-center border " style="padding: 5px 0px;">
            <b>General Ledger</b> 
        </div>
        <div class="d-flex justify-content-start border " style="padding: 5px 5px;">
            <b>Account Name: <span class="text-uppercase ms-1"><strong>{{views.name}}</strong></span></b>
        </div>
        <div class="d-flex justify-content-start border " style="padding: 5px 5px;">
            <b>Account Number: <span class="text-uppercase font-bold"><strong>{{views.ref_no}}</strong></span></b>
        </div>
        <table class="w-100">
            <thead>
                <tr>
                    <th class="gl-date-column text-left"><b>Date</b></th>
                    <th class="gl-exp-column text-center"><b>Explanation</b></th>
                    <th class="gl-ref-column text-center"><b>Ref</b></th>
                    <th class="gl-amount-column text-center"><b>Debit</b></th>
                    <th class="gl-amount-column text-center"><b>Credit</b></th>
                    <th class="gl-amount-column text-center bg-light"><b>Balance</b></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in views.rows" :key="index">
                    <td class="gl-date-column">{{row.occured_date}}</td>
                    <td class="gl-exp-column">{{row.explanation}}</td>
                    <td class="gl-ref-column">{{row.ref}}</td>
                    <td class="gl-amount-column">{{row.formated_debit_amount}}</td>
                    <td class="gl-amount-column">{{row.formated_credit_amount}}</td>
                    <td class="gl-amount-column bg-light">{{row.formated_balance_amount}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import Utils from "@/utils";

export default {
  props:{
    views: {
      type: Object,
      default: function(){
        return  Utils.defaultGlAccount();
      }
    }
  },
}
</script>

