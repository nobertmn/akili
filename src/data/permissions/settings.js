import util from "./util";
export default {
    set: function(){
        return {
            ...util.defaults("settings"),
            ...util.make("configs"),
            ...util.make("branches"),
            ...util.make("sites"),
            ...util.make("departments"),
            ...util.make("profile", "user bio data"),
            ...util.make("users", "system users"),
            ...util.make("permissions", "role group permissions"),
            ...util.make("roles", "system roles/user groups")
        };
    }
}