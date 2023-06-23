import util from "./util";
export default {
    set: function(){
        return {
            ...util.defaults("maintenance"),
            ...util.make("maintenance", "Asset Maintenance"),
            ...util.make("insurance", "Insurance"),
            ...util.make("warranty", "Warranty"),
            ...util.make("impairment", "Impairment/Loss"),
            ...util.make("verification", "Asset Verifications"),
        }; 
    }
}