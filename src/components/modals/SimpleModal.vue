<template>
    <MDBModal
        :id="id"
        tabindex="-1"
        :labelledby="id + 'Tile'"
        v-model="inputDataModel"
        staticBackdrop
        :size="size"
        @hidden="onHidden"
    >
        <MDBModalHeader :close="showTopCloseBtn" v-if="!isHeadless">
            <MDBModalTitle :id="id + 'Tile'">
                <b>{{title}}</b>
            </MDBModalTitle>
        </MDBModalHeader>
        <MDBModalBody :class="{headless: isHeadless}">
            <slot></slot>
        </MDBModalBody>
        <MDBModalFooter v-if="!isHeadless">
            <div class="d-flex w-100 justify-content-between">
              <div>
                <slot name="leftfooter"></slot>
              </div>
              <div :style="'width:'+(120+parseInt(okBtnWidth))+'px; text-align:right;'">
                <MDBBtn style="width:83px; height:40px;" v-if="showCloseBtn" color="secondary" @click="onCloseBtnClick" class="me-1"> {{closeBtnText}} </MDBBtn>
                <MDBBtn :style="'width:'+okBtnWidth+'; height:40px;'" v-if="showOkBtn" :color="okBtnColor" @click="onOkBtnClick">{{okBtnText}}</MDBBtn>
              </div>
            </div>
        </MDBModalFooter>
    </MDBModal>
</template>

<script >
import {
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn,
} from 'mdb-vue-ui-kit';
import { useModelWrapper } from '@/utils/modelWrapper'
import {ref} from 'vue'

export default {
  components: {
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn,
  },
  props: {
    showTopCloseBtn: {
      type: Boolean,
      default: true,
    },
    showCloseBtn: {
      type: Boolean,
      default: true,
    },
    closeBtnText: {
      type: String,
      default: "Close",
    },
    showOkBtn: {
      type: Boolean,
      default: true,
    },
    okBtnText: {
      type: String,
      default: "Ok",
    },
    id: {
      type: String,
      default: "",
      required: true
    },
    closeOnOkBtnClick: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    okBtnWidth: {
      type: String,
      default: "100px",
    },
    size: {
      type: String,
      default: "sm",
    },
    'modelValue': {
      type: Boolean,
      default: false
    },
    isHeadless: {
      type: Boolean,
      default: false,
    },
    okBtnColor: {
      type: String,
      default: "primary"
    }
  },
  setup(props, { emit }) { 
    return { 
      inputDataModel: useModelWrapper(props, emit), 
      onCloseBtnClick(){
        props.inputDataModel = false;
        emit('on-close-btn-click')
      },
      onOkBtnClick() {
        if(props.closeOnOkBtnClick == true){
          props.inputDataModel = false;
        }
        emit('on-ok-btn-click')
      },
      onHidden(){
        props.inputDataModel = false;
        emit('on-hidden')
      }
    } 
  }
};
</script>
