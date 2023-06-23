<template>
    <Button
        :classes="' ' + classes" 
        @click.prevent="onClick" 
        :type="type"
        :is-disabled="isDisabled"
        :kind="kind" >
        <slot></slot> {{label}} 
    </Button>
</template>

<script>
import Button from '@/components/inputs/Button.vue'
export default {
    components: {
        Button
    },
    props: {
        kind: {
            type: String,
            default: "btn-primary"
        },
        label: {
            type: String,
            default: ""
        },
        classes: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: "button"
        },
        isDisabled: {
            type: Boolean,
            default: false
        }
    },
    methods:{
        onClick(event){
            event.preventDefault();
            this.$emit('on-click', event);
        }
    }
}
</script>
