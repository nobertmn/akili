<template>
  <div
    class="d-flex justify-content-center align-items-start h-100 pt-1 bg-light"
  >
    <div
      class="w-75 bg-white"
      style="padding: 0px 5px; height: 620px; overflow-y: auto"
    >
      <div
        class="d-flex flex-column justify-content-center align-items-center"
        style="border-bottom: 1px solid #aba2a2"
      >
        <h4 style="padding: 5px 0px; margin: 0px">
          <b>Income Statement</b>
        </h4>
        <small>For The Month Ending {{ monthEnding }}</small>
      </div>
      <div class="gj-table">
        <table
          class="w-100 gj-table"
          style="
            border-top: 1px solid #aba2a2;
            margin-top: 1px;
            border-bottomx: 3px double #aba2a2;
            padding-bottom: 5px;
          "
        >
          <tbody>
            <template v-for="(row, index) in rows">
              <tr
                v-if="row.type == 'section_header'"
                :key="index"
                class="bottom top"
                style="margin-top: 1px"
              >
                <th
                  colspan="3"
                  class="text-start no-shadow"
                  style="padding: 2px 0px; background: #ececf1 !important"
                >
                  <b class="ps-1">{{ row.name }}</b>
                </th>
              </tr>

              <tr v-if="row.type == 'entry'" :key="index">
                <td
                  colspan="2"
                  style="
                    border-bottom: 1px solid #aba2a2;
                    border-right: 1px solid black;
                    padding: 2px 10px;
                    padding-left: 50px;
                  "
                >
                  {{ row.name }}
                </td>
                <td
                  class="text-end"
                  style="
                    border-bottom: 1px solid #aba2a2;
                    padding: 2px 20px;
                    width: 200px;
                  "
                >
                  {{ row.formatedAmount }}
                </td>
              </tr>
              <tr v-if="row.type == 'sub_total'" :key="index">
                <td
                  colspan="2"
                  style="
                    border-bottom: 1px solid #aba2a2;
                    border-right: 1px solid black;
                    padding: 2px 50px;
                    padding-left: 100px;
                  "
                >
                  <b>{{ row.name }}</b>
                </td>
                <td
                  class="text-end"
                  style="
                    border-bottom: 1px solid #aba2a2;
                    padding: 2px 20px;
                    width: 200px;
                  "
                >
                  <b>{{ row.formatedAmount }}</b>
                </td>
              </tr>
              <tr v-if="row.type == 'sub_section'" :key="index">
                <td
                  colspan="2"
                  style="
                    border-bottom: 1px solid #aba2a2;
                    padding: 2px 10px;
                    padding-left: 50px;
                  "
                >
                  <b v-html="row.name"></b>
                </td>
                <td
                  class="text-end"
                  style="
                    border-bottom: 1px solid #aba2a2;
                    padding: 2px 20px;
                    width: 200px;
                  "
                >
                  {{ row.formatedAmount }}
                </td>
              </tr>
              <tr
                v-if="row.type == 'total'"
                :key="index"
                class="bottom top"
                style="margin-top: 1px"
              >
                <th
                  colspan="2"
                  class="text-start no-shadow"
                  style="padding: 2px 0px; background: #ececf1 !important"
                >
                  <b class="ps-1">{{ row.name }}</b>
                </th>
                <th
                  class="text-end"
                  style="
                    padding: 2px 0px;
                    background: #ececf1 !important;
                    padding: 2px 20px;
                    width: 200px;
                  "
                >
                  <b>{{ row.formatedAmount }}</b>
                </th>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
//https://www.freshbooks.com/hub/reports/sample-balance-sheet-and-income-statement-small-business
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

let rowsGroupA = [
  {
    type: "section_header",
    accountType: "section_header_1",
    name: "Revenue",
  },
  {
    type: "entry",
    accountType: "sales income",
    name: "Sales Income",
    value: 0,
    formatedAmount: "0",
  },
  {
    type: "entry",
    accountType: "cost of goods sold",
    name: "Cost Of Goods Sold",
    value: 0,
    formatedAmount: "0",
  },
  {
    type: "sub_total",
    accountType: "grossProfit",
    name: "Gross Profit",
    value: 0,
    formatedAmount: "0",
  },
  {
    type: "section_header",
    name: "Operating Expenses",
    accountType: "section_header_2",
  },
];

let rowsGroupB = [
  {
    type: "sub_section",
    accountType: "selling expenses",
    name: "Selling Expenses",
  },
  {
    type: "sub_section",
    accountType: "administrative expenses",
    name: "Administrative Expenses",
  },
];

let rowsGroupC = [
  {
    type: "sub_total",
    accountType: "totalOperatingExpenses",
    name: "Total Operating Expenses",
    value: 0,
    formatedAmount: "0",
  },
  {
    type: "sub_section",
    accountType: "emptyrow",
    name: "&nbsp; ",
  },
  {
    type: "sub_total",
    accountType: "operatingIncome",
    name: "Operating Income",
    value: 0,
    formatedAmount: "0",
  },
  {
    type: "sub_section",
    accountType: "emptyro2",
    name: "&nbsp; ",
  },
  {
    type: "section_header",
    accountType: "Non Operating Or Other Revenue",
    group: "section_header_3",
  },
];

let rowsGroupD = [
  {
    type: "sub_total",
    accountType: "totalNonOperating",
    name: "Total Non Operating",
    value: 0,
    formatedAmount: "0",
  },
  {
    type: "sub_section",
    accountType: "emptyro3",
    name: "&nbsp;",
  },
  {
    type: "total",
    accountType: "netIncome",
    name: "Net Income",
    value: 0,
    formatedAmount: "0",
  },
];



export default {
  components: {},
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rows: rowsGroupA.concat(rowsGroupB).concat(rowsGroupC).concat(rowsGroupD),
      monthEnding: Utils.getMonthEnding(new Date()),
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadReport() {
      var vm = this;
      vm.fetch("reportIncomeStatementDependencies", function (thisVm, res) {
        let indexedAccounts = Utils.index(res.accounts, "id");
        let transactions = res.transactions;

        let sellingExpensesRows = []; //selling expenses
        let adminstrativeExpensesRows = []; //administrative expenses
        let nonOperatingOrOtherIncomeRows = []; //non operating or other income
        //add accounts for the selling and administrative expenses
        for (let index = 0; index < res.accounts.length; index++) {
          const account = res.accounts[index];
          if (account.type == "selling expenses") {
            sellingExpensesRows.push({
              type: "entry",
              accountType: "selling expenses",
              name: account.name,
              value: 0,
              formatedAmount: "0",
            });
          } else if (account.type == "administrative expenses") {
            adminstrativeExpensesRows.push({
              type: "entry",
              accountType: "administrative expenses",
              name: account.name,
              value: 0,
              formatedAmount: "0",
            });
          } else if (account.type == "non operating or other income") {
            nonOperatingOrOtherIncomeRows.push({
              type: "entry",
              accountType: "non operating or other income",
              name: account.name,
              value: 0,
              formatedAmount: "0",
            });
          }
        }
        //make a rowsCopy
        let rowsCopy = [...rowsGroupA];
        //insert the selling expenses
        rowsCopy.push(rowsGroupB[0]);
        rowsCopy = rowsCopy.concat(sellingExpensesRows);
        //insert the administrative expenses
        rowsCopy.push(rowsGroupB[1]);
        rowsCopy = rowsCopy.concat(adminstrativeExpensesRows);
        //insert group c
        rowsCopy = rowsCopy.concat(rowsGroupC);
        //insert the none operating expenses
        rowsCopy = rowsCopy.concat(nonOperatingOrOtherIncomeRows);
        //insert group D
        rowsCopy = rowsCopy.concat(rowsGroupD);

        
        //we use the type property
        for (let index = 0; index < res.transactions.length; index++) {
          const transaction = res.transactions[index];

          let debitAccountId = transaction.debit_account_id;
          let creditAccountId = transaction.credit_account_id;
          let debitAccount = indexedAccounts[debitAccountId];
          let creditAccount = indexedAccounts[creditAccountId];

          let transactionAmount = parseFloat(transaction.amount);

          let debitTypeName = debitAccount.type.toLowerCase();
          let creditTypeName = creditAccount.type.toLowerCase();

          //look for the debitTypeName in the rowsCopy
          for (let rowsIndex = 0; rowsIndex < rowsCopy.length; rowsIndex++) {
            let rowCopy = rowsCopy[rowsIndex];
            let rowsAccountTypeName = rowCopy.accountType ? rowsCopy.accountType.toLowerCase() : "404";
            if(rowsAccountTypeName == debitTypeName && rowCopy.type != "sub_section"){
                rowCopy.value += transactionAmount;
                rowCopy.formatedAmount = Utils.comma(rowCopy.value);
            }
            if(rowsAccountTypeName == creditTypeName  && rowCopy.type != "sub_section"){
                rowCopy.value += transactionAmount;
                rowCopy.formatedAmount = Utils.comma(rowCopy.value);
            }
            rowsCopy[rowsIndex] = rowCopy;
          }
        }

        let totalSalesIncome = 0;
        let totalCostOfGoods = 0;
        let grossProfit = 0;
        let totalOperatingExpenses = 0;
        let operatingIncome = 0;
        let totalNonOperating = 0;
        let netIncome = 0;
        for (let rowsIndex = 0; rowsIndex < rowsCopy.length; rowsIndex++) {
            let rowCopy = rowsCopy[rowsIndex];
            if(rowCopy.type == "sub_section"){
                continue;
            }
            let rowsAccountTypeName = rowCopy.accountType ? rowCopy.accountType.toLowerCase() : "404";
            if(rowsAccountTypeName == "sales income"){
                totalSalesIncome += rowCopy.value;
            }else if(rowsAccountTypeName == "cost of goods sold"){
                totalCostOfGoods += rowCopy.value;
            }else if(rowsAccountTypeName == "grossprofit"){
                grossProfit = totalSalesIncome - totalCostOfGoods;
                rowCopy.value = grossProfit;
                rowCopy.formatedAmount = Utils.comma(rowCopy.value);
            }else if(rowsAccountTypeName == "selling expenses"){
                totalOperatingExpenses += rowCopy.value;
            }else if(rowsAccountTypeName == "administrative expenses"){
                totalOperatingExpenses += rowCopy.value;
            }else if(rowsAccountTypeName == "totaloperatingexpenses"){
                console.log("totalOperatingExpenses", totalOperatingExpenses);
                rowCopy.value = totalOperatingExpenses;
                rowCopy.formatedAmount = Utils.comma(rowCopy.value);
            }else if(rowsAccountTypeName == "operatingincome"){
                operatingIncome = grossProfit - totalOperatingExpenses
                rowCopy.value = operatingIncome;
                rowCopy.formatedAmount = Utils.comma(rowCopy.value);
            }else if(rowsAccountTypeName == "non operating or other income"){
                totalNonOperating += rowCopy.value;
            }else if(rowsAccountTypeName == "totalnonoperating"){
                rowCopy.value = totalNonOperating;
                rowCopy.formatedAmount = Utils.comma(rowCopy.value);
            }else if(rowsAccountTypeName == "netincome"){
                netIncome = operatingIncome + totalNonOperating;
                rowCopy.value = netIncome
                rowCopy.formatedAmount = Utils.comma(netIncome);
            }
            rowsCopy[rowsIndex] = rowCopy;
        }

        thisVm.rows = rowsCopy;
      });
    },
  },
  mounted() {
    this.loadReport();
  },
};
</script>