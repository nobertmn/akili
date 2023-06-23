<template>
    <button 
        class="btn " 
        :class="kind + ' ' + classes" 
        @click="$emit('on-click')"
        :type="type" 
        :disabled="isDisabled">
            <slot>{{label}}</slot> 
    </button>
</template>

<script>
export default {
    props: {
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
        kind: {
            type: String,
            default: "btn-primary"
        },
        isDisabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>