<template>
    <MDBCard text="center" class="align-self-stretch w-90">
        <MDBProgress class="m-1" :height="1">
            <MDBProgressBar :value="progressPercentage" bg="success"  />
        </MDBProgress>
        <MDBCardHeader class="pt-0 pb-1">
            <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item" v-for="(page, index) in pages" :key="index">
                    <a class="nav-link" 
                        :class="{active: innerActivePageIndex == index, finised: innerActivePageIndex > index}" 
                        :aria-current="innerActivePageIndex == index" 
                        @click="onClickPageTab($event, page, index)"
                        :disabled="isDisabled || page.isDisabled" 
                        :aria-disabled="isDisabled || page.isDisabled" >
                        <span class="onboarding-step-no">{{page.number}}</span>
                        {{page.title}}
                    </a>
                </li>
                <!--
                this is just as a normal link
                <li class="nav-item">
                    <a class="nav-link" href="#!">Link</a>
                </li>]
                this is an example of a disabled link
                <li class="nav-item">
                    <a
                        class="nav-link disabled"
                        href="#!"
                        tabindex="-1"
                        aria-disabled="true"
                        >Disabled</a>
                </li>
                -->
            </ul>
        </MDBCardHeader>
        <MDBCardBody>
            <slot></slot>
        </MDBCardBody>
        <MDBCardFooter class="d-flex justify-content-between">
            <div>
                <Button label="Previous" :isDisabled="isDisabled" v-if="innerActivePageIndex > 0 && showPreviousBtn === true" @click="onClickPreviousBtn"  /> 
            </div>
            <div class="d-flex flex-row">
                <div>
                    <Button label="Next" :isDisabled="isDisabled" classes="" v-if="innerActivePageIndex < (pages.length - 1)" @click="onClickNextBtn"   /> 
                </div>
                <div class="ms-5 d-flex flex-row">
                    <Button label="Skip" :isDisabled="isDisabled || disableSkipButton" classes="" v-if="innerActivePageIndex < (pages.length - 1)" @click="onClickSkipBtn" /> 
                    <Button label="Finish" :isDisabled="isDisabled || isFinishButtonDisabled" kind="btn-success" classes="" v-if="innerActivePageIndex == (pages.length - 1)" @click="onClickFinishBtn" /> 
                </div>
            </div>
        </MDBCardFooter>
    </MDBCard>
</template>

<script>
import {
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardTitle,
    MDBCardText,
    MDBBtn,
    MDBCardFooter
} from "mdb-vue-ui-kit";
import { MDBProgress, MDBProgressBar } from "mdb-vue-ui-kit";
import Button from "@/components/inputs/Button.vue";

export default {
    components: {
        MDBCard,
        MDBCardBody,
        MDBCardHeader,
        MDBCardTitle,
        MDBCardText,
        MDBBtn,
        MDBProgress,
        MDBProgressBar,
        MDBCardFooter,
        Button
    },
    props: {
        classes: {
            type: String,
            default: ""
        },
        pages: {
            type: Array,
            default: []
        },
        activePage: {
            type: Number,
            default: 0
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        disableAllTabNavigation: {
            type: Boolean,
            default: false
        },
        emitOnly: {
            type: Boolean,
            default: false
        },
        showPreviousBtn: {
            type: Boolean,
            default: true
        },
        isFinishButtonDisabled: {
            type: Boolean,
            default: false
        },
    },
    data(){
        return {
            innerActivePageIndex: 0
        }
    },
    watch:{
        activePage(val){
            this.innerActivePageIndex = val;
        }
    },
    methods: {
        onClickPageTab(e, page, index){
            e.preventDefault();
            if(this.disableAllTabNavigation == true){
                return false;
            }
            if(Object.hasOwnProperty.call(page, "disableTabNavigation") && page.disableTabNavigation === true){
                return false;
            }
            if(index == this.innerActivePageIndex){
                return false;
            }
            this.innerActivePageIndex = index;
            this.$emit('on-page-change', index);
        },
        onClickPreviousBtn(){
            if(this.emitOnly == true){
                var payload = {
                    currentPage: this.pages[this.innerActivePageIndex],
                    activePageIndex: this.innerActivePageIndex
                };
                this.$emit('on-previous', payload);
            }else{
                var newPageIndex = this.innerActivePageIndex - 1;
                if(newPageIndex < 0){
                    newPageIndex = 1;
                }
                this.innerActivePageIndex = newPageIndex;
                this.$emit('on-click-previous-btn', newPageIndex);
            }
        },
        onClickNextBtn(){
            if(this.emitOnly == true){
                var payload = {
                    currentPage: this.pages[this.innerActivePageIndex],
                    activePageIndex: this.innerActivePageIndex
                };
                this.$emit('on-next', payload);
            }else{
                var newPageIndex = this.innerActivePageIndex + 1;
                if(newPageIndex >= this.pages.length){
                    newPageIndex = this.pages.length - 1;
                }
                this.innerActivePageIndex = newPageIndex;
                this.$emit('on-click-next-btn', newPageIndex);
            }
        },
        onClickSkipBtn(){
            if(this.emitOnly == true){
                var payload = {
                    currentPage: this.pages[this.innerActivePageIndex],
                    activePageIndex: this.innerActivePageIndex
                };
                this.$emit('on-skip', payload);
            }else{
                var newPageIndex = this.innerActivePageIndex + 1;
                if(newPageIndex >= this.pages.length){
                    newPageIndex = this.pages.length - 1;
                }
                this.innerActivePageIndex = newPageIndex;
                this.$emit('on-click-skip-btn', newPageIndex);
            }
        },
        onClickFinishBtn(){
            if(this.emitOnly == true){
                var payload = {
                    currentPage: this.pages[this.innerActivePageIndex],
                    activePageIndex: this.innerActivePageIndex
                };
                this.$emit('on-finish', payload);
            }else{
                var newPageIndex = this.innerActivePageIndex + 1;
                if(newPageIndex >= this.pages.length){
                    newPageIndex = this.pages.length - 1;
                }
                this.innerActivePageIndex = newPageIndex;
                this.$emit('on-click-finish-btn', newPageIndex);
            }
        }
    },
    mounted(){
        this.innerActivePageIndex = this.activePage;
    },
    computed:{
        progressPercentage(){
            var pagesLength = this.pages.length;
            return pagesLength > 0?Math.ceil(((this.innerActivePageIndex + 1)/pagesLength)*100):0;
        },
        disableSkipButton(){
            if(this.innerActivePageIndex < this.pages.length){
                var page = this.pages[this.innerActivePageIndex];
                if(Object.hasOwnProperty.call(page, "canSkip") && page.canSkip === false){
                    return true;
                }
            }
            return false;
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
