import util from "./util";
export default {
    set: function(){
        return {
            ...util.defaults("accounts"),
            ...util.make("generalLedger", "Accounting General Legder"),
            ...util.make("chartOfAccounts", "Accounting Chart of Accounts"),
            ...util.make("paymentTypes", "Payment Types")
        }; 
    }
}