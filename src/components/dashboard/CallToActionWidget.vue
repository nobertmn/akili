<template>
  <div class="bg-white m-1 ms-0 w-50 p-1 rounded">
    <div class="d-flex justify-content-between">
      <div>
        <b>{{ totalTasks }}</b> Call To Action Item{{totalTasks  == 1  ?'':'s'}}
      </div>
      <div></div>
    </div>
    <div class="pt-1" style="max-height: 250px; overflow-y: auto">
      <DashboardTodoItemViewer
        v-for="(taskItem, index) in taskItems"
        :key="index"
        :viewItem="taskItem"
      />
    </div>
  </div>
</template>


<script>
import Utils from "@/utils/";
import Vm from "@/utils/Vm";
import DashboardTodoItemViewer from "@/components/viewers/DashboardTodoItemViewer.vue";

export default {
  components: {
    DashboardTodoItemViewer,
  },
  props: {
    user: {
      type: Object,
      default: function () {
        return Utils.defaultUser();
      },
    },
  },
  data() {
    return {
      taskItems: [],
      totalTasks: 0
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadDependencies() {
      var vm = this;
      vm.fetch(
        "dashboardCallToActionWidgetDependencies",
        function (thisVm, res) {
          let tasks = [];
          let total = 0;
          if(res.requisitions > 0){
            total += res.requisitions;
            tasks.push({
              link: "/registery/requisitions",
              classes: "bg-todo-1",
              iconClass: "uil uil-archive-alt",
              label: "Pending <b>Requisitions</b>",
              value: `${Utils.dashboardTaskValue(res.requisitions)} <small>need${res.requisitions==1?"s":""} approval</small>`,
            });
          }
          if(res.transfers > 0){
            total += res.transfers;
            tasks.push({
              link: "/registery/transfers",
              classes: "bg-todo-2x",
              iconClass: "uil uil-exchange",
              label: "Pending <b>Asset Transfers</b>",
              value: `${Utils.dashboardTaskValue(res.transfers)} <small>need${res.transfers==1?"s":""} approval</small>`,
            });
          }
          if(res.disposalBucketItems > 0){
            total += res.disposalBucketItems;
            tasks.push({
              link: "/notifications/disposal",
              classes: "bg-todo-1",
              iconClass: "uil uil-trash",
              label: "<b>Assets Marked For Disposal</b>",
              value: `${Utils.dashboardTaskValue(res.disposalBucketItems)}  <small>need${res.disposalBucketItems==1?"s":""} attention</small>`,
            });
          }
          if(res.notifications > 0){
            total += res.notifications;
            tasks.push({
              link: "/notifications/alerts",
              classes: "bg-todo-4x",
              iconClass: "uil uil-bell",
              label: "<b>Unread Notifications</b>",
              value: `${Utils.dashboardTaskValue(res.notifications)} <small>need${res.notifications==1?"s":""} attention</small>`,
            });
          }
          if(res.disposals > 0){
            total += res.disposals;
            tasks.push({
              link: "/registery/disposal",
              classes: "bg-todo-1",
              iconClass: "uil uil-trash-alt",
              label: "Pending <b>Disposal</b>",
              value: `${Utils.dashboardTaskValue(res.disposals)} <small>need${res.disposals==1?"s":""} approval</small>`,
            });
          }
          if(res.acquisitionOrders > 0){
            total += res.acquisitionOrders;
            tasks.push({
              link: "/purchases/list",
              classes: "bg-todo-1x",
              iconClass: "uil uil-file-plus-alt",
              label: "Pending <b>Acquisitions</b>",
              value: `${Utils.dashboardTaskValue(res.acquisitionOrders)} <small>need${res.acquisitionOrders==1?"s":""} approval</small>`,
            });
          }
          if(res.assetRecordings > 0){
            total += res.assetRecordings;
            tasks.push({
              link: "/purchases/recording",
              classes: "bg-todo-1",
              iconClass: "uil uil-file-bookmark-alt",
              label: "Un finished <b>Asset Recordings</b>",
              value: `${Utils.dashboardTaskValue(res.assetRecordings)}  <small>need${res.assetRecordings==1?"s":""} to be recorded</small>`,
            });
          }
          if(res.shortages > 0){
            total += res.shortages;
            tasks.push({
              link: "/purchases/short-delivery",
              classes: "bg-todo-1x",
              iconClass: "uil uil-folder-slash",
              label: "Un resolved <b>Delivery Shortages</b>",
              value: `${Utils.dashboardTaskValue(res.shortages)}  <small>case${res.shortages==1?"s":""}  submitted</small>`,
            });
          }
          if(res.maintenances > 0){
            total += res.maintenances;
            tasks.push({
              link: "/maintenance/schedule",
              classes: "bg-todo-1",
              iconClass: "uil uil-wrench",
              label: "Pending <b>Maintenance Work</b>",
              value: `${Utils.dashboardTaskValue(res.maintenances)}  <small>need${res.maintenances==1?"s":""} approval</small>`,
            });
          }
          if(res.impairments > 0){
            total += res.impairments;
            tasks.push({
              link: "/maintenance/impairments",
              classes: "bg-todo-1x",
              iconClass: "uil uil-image-broken",
              label: "Reported <b>Pending Impairments</b>",
              value: `${Utils.dashboardTaskValue(res.impairments)} <small>need${res.impairments==1?"s":""} attention</small>`,
            });
          }
          thisVm.taskItems = tasks;
          thisVm.totalTasks = total;
        }
      );
    },
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>