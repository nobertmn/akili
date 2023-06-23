<template>
    <div class="m-2">
        <p class="text-left" :classes="classes">
            <span class="link-text">{{text}}</span>
            <a :href="url" :class="isDisabled?'disabled':''"  >
                <span>{{label}}</span>
            </a>
        </p>
    </div>
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
        label: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: ""
        },
        text: {
            type: String,
            default: ""
        },
        isDisabled: {
            type: Boolean,
            default: false
        }
    }
}
</script> : {
            type: Boolean,
            default: false
        }

<style scoped>
    .link-text{
        color: #5e5873;
        padding-right: 5px;
    }
</style>