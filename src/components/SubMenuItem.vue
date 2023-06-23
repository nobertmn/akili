<template>
    <div class="sub-menu-item" :class="{active: item.isActive}" :id="item.id" @click="onClick">
        <div class="icon-wrapper">
            <i :class="'font-medium-3 ' + item.iconClass"></i>
        </div>
        <div class="title" v-html="item.title"></div>
        <ToolTip v-if="item.tooltip.length > 0" :text="item.tooltip"  />
    </div>
</template>


<script >
import ToolTip from '@/components/ToolTip.vue'
export default {
  components: {
    ToolTip
  },
  props: {
    item:{
      type: Object,
      default: function(){
        return {
          title: "",
          iconClass: "uil uil-bright",
          tooltip: "",
          link: "",
          id: "",
          roleIds: [],
          isActive: false
        }
      }
    }
  },
  methods:{
    onClick(){
      this.$router.push(this.item.link);
    }
  }
}
</script>