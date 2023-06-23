<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-90">
      <div class="d-flex flex-row justify-content-between">
        <div class="me-1">
            <div style="max-height: 50px; min-height: 50px;" class="d-flex flex-column justify-content-between">
                <div><b>Select Accounts To Display</b></div>
                <div class="d-flex flex-row justify-content-between" style="margin-bottom:5px;">
                    
                    <span>Selected: {{selectedAccountsLength}}</span>
                    <span> </span>
                </div>
            </div>
            <div style="max-height: 550px; min-height: 550px; overflow-y: auto; background-color: #e7e9ea; padding:2px; width: 300px">
                <div 
                    v-for="(account, index) in accounts"
                    :key="index"
                    class="d-flex flex-row justify-content-start bg-white w-100" 
                    style="padding: 5px 5px; cursor: pointer; margin-bottom: 1px;">
                    <input 
                        type="checkbox" 
                        :id="account.id" 
                        style="cursor: pointer !important;"
                        @change="(event) => onToggleSelected(event, account, index)" />
                    <label 
                        :for="account.id" 
                        class="flex-grow-1 text-capitalize" 
                        style="padding-left:5px; cursor: pointer !important;">
                        {{account.ref_no}} - {{account.name}}
                    </label>
                    <IconButton
                        kind="btn-success"
                        style="padding: 2px;"
                        :is-disabled="isLoading"
                        @click="(event) => onClickDisplayItem(event,account)"
                        v-if="selectedAccounts[index] != null"
                    >
                        <i class="fas fa-eye" style="fonr-size:10px;"></i> 
                    </IconButton>
                    <div v-else style="">
                        &nbsp;
                    </div>
                </div>
            </div>
        </div>

        <div class="flex-grow-1 ms-1">
            <div class="d-flex flex-column justify-content-between align-items-start ">
                <h4>General Ledger Accounts</h4>
                <h6 >{{cmptEndDateStr}} - Amount In {{currency}}</h6>
            </div>
            <div class="d-flex flex-column border p-1 " style="max-height: 550px; min-height: 550px; overflow-y: auto; background-color: #e7e9ea;"> 
                <div v-for="(selectedAccount, index) in selectedAccounts" 
                    :key="index" 
                    >
                    <GeneralLedgerAccountViewer 
                        :ref="'acc'+selectedAccount.id"
                        v-if="selectedAccount != null"
                        :views="selectedAccount" 
                    />
                </div>
            </div>
        </div>       
      </div>
    </div>
  </div>
</template>

<script>
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import IconButton from "@/components/inputs/IconButton.vue";
import GeneralLedgerAccountViewer from "@/components/viewers/GeneralLedgerAccountViewer.vue";

export default {
  components: {
    IconButton,
    GeneralLedgerAccountViewer
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      accounts: [],
      currency: "",
      glAccount: Utils.defaultGlAccount(),
      selectedAccounts: [],
      selectedAccountsLength: 0,
      endDate: ""
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.delete,
    ...Vm.loaders,
    loadDependencies() {
      var vm = this;
      vm.fetch("generalLedgerDependencies", function (thisVm, res) {
        //nyd
        //remove this
        var accounts = res.accounts;
        var newaccounts =  [];
        var selectedAccounts = [];
        for (let index = 0; index < 10; index++) {
            newaccounts = newaccounts.concat(accounts);
            var temp = [];
            for (let index2 = 0; index2 < newaccounts.length; index2++) {
                const newaccount = newaccounts[index2];
                temp.push({
                    ... newaccount,
                    id: index + "-" + index2
                });
                selectedAccounts.push(null);
            }
            newaccounts = temp;
        }
        thisVm.accounts = newaccounts;

        // thisVm.accounts = res.accounts;
        thisVm.selectedAccounts = selectedAccounts;
      });
    },
    comma(amount) {
      let value = parseFloat(amount);
      return value.toLocaleString();
    },
    onToggleSelected(event, account, index){
        if(event && event.preventDefault){
            event.preventDefault();
            var indexItem = this.selectedAccounts[index];
            if(indexItem == null){
                //pick the transactions of this item, 
                //it has to be added to  the displayed accounts

                //balance = balance + debit - credit
                var temp = [...this.selectedAccounts];
                temp[index] = {
                    ... account,
                    rows: [{
                        occured_date: "2023-05-01",
                        explanation: "Balance Brought Forward",
                        ref: "",
                        formated_debit_amount: "",
                        formated_credit_amount: "",
                        formated_balance_amount: "-",
                    },{
                        occured_date: "2023-05-02",
                        explanation: "Asset scheduled maintenace",
                        ref: "GJ#345",
                        formated_debit_amount: "25,000",
                        formated_credit_amount: "",
                        formated_balance_amount: "25,000",
                    },{
                        occured_date: "2023-05-05",
                        explanation: "Asseet disposal",
                        ref: "GJ#357",
                        formated_debit_amount: "",
                        formated_credit_amount: "4,050,000",
                        formated_balance_amount: "4,025,000",
                    }]
                };
                this.selectedAccounts = temp;
                this.selectedAccountsLength += 1;
            }else{
                //remove this item from the displayed accounts
                var temp = [...this.selectedAccounts];
                temp[index] = null;
                this.selectedAccounts = temp;
                this.selectedAccountsLength -= 1;
            }
        }
    },
    onClickDisplayItem(event, account){
        if(event){
            // event.preventDefault();
            let ref = 'acc'+account.id;
            let thisRef = this.$refs[ref];
            if(thisRef && thisRef.length > 0 && thisRef[0].$el ){
                thisRef[0].$el.scrollIntoView({ behavior: "smooth" });
            }
        }
    },
    getEndDate(){
        var today = new Date();
        this.endDate = Utils.dateToStandardDateString(today);
        return this.endDate;
    }
  },
  computed: {
    cmptEndDateStr(){
        return this.getEndDate();
    }
  },
  mounted() {
    this.currency = JSON.parse(localStorage.getItem("config")).currency;
    this.loadDependencies();
  }
};
</script>