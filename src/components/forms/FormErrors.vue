<template>
    <div :class="cmptdClasses">
        <div class="alert alert-danger" role="alert" data-mdb-color="danger" v-if="errors.length > 0">
            <ul class="list-unstyledx mb-0">
                <li v-for="(error,index) in errors" :key="index">
                    {{error}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        errors: {
            type: Array,
            default: function(){
                return [];
            }
        },
        classes: {
            type: String,
            default: ""
        },
    },
    computed:{
        cmptdClasses(){
            var cls = 'ps-2 pe-2 form-errors';
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

<style scoped>
    .form-errors{
        min-height: 42px;
    }
</style>