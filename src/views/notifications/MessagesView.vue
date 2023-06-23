<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-1">
    <div class="w-90">
      <div class="d-flex justify-content-between align-items-center ">
        <h4 class="mb-1">SMS's / Email Messages Sent To You</h4>
      </div>

      <div class="d-flex flex-column border p-1 w-75 bg-light" style="max-height: 550px; min-height: 550px; overflow-y: auto;"> 
        <div 
          v-for="(message, index) in sentMessages"
          :key="index"
          class="notification-item"
          :class="{
            'read-0':  message.displayHighlight
          }"
        >
          <div class="d-flex justify-content-between">
            <div class="d-flex justify-content-start"> 
              <span style="margin-right: 35px;">Date:</span>
              <strong class="text-muted">{{message.send_date}}</strong>
            </div>
            
            <div class="d-flex justify-content-start"> 
              <span class="me-1">Type: </span>
              <strong>{{message.type}}</strong>
            </div>
          </div>

          <div class="d-flex justify-content-between" style="margin-top: 5px;">
            <div class="d-flex justify-content-start"> 
              <span class="me-1">Context: </span>
              <h5><strong>{{message.context}}</strong></h5>
            </div>
            <div class="d-flex justify-content-start"> 
              <span class="me-1">Sent To: </span>
              <strong>{{message.formated_contact}}</strong>
            </div>
            <div class="d-flex justify-content-start"> 
              <span class="me-1">Status: </span>
              <strong>{{message.is_success.toString() == '1'?'Successfully Sent':'Failed'}}</strong>
            </div>
          </div>

          <div class="d-flex justify-content-between" style="margin-top: 5px;">
            <div class="d-flex justify-content-start"> 
              <span style="margin-right: 22px;">Details: </span>
              <strong>{{ (JSON.parse(message.body)).message }}</strong>
            </div>
            <div class="d-flex justify-content-start"> 
              &nbsp;
            </div>
          </div>
        </div>
      </div>
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
      sentMessages: []
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    loadDependencies() {
      var vm = this;
      vm.fetch("messageDependencies", function (thisVm, res) {
        thisVm.sentMessages = res.sentMessages;
      });
    }
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>