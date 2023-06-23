<template>
    <div class="top-progress-bar">
      <MDBProgress :height="2" v-if="show">
        <MDBProgressBar :value="value" striped animated />
      </MDBProgress>
    </div>
</template>

<script>
  import { MDBProgress, MDBProgressBar } from "mdb-vue-ui-kit";
  export default {
    components: {
      MDBProgress,
      MDBProgressBar
    },
    props: {
      step: {
        type: Number,
        default: 2
      },
      show:{
        type: Boolean,
        default: false
      },
    },
    data(){
      return {
        value: 0,
        innerShow: false,
        ticker: null
      }
    },
    watch:{
      show(val){
        if(val == true && this.innerShow == false){
          //start from zero
          this.value = 0;
          this.innerShow = true;
          this.tick();
        }else if(val == true && this.innerShow == true){
          //just continue ticking
          this.tick();
        }else if(val == false){
          //stop
          this.value = 0;
          this.innerShow = false;
          clearInterval(this.ticker);
          this.ticker = null;
        }
      }
    },
    methods: {
      tick: function(){
        var vm = this;
        vm.ticker = setInterval(() => {
          if(vm.value < 101){
            vm.value = vm.value + vm.step;
            vm.tick();
          }
        }, 1500);
      }
    }
  };
</script>