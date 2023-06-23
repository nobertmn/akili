<template>
  <main class="main-container" @mousemove="onLastInteractionTime">
    <FullPageLoader />
    <TopProgressBarLoader :show="showProgressbar" />
    <RouterView 
      :is-loading="isLoading"
      @on-show-loader="showLoader" 
      @on-hide-loader="hideLoader" 
      @on-session-expired="onSessionExpired"
      :user="user"
    />
    <SimpleModal
      id="timeoutModal"
      title="Your Session Timedout Due To Inactivity"
      v-model="hasTimedOut"
      :show-close-btn="false"
      :show-ok-btn="false"
      ok-btn-text="Login To Continue"
      @on-ok-btn-click="onClickTimeoutLoginBtn"
      :show-top-close-btn="false"
      ok-btn-width="200px;"
      :is-headless="true"
    >
      <LoginForm
          :is-headless="true"
          :is-loading="isLoading"
          @on-show-loader="showLoader" 
          @on-hide-loader="hideLoader"
          @on-session-expired="handleSessionExpired"
          @on-success="onLoginSuccess"
          title="Login to continue"
          sub-title="Your sessions, timedout due to inactivity"
        />
    </SimpleModal>
  </main>
</template>

<script>
import { RouterView } from 'vue-router'
import FullPageLoader from '@/components/loaders/FullPageLoader.vue'
import TopProgressBarLoader from '@/components/loaders/TopProgressBarLoader.vue'
import SimpleModal from "@/components/modals/SimpleModal.vue";
import LoginForm from '@/components/forms/LoginForm.vue'
import Utils from "@/utils"


export default {
  components:{
    RouterView,
    FullPageLoader,
    TopProgressBarLoader,
    SimpleModal,
    LoginForm
  },
  data(){
    return {
      showProgressbar: false,
      isLoading: false,
      hasTimedOut: false,
      authPaths: [
        '',
        '/',
        '/register',
        '/activate-account',
        '/forgot-password',
        '/reset-password',
        //nyd: add more auth page routes here
        '/dashboard',
        //nyd
        //these are stupposed to time out but will not for now as the feature is still under development
        '/onboarding/1',
        '/onboarding/2',
        '/onboarding/3',
        '/onboarding/4',
        '/onboarding/5',
        '/onboarding/6'
      ],
      minutesToTimeOut: 5,
      user: Utils.defaultUser()
    }
  },
  methods: {
    showLoader(){
      this.showProgressbar = true;
      this.isLoading = true;
    },
    hideLoader(){
      this.showProgressbar = false;
      this.isLoading = false;
    },
    onSessionExpired(payload){
      if(this.authPaths.indexOf(this.$route.path.toLowerCase()) >= 0){
        //delete the token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        //redirect to the login page
        this.$router.push("/");
      }
    },
    onLastInteractionTime(e){
      return false;
      var vm = this;
      e.preventDefault();
      if(vm.hasTimedOut == false){
        var d = new Date();
        var nowSeconds = d.getTime();
        var timex = localStorage.getItem("timex");
        if(timex){
          var diff = nowSeconds - parseFloat(timex);
          var timeout = vm.minutesToTimeOut * 60000;
          //prevent this time put on authpages
          if(diff > timeout && vm.authPaths.indexOf(vm.$route.path.toLowerCase()) == -1){
            //delete the token
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            vm.user = Utils.defaultUser();
            //show timeout overlay
            vm.hasTimedOut = true;
          }else{
            localStorage.setItem("timex", nowSeconds);
          }
        }else{
          localStorage.setItem("timex", nowSeconds);
        }
      }
    },
    onClickTimeoutLoginBtn(){
      
    },
    handleSessionExpired(){

    },
    onLoginSuccess(){
      this.hasTimedOut = false;
      this.recordTimeNow();
      let userStr = localStorage.getItem("user");
      this.user = JSON.parse(userStr);
      //refresh the entire broswer window
      window.location.reload();
    },
    recordTimeNow(){
      var d = new Date();
      var nowSeconds = d.getTime();
      localStorage.setItem("timex", nowSeconds);
    }
  },
  mounted(){
    let userStr = localStorage.getItem("user");
    if(userStr == null){
      this.user = Utils.defaultUser();
    }else{
      this.user = JSON.parse(userStr);
    }
    this.recordTimeNow();
  }
}
</script>
