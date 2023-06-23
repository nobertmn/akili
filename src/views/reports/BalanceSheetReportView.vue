<template>
  <div
    class="d-flex justify-content-center align-items-start h-100 pt-1 bg-light"
  >
    <div
      class="w-75 bg-white"
      style="padding: 0px 5px; height: 620px; overflow-y: auto"
    >
      <div
        class="d-flex justify-content-center align-items-center"
        style="border-bottom: 1px solid #aba2a2"
      >
        <h4 style="padding: 5px 0px; margin: 0px">
          <b>Balance Sheet<br /></b>
        </h4>
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
                  class="text-center no-shadow"
                  style="padding: 2px 0px; background: #ececf1 !important"
                >
                  <b>{{ row.name }}</b>
                </th>
              </tr>
              <tr v-if="row.type == 'sub_section'" :key="index">
                <td
                  class="text-right"
                  style="border-right: 1px solid black; padding: 2px 15px"
                >
                  <b>{{ row.name }}</b>
                </td>
                <td style="border-right: 1px solid black; padding: 2px 10px">
                  <b>&nbsp;</b>
                </td>
                <td class="text-right" style="padding: 2px 0px">
                  <b>&nbsp;</b>
                </td>
              </tr>
              <tr v-if="row.type == 'entry'" :key="index">
                <td
                  class="text-center"
                  style="border-right: 1px solid black; padding: 2px 0px"
                >
                  <b>&nbsp;</b>
                </td>
                <td
                  style="
                    border-bottom: 1px solid #aba2a2;
                    border-right: 1px solid black;
                    padding: 2px 10px;
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
                  class="text-center"
                  style="border-right: 1px solid black; padding: 2px 0px"
                >
                  <b>&nbsp;</b>
                </td>
                <td
                  style="
                    border-bottom: 1px solid #aba2a2;
                    border-right: 1px solid black;
                    padding: 2px 50px;
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
              <tr v-if="row.type == 'total'" :key="index">
                <td
                  class="text-center"
                  style="
                    border-top: unset;
                    border-right: 1px solid black;
                    padding: 2px 0px;
                  "
                >
                  <b>&nbsp;</b>
                </td>
                <td
                  style="
                    border-top: 1px solid black;
                    border-right: 1px solid black;
                    padding: 2px 120px;
                  "
                >
                  <b>{{ row.name }}</b>
                </td>
                <td
                  class="text-end"
                  style="
                    border-top: 1px solid black;
                    padding: 2px 20px;
                    width: 200px;
                  "
                >
                  <b>{{ row.formatedAmount }}</b>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
//https://www.theforage.com/blog/skills/balance-sheet#:~:text=A%20balance%20sheet%20shows%20the%20three%20main%20accounts%20(assets%2C%20liabilities,quarter%20from%20the%20previous%20year.
//https://www.accountingcoach.com/balance-sheet-new/explanation/2
//https://www.geeksforgeeks.org/how-to-prepare-a-balance-sheet/
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

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
      rows: [
        {
          type: "section_header",
          name: "ASSETS",
          group: "section_header_1",
        },
        {
          type: "sub_section",
          name: "Current Assets",
          group: "sub_section_1",
        },
        {
          type: "entry",
          group: "cash",
          name: "Cash",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "entry",
          group: "accounts receivable",
          name: "Accounts Receivable",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "entry",
          group: "inventory",
          name: "Inventory",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "entry",
          group: "other current assets",
          name: "Other Current Assets",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "sub_total",
          group: "totalCurrentAssets",
          name: "Total Current Assets ",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "sub_section",
          name: "Non Current Assets",
          group: "sub_section_2",
        },
        {
          type: "entry",
          group: "marketable securities",
          name: "Marketable Securities",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "entry",
          group: "property, plant and equipment, net",
          name: "Property, Plant and Equipment, net",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "entry",
          group: "other non-current assets",
          name: "Other Non-Current Assets",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "sub_total",
          group: "totalNonCurrentAssets",
          name: "Total Non-Current Assets",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "total",
          group: "totalAssets",
          name: "Total Assets",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "section_header",
          name: "LIABILITIES",
          group: "section_header_2",
        },
        {
          type: "sub_section",
          name: "Current Liabilities",
          group: "sub_section_3",
        },
        {
          type: "entry",
          group: "accounts payable",
          name: "Accounts Payable",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "entry",
          group: "deferred revenue",
          name: "Deferred Revenue",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "entry",
          group: "short-term debt",
          name: "Short-Term Debt",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "entry",
          group: "other current liabilities",
          name: "Other Current Liabilities",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "sub_total",
          group: "totalCurrentLiabilities",
          name: "Total Current Liabilities",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "sub_section",
          name: "Non Current Liabilities",
          group: "sub_section_4",
        },
        {
          type: "entry",
          group: "long-term debt",
          name: "Long-Term Debt",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "entry",
          group: "other non-current liabilities",
          name: "Other Non-Current Liabilities",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "sub_total",
          group: "totalNonCurrentLiabilities",
          name: "Total Non Current Liabilities",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "total",
          group: "totalLiabilities",
          name: "Total Liabilities",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "section_header",
          name: "SHAREHOLDERS EQUITY",
          group: "section_header_3",
        },
        {
          type: "sub_section",
          name: "Shareholder's   Equity",
          group: "sub_section_5",
        },
        {
          type: "entry",
          group: "common stock",
          name: "Common Stock",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "entry",
          group: "retained earnings",
          name: "Retained Earnings",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "entry",
          group: "accum comprehensive income",
          name: "Accum Comprehensive Income",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "sub_total",
          group: "totalShareHoldersEquity",
          name: "Total Share Holders Equity",
          value: 0,
          formatedAmount: "0",
        },
        {
          type: "total",
          group: "totalLiabilitiesAndShareholdersEquity",
          name: "Total Liabilities and Shareholder's equity",
          value: 0,
          formatedAmount: "0",
        },
      ],
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadReport() {
      var vm = this;
      vm.fetch("reportBalanceSheetDependencies", function (thisVm, res) {
        let indexedAccounts = Utils.index(res.accounts, "id");
        let transactions = res.transactions;

        let rowsCopy = [... thisVm.rows];
        let indexedRowsCopy = Utils.index(rowsCopy, "group");
        //we use the group property
        for (let index = 0; index < transactions.length; index++) {
            const transaction = transactions[index];

            let debitAccountId = transaction.debit_account_id;
            let creditAccountId = transaction.credit_account_id;
            let debitAccount = indexedAccounts[debitAccountId];
            let creditAccount = indexedAccounts[creditAccountId];

            let transactionAmount = parseFloat(transaction.amount);

            let debitGroupName = debitAccount.group.toLowerCase();
            let creditGroupName = creditAccount.group.toLowerCase();

            indexedRowsCopy[debitGroupName].value += transactionAmount;
            indexedRowsCopy[creditGroupName].value += transactionAmount;
        }

        //Total Current Assets
        let totalCurrentAssets = 
            indexedRowsCopy["cash"].value +
            indexedRowsCopy["accounts receivable"].value +
            indexedRowsCopy["inventory"].value +
            indexedRowsCopy["other current assets"].value;
        indexedRowsCopy["totalcurrentassets"].value = totalCurrentAssets;
        indexedRowsCopy["totalcurrentassets"].formatedAmount = Utils.comma(totalCurrentAssets);
        //Total Non-Current Assets
        let totalNonCurrentAssets = 
            indexedRowsCopy["marketable securities"].value +
            indexedRowsCopy["property, plant and equipment, net"].value +
            indexedRowsCopy["other non-current assets"].value;
        indexedRowsCopy["totalnoncurrentassets"].value = totalNonCurrentAssets;
        indexedRowsCopy["totalnoncurrentassets"].formatedAmount = Utils.comma(totalNonCurrentAssets);
        //Total Assets
        let totalAssets = 
            indexedRowsCopy["totalcurrentassets"].value +
            indexedRowsCopy["totalnoncurrentassets"].value;
        indexedRowsCopy["totalassets"].value = totalAssets;
        indexedRowsCopy["totalassets"].formatedAmount = Utils.comma(totalAssets);

        //Total Current Liabilities
        let totalCurrentLiabilities = 
            indexedRowsCopy["accounts payable"].value +
            indexedRowsCopy["deferred revenue"].value +
            indexedRowsCopy["short-term debt"].value +
            indexedRowsCopy["other current liabilities"].value;
        indexedRowsCopy["totalcurrentliabilities"].value = totalCurrentLiabilities;
        indexedRowsCopy["totalcurrentliabilities"].formatedAmount = Utils.comma(totalCurrentLiabilities);
        //Non Current Liabilities
        let totalNonCurrentLiabilities = 
            indexedRowsCopy["long-term debt"].value +
            indexedRowsCopy["other non-current liabilities"].value;
        indexedRowsCopy["totalnoncurrentliabilities"].value = totalNonCurrentLiabilities;
        indexedRowsCopy["totalnoncurrentliabilities"].formatedAmount = Utils.comma(totalNonCurrentLiabilities);
        //Total Liabilities
        let totalLiabilities = 
            indexedRowsCopy["totalcurrentliabilities"].value +
            indexedRowsCopy["totalnoncurrentliabilities"].value;
        indexedRowsCopy["totalliabilities"].value = totalLiabilities;
        indexedRowsCopy["totalliabilities"].formatedAmount = Utils.comma(totalLiabilities);

        //Shareholder's   Equity
        let totalShareHoldersEquity = 
            indexedRowsCopy["common stock"].value +
            indexedRowsCopy["retained earnings"].value +
            indexedRowsCopy["accum comprehensive income"].value;
        indexedRowsCopy["totalshareholdersequity"].value = totalShareHoldersEquity;
        indexedRowsCopy["totalshareholdersequity"].formatedAmount = Utils.comma(totalShareHoldersEquity);

        //total
        let totalLiabilitiesAndShareholdersEquity = 
            indexedRowsCopy["totalliabilities"].value +
            indexedRowsCopy["totalshareholdersequity"].value;
        indexedRowsCopy["totalliabilitiesandshareholdersequity"].value = totalLiabilitiesAndShareholdersEquity;
        indexedRowsCopy["totalliabilitiesandshareholdersequity"].formatedAmount = Utils.comma(totalLiabilitiesAndShareholdersEquity);

        //update the rows
        for (let index = 0; index < rowsCopy.length; index++) {
            const rowCopy = rowsCopy[index];
            if(rowCopy.type == "section_header" || rowCopy.type == "sub_section"){
                continue;
            }
            let groupName = rowCopy.group.toLowerCase();
            rowCopy.value = indexedRowsCopy[groupName].value;
            rowCopy.formatedAmount = indexedRowsCopy[groupName].formatedAmount;
            rowsCopy[index] = rowCopy;
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