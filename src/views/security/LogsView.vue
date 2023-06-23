<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-100 px-1">
      <div class="d-flex justify-content-between align-items-center mb-0">
        <h4 class="mb-1">Monitor User Actions and Automated System Activities</h4>
      </div>
      <vue-good-table
        :columns="columns"
        :rows="rows"
        styleClass="vgt-table striped"
        max-height="500px"
        :fixed-header="true"
        compactMode
      >
        <template #table-row="props">
            <span v-if="props.column.field == 'datetime'"  :class="{'text-danger': props.row.activity.indexOf('deleted') >= 0}" >
                <b>{{formatDate(props.row.time_inserted)}}</b>
            </span>
            <span v-else-if="props.column.field == 'activity'"  :class="{'text-danger': props.row.activity.indexOf('deleted') >= 0}" >
                {{props.row.activity}}
            </span>
            <span 
                v-else-if="props.column.field == 'description'"
                :class="{'text-danger': props.row.activity.indexOf('deleted') >= 0}"
            >
                {{formatDescription(props.row.description)}}
            </span>
            <span v-else 
               :class="{
                    'text-danger': props.row.activity.indexOf('deleted') >= 0,
                }"
            >
                {{props.formattedRow[props.column.field]}}
            </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script>
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
export default {
  components: {
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      columns: [
        {
          label: "Date",
          field: "datetime",
          sortable: false,
          width: "200px"
        },
        {
          label: "Activity",
          field: "activity",
          sortable: false
        },
        {
          label: "Who",
          field: "who",
          sortable: false
        },
        {
          label: "Role",
          field: "role",
          sortable: false
        },
        {
          label: "Description",
          field: "description",
          sortable: false
        }
      ],
      rows: [],
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadDependencies() {
      var vm = this;
      vm.fetch("auditTrailsDependencies", function (thisVm, res) {
        vm.rows = res.trails;
      });
    },
    formatDescription(description){
       if(description){
         if(description.length > 60){
            return description.substring(0, 60) + " ...";
         }else{
            return description;
         }
       }else{
        return "";
       }
    },
    formatDate(timeInserted){
       let timeStr =  Utils.phpTimeToJsDateString(timeInserted, true);
       return timeStr;
    }
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>