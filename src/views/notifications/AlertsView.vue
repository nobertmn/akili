<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-90">
      <div class="d-flex justify-content-between align-items-center ">
        <h4 class="mb-1">System Notifications & Alerts</h4>
      </div>

      <div class="d-flex flex-column border p-1 w-75 bg-light" style="max-height: 550px; min-height: 550px; overflow-y: auto;"> 
        <div 
          v-for="(notification, index) in notifications"
          :key="index"
          class="notification-item"
          :class="{
            'read-0':  notification.displayHighlight
          }"
        >
          <div class="d-flex justify-content-between">
            <div class="d-flex justify-content-start"> 
              <span style="margin-right: 24px;">Date:</span>
              <strong class="text-muted">{{notification.created_date}}</strong>
            </div>
            <div class="d-flex justify-content-start"> 
              <span class="me-1">Type: </span>
              <strong>{{notification.type}}</strong>
            </div>
          </div>

          <div class="d-flex justify-content-between" style="margin-top: 5px;">
            <div class="d-flex justify-content-start"> 
              <span class="me-1">Target: </span>
              <h5><strong>{{notification.title}}</strong></h5>
            </div>
            <div class="d-flex justify-content-start"> 
              &nbsp;
            </div>
          </div>

          <div class="d-flex justify-content-between" style="margin-top: 5px;">
            <div class="d-flex justify-content-start"> 
              <span style="margin-right: 22px;">Topic: </span>
              <h6><strong>{{notification.sub_title}}</strong></h6>
            </div>
            <div class="d-flex justify-content-start"> 
              &nbsp;
            </div>
          </div>

          <div class="d-flex justify-content-between" style="margin-top: 5px;">
            <div class="d-flex justify-content-start"> 
              <span style="margin-right: 13px;">Details: </span>
              <strong>{{notification.details}}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vm from "@/utils/Vm";

let getFormData = function () {
  return {
    latestReadNotificationId: {
      id: "alerts-last-read-id-input",
      label: "",
      tooltip: "",
      value: -1,
      isValid: null,
      validations: {},
      ref: "last_seen_notification_id",
    }
  };
};

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
      notifications: [],
      errors: [],
      formData: getFormData(),
      isFormSubmitting: false,
      isUpdateNecessary: false
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.update,
    loadDependencies() {
      var vm = this;
      vm.fetch("alertsDependencies", function (thisVm, res) {
        thisVm.formData.latestReadNotificationId.value = res.latestReadNotificationId;
        thisVm.isUpdateNecessary = res.isUpdateNecessary;
        //new notification go on top
        thisVm.notifications = res.notifications.concat(thisVm.notifications);
        thisVm.removeHightlights();
      });
    },
    removeHightlights(){
      var vm = this;
      //after some few seconds, remove highlights
      setTimeout(function(){
        var updatedItems = [];
        for (let index = 0; index < vm.notifications.length; index++) {
          var notification = { ... vm.notifications[index] };
          notification.displayHighlight = false;
          updatedItems.push(notification);
        }
        vm.notifications = updatedItems;
        //update the last read notification
        vm.updateLastReadNotification();
      }, 500);
    },
    updateLastReadNotification(){
      var vm = this;
      if(vm.formData.latestReadNotificationId.value != -1 && vm.isUpdateNecessary == true){
        var userStr = localStorage.getItem("user");
        var user = JSON.parse(userStr);
        vm.update("updateLastReadNotificationId", "formData", user.id, function (thisVm, res) {
          //successfully marked the last read id
        });
      }
    }
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>