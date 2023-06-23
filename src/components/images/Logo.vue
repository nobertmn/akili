<template>
    <a class="navbar-brand" href="#" v-if="inworkspace" >
        <span class="brand-logo">
            <img :src="logoOnlyUrl" alt="LOGO" />
        </span>
    </a>
    <a class="brand-logo" href="/" v-else >
        <img :src="imgUrl"  alt="LOGO" />
    </a>
</template>


<script>
import imgUrl from '@/assets/mbiglogo.png'
import logoOnlyUrl from '@/assets/mlogo-small.png'
export default {
    props: {
        inworkspace: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            imgUrl: imgUrl,
            logoOnlyUrl: logoOnlyUrl
        }
    }
}
</script>

<style scoped>
    .brand-logo:hover{
        background-color: transparent;
    }
</style>