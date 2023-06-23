<template>
    <div class="page-hero bg1">
        <div class="page-hero-content">
            <h1 class="title">{{title}}
                <!-- Its better to focus on delivering business value to your clients rather 
                than the management of assets.  -->
            </h1>
            <h5 class="sub-title">{{subTitle}}</h5>
            <Button :label="actionLabel" :is-disabled="isLoading" />
        </div>
    </div>
</template>

<script>
import Button from '@/components/inputs/Button.vue'
export default {
    components:{
        Button
    },
    props: {
        title: {
            type: String,
            default: ""
        },
        subTitle: {
            type: String,
            default: ""
        },
        actionLabel: {
            type: String,
            default: "button"
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
    .page-hero{
        flex-grow: 1;
        height: fit-content;
    }
    .page-hero-content{
        flex-grow: 1;
        height: fit-content;
        padding-top: 5rem;
        background-color: #f8f8f870;
    }
    .title{
        font-family: 'Montserrat';
        font-size: 3rem !important;
        font-weight: 700 !important;
        width: 50%;
        margin-bottom: 1.5rem;
    }
    .sub-title{
        font-family: 'Montserrat';
        font-size: 1.3rem !important;
        width: 40%;
        margin-bottom: 2rem;
        background-color: #f8f8f8b5;
        padding: 10px 10px 10px 0px;
        border-radius: 5px;
        box-shadow: 20px 3px 18px 14px #f8f8f88c;
    }
    .bg1 {
        /* background-image: url('https://pixinvent.com/demo/vuexy-html-bootstrap-admin-template/app-assets/images/pages/login-v2.svg'); */
        background-image: url('https://img.freepik.com/free-vector/inheritance-concept-with-people-family-some-wealth-asset-with-modern-isometric-style-vector-illustration_82472-752.jpg?w=1800&t=st=1670557105~exp=1670557705~hmac=fbdea43211756c302ee44b9d69eec44e92e778d3fb8b968ded25f7775d05f55e');
        background-repeat: no-repeat;
        background-position: right;
        background-size:contain;
    }
</style>