<template>
    <div :class="cmptdClasses" >
        <label class="form-label" :for="id">
            <span :class="isRequired?'required-asterick':''">
                {{label}}
            </span>
            <span v-if="tooltip.length > 0">
                <ToolTip :text="tooltip" />
            </span>
        </label>
        <div>
          <model-select
            :options="items"
            :isError="errors.length > 0"
            :isDisabled="isDisabled"
            placeholder="search and select ..."
            :id="id"
            @searchchange="onSearchChange"
            @blur="onSearchBlur"
            v-model="inputDataModel"
            :optionText="label"
          >
          </model-select>
        </div>
        <slot name="below"></slot>
        <div class="input-errors">
            <!-- <span v-for="(error,index) in errors" :key="index">
                {{(index> 0 && index <= errors.length)?', ': ''}} {{error}} 
            </span> -->
            <span v-if="errors.length > 0" >
                {{errors[0]}} 
            </span>
        </div>
    </div>
</template>

<script>
//https://vanoneang.github.io/article/v-model-in-vue3.html#turn-it-into-a-composable
import { useModelWrapper } from '@/utils/modelWrapper'
import ToolTip from '@/components/ToolTip.vue'
import { ModelSelect } from "vue-search-select"
export default {
    components: {
      ToolTip,
      ModelSelect
    },
    props: {
        label: {
            type: String,
            default: ""
        }, 
        placeholder: {
            type: String,
            default: ""
        }, 
        id: {
            type: String,
            default: ""
        }, 
        type: {
            type: String,
            default: "text"
        },
        tooltip: {
            type: String,
            default: ""
        },
        errors: {
            type: Array,
            default: function(){
                return [];
            }
        },
        isRequired: {
            type: Boolean,
            default: true
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        items: {
            type: Array,
            default: function(){
                return [];
            }
        },
        classes: {
            type: String,
            default: ""
        },
        'modelValue': {
            type: [String, Number],
            default: null
        }
    },
    setup(props, { emit }) { 
        return { 
            inputDataModel: useModelWrapper(props, emit), 
        } 
    },
    methods: {
        onSearchChange(searchTerm){
            // console.log("Yo search changed", searchTerm);
        },
        onSearchBlur(val){
            //
        },
    },
    computed:{
        cmptdClasses(){
            var cls = 'input-field-wrapper ps-2 pe-2 pt-1 pb-0 ';
            if(this.classes.indexOf("ps-") > -1){
                cls = cls.replace("ps-2","");
            }
            if(this.classes.indexOf("pe-") > -1){
                cls = cls.replace("pe-2","");
            }
            if(this.classes.indexOf("pt-") > -1){
                cls = cls.replace("pt-2","");
            }
            if(this.classes.indexOf("pb-") > -1){
                cls = cls.replace("pb-2","");
            }
            return cls + " " + this.classes;
        }
    }
}
</script>
