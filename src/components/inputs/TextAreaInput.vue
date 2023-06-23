<template>
    <div :class="cmptdClasses" >
        <label class="form-label" :for="id">
            <span :class="isRequired?'required-asterick':''">
                {{label}}
            </span>
            <span style="text-end ">
                <span class="text-muted">{{note}}</span>
                <span v-if="tooltip.length > 0">
                    <ToolTip :text="tooltip" />
                </span>
                <span v-else style="min-height:22.2px">
                    &nbsp;
                </span>
            </span>
        </label>
        <textarea 
            :rows="rows"
            :id="id" 
            class="form-control" 
            :class="errors.length > 0? 'has-errors':''"  
            :required="isRequired" 
            :disabled="isDisabled" 
            :placeholder="placeholder"
            aria-describedby="" 
            autofocus=""
            v-model="inputDataModel" ></textarea>
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
export default {
    components: {
      ToolTip
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
        rows: {
            type: String,
            default: "3"
        },
        classes: {
            type: String,
            default: ""
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
        'modelValue': [String, Number],
        note: {
            type: String,
            default: ""
        },
    },
    setup(props, { emit }) { 
        return { 
            inputDataModel: useModelWrapper(props, emit), 
        } 
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
                cls = cls.replace("pt-1","");
            }
            if(this.classes.indexOf("pb-") > -1){
                cls = cls.replace("pb-0","");
            }
            return cls + " " + this.classes;
        }
    }
}
</script>



