<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-3">
    
    <div class="w-50 d-flex justify-content-between flex-column bg-light pb-2" style="height: 200px">
      
      <div class="w-100 d-flex justify-content-end align-items-end">
        <KeyValueList :items="basicInfo" classes="d-felx w-100" />
      </div>
      
      <div class="w-100 d-flex justify-content-end align-items-end pe-2">
        <Button
          label="Edit Configs"
          :is-disabled="isLoading"
          @on-click="onClickEditInfoBtn"
        />
      </div>

    </div>

    <SimpleModal
      id="edit-configs-modal"
      title="Edit Genaral Configs"
      v-model="showFormModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      ok-btn-text="Save"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showFormModal=false"
      @on-ok-btn-click="onClickModalOkBtn"
    >
      <EditConfigsForm 
        :is-loading="isLoading"
        @on-show-loader="showLoader" 
        @on-hide-loader="hideLoader"
        @on-session-expired="onSessionExpired"
        @on-success="onFormSuccess"
        :pst="pst"
        :edits="config"
      />
    </SimpleModal>
  </div>
    
</template>

<script>
import KeyValueList from "@/components/lists/KeyValueList.vue";
import Button from "@/components/inputs/Button.vue";
import EditConfigsForm from '@/components/forms/EditConfigsForm.vue';
import SimpleModal from "@/components/modals/SimpleModal.vue";
import Utils from "@/utils";
import Http from "@/utils/Http";
import Vm from "@/utils/Vm";

export default {
  components: {
    KeyValueList,
    Button,
    EditConfigsForm,
    SimpleModal
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      basicInfo: [],
      config: Utils.defaultConfigs(),
      updateFormData: {},
      showFormModal: false,
      pst: 0
    };
  },
  methods: {
    ...Vm.update,
    ...Vm.loaders,
    onClickEditInfoBtn() {
      this.showFormModal =  true;
    },
    onClickModalOkBtn(){
      this.pst += 1;
    },
    onFormSuccess(){
        this.showFormModal =  false;
        this.loadConfig();
    },
    loadConfig(){
        let config = localStorage.getItem("config");
        if(config){
            config = JSON.parse(config);
        }else{
            config =  Utils.defaultConfigs();
        }
        this.config = config;
        this.basicInfo = [
          {
            key: "Alert Upcoming Maintanance",
            value: `${config.upcomingrepair} days before`,
          },
          {
            key: "Alert Missed Maintanance",
            value: `${config.missedrepair} days after`,
          },
          {
            key: "Alert Deprecation Assets",
            value: `${config.depreciation} % below`,
          },
          {
            key: "Currency",
            value: `${config.currency}`,
          },
        ];
    }
  },
  mounted() {
    this.loadConfig();
  },
};
</script>