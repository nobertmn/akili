import util from "./util";
export default {
    set: function(){
        return {
            ...util.defaults("purchases"),
        }; 
    }
}