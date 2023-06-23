export default {
    make: function(name, displayName){
        var subModule = {};
        subModule[name] = function(can_view, can_add, can_edit, can_delete){
            var item = {
                sub_module_name: displayName?displayName: name,
                can_view: can_view?can_view: "no",
                can_add: can_add?can_add: "no",
                can_edit: can_edit?can_edit: "no",
                can_delete: can_delete?can_delete: "no",
            };
            this.items.push(item);
            return this;
        };
        return subModule;
    },
    defaults(moduleName){
        return {
            items: [],
            yield: function(){
                var temp = {};
                temp[moduleName] = {
                    name: moduleName,
                    permissions: this.items
                };
                return temp;
            },
        }
    }
}