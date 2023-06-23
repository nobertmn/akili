<template>
    <div class="d-flex justify-content-center align-items-center h-100">
        <div class="w-50">
            <h4 class="mb-1">Available System Departments</h4>
            <vue-good-table
                :columns="columns"
                :rows="rows"
                styleClass="vgt-table striped"/>
        </div>
    </div>
</template>

<script>
import Data from "@/data/";

export default {
  data() {
    return {
        columns: [{
          label: 'Department Name',
          field: 'name',
        },{
          label: 'Department Description',
          field: 'description',
        }],
        rows: Data.departments
    }
  },
  methods: {
  },
  mounted(){
  }
};
</script>