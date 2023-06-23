<template>
    <div class="d-flex justify-content-center align-items-center h-100">
        <div class="w-50">
            <h4 class="mb-1">Available System Roles</h4>
            <vue-good-table
                :columns="columns"
                :rows="rows"
                styleClass="vgt-table striped"/>
        </div>
    </div>
</template>

<script>
import Vm from "@/utils/Vm";

export default {
  data() {
    return {
        columns: [{
          label: 'Role Name',
          field: 'name',
        },{
          label: 'Role Description',
          field: 'name',
        }],
        rows: [],
    }
  },
  methods: {
    ...Vm.fetch,
    loadDependencies() {
        var vm = this;
        vm.fetch("settingsRolesDependencies", function (thisVm, res) {
            vm.rows = res.roles;
        });
    }
  },
  mounted(){
      this.loadDependencies();
  }
};
</script>