<template>
    <div class="m-2 " :class="isDisabled?'is-disabled':''">
        <Button 
            :label="label" 
            :classes="'w-100 ' + classes" 
            @click="$emit('on-click')" 
            :type="type"
            :is-disabled="isDisabled" />
    </div>
</template>

<script>
import Button from '@/components/inputs/Button.vue'
export default {
    components: {
        Button
    },
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
        isDisabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>
