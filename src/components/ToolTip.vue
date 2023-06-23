<template>
    <MDBTooltip v-model="tooltip1" tag="a" :maxWidth="250">
        <template #reference>
            <i class="tooltip-icon uil uil-info-circle font-medium-1 "></i>
        </template>
        <template #tip>{{text}}</template>
    </MDBTooltip>
</template>

<script>
import { MDBTooltip } from "mdb-vue-ui-kit";
import { ref } from 'vue';
export default {
    components: {
      MDBTooltip
    },
    props: ["text"],
    data(){
        return {
            tooltip1: ref(false)
        }
    }
}
</script>