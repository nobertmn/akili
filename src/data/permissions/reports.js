import util from "./util";
export default {
    set: function(){
        return {
            ...util.defaults("reports"),
            ...util.make("assets"),
            ...util.make("assetsRegister", "Assets Registry Report"),
            ...util.make("assetsAcquisitions", "Assets Acquisitions Report"),
            ...util.make("assetsImpairments", "Assets Impairments Report"),
            ...util.make("assetsMaintenance", "Assets Maintenance Report"),
            ...util.make("financials", "Finacial Reports"),
            ...util.make("financialsBalanceSheet", "Balance Sheet Reports"),
            ...util.make("financialsIncomeStatement", "Income Statement Reports"),
            ...util.make("financialsSales", "Sales Income Report")
        }; 
    }
}