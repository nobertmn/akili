<template>
    <div :class="cmptdClass" >
        <div class="col-12 mx-auto">
            <!--!-->
            <h4 v-if="showTitle" class="card-title fw-bold mb-0 ps-2 pt-2 pe-2 " :class="subTitle.length > 0 ?' pb-1':''">{{title}}</h4>
            <!--!-->
            <p v-if="showSubTitle" class="card-text mb-0 ps-2  pe-2 " :class="subTitle.length > 0 ?' pb-1':''">{{subTitle}}</p>
            <div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: "",
        },
        subTitle: {
            type: String,
            default: "",
        },
        hasShadow: {
            type: Boolean,
            default: true,
        },
        isAppCard: {
            type: Boolean,
            default: true,
        },
        classes: {
            type: String,
            default: "",
        },
        showTitle: {
            type: Boolean,
            default: true,
        },
        showSubTitle: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        cmptdClass(){
            let cls = "d-flex bg-white rounded-3 mb-2";
            if(this.classes.indexOf('mb-') >= 0){
                cls = cls.replace("mb-2", "");
            }
            if(this.hasShadow){
                cls = cls + " shadow-4 ";
            }
            if(this.isAppCard){
                cls = cls + " app-card ";
            }
            cls = cls + " " + this.classes;
            return cls;
        }
    }
    
}
</script>

<style scoped>
    .card-title{
        font-family: 'Montserrat';
        font-size: 1.5rem !important;
        font-weight: 700 !important;
    }

    .app-card{
        height: fit-content;
    }
</style>
