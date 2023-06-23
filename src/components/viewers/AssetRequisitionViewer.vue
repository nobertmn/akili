<template>
  <CardContainer
    :hasShadow="false"
    :show-title="false"
    :show-sub-title="false"
    classes="mb-0"
  >
    <div class="d-flex flex-column w-100  " 
        v-if="viewItem != null" 
        :style="cmptStyle"
        :class="viewContext == 'collect'?'pt-0 pb-0 ps-1 pe-1': 'p-2'" >
        <div class="d-flex justify-content-between">
            <div class="flex-grow-1" >
                <div class="inline-block text-muted me-1" style="min-width:146px; display: inline-block;" >STATUS:</div> 
                <span class="text-uppercase">
                    <b :class="'request-status-' + viewItem.status">{{viewItem.status}}</b>
                </span>
            </div>
            <div>
                <span class="text-muted me-1">POSTED DATE:</span> {{phpTimeToDateStr(viewItem.time_inserted)}}
            </div>
        </div>
        <div class="d-flex justify-content-between">
            <div class="flex-grow-1" v-if="viewItem.status == 'returned'">
                <span class="text-muted me-1" style="min-width:146px; display: inline-block;">RETURNED ON:</span> 
                <span class="text-uppercase">
                    <b>{{viewItem.returned_date}}</b>
                </span>
            </div>
            <div class="flex-grow-1" v-else>
                <span class="text-muted me-1" style="min-width:146px; display: inline-block;">REQUIRED BEFORE:</span> 
                <span class="text-uppercase">
                    <b>{{viewItem.required_before_date}}</b>
                </span>
            </div>
            <div class="font-md" v-if="viewContext != 'collect'">
                <span class="text-muted me-1">POSTED BY:</span> 
                <b class="text-capitalize">{{viewItem.user.name}}</b>
            </div>
            <div class="font-md" v-else>
                <span class="text-muted me-1">REQUESTED BY:</span> 
                <span class="badge badge-light text-capitalize">
                    {{viewItem.requesters_name}} / 
                    {{viewItem.requesters_contact}}
                </span>
            </div>
        </div>
        <h4 class="mt-1 border-bottom border-top pb-1 pt-1 mt-2">
            <b class="text-muted me-2">RE:</b> 
            <span v-if="viewContext == 'reject'">REJECTING </span>
            <span v-if="viewContext == 'approve'">APPROVING </span>
            <span v-if="viewContext == 'collect'">AllOCATING </span>
            <span v-if="viewContext == 'return'">RETURNING </span>
            REQUEST FOR ASSET - 
            <span class="badge badge-primary">{{viewItem.asset.name}}</span>
        </h4>
        <div class="pt-2 flex-grow-1" v-if="viewContext == 'view'">
            <div class="lead mb-5px" >
                <span class="badge badge-light text-capitalize">
                    {{viewItem.requesters_name}} / 
                    {{viewItem.requesters_contact}}
                </span>
                Is requesting for this asset to be allocated to Him/Her before the specified date above
            </div>
            <div class="lead mb-5px" v-if="viewItem.proposed_return_date.length > 0">
                It will be returned on 
                <span class="badge badge-light text-capitalize">{{viewItem.proposed_return_date}}</span>
                <span v-if="allocations.length > 0">
                  . Current custodian is 
                  <span class="badge badge-light text-capitalize">
                    {{allocations[0].custodian.name}} / {{allocations[0].custodian.contact}}
                  </span>
                </span>
            </div>
            <div class="lead mb-5px" v-else>
                The requester did not propose any return date for the asset. 
            </div>
            <div class="lead mb-5px w-100" >
                <div class="d-flex flex-row">
                    <div class="pe-2" style="min-width:200px;">
                        Reason for request:
                    </div>
                    <div class="flex-grow-1">
                        {{viewItem.reason}}
                    </div>
                </div>
            </div>
            <div class="lead mb-5px w-100" v-if="viewItem.status == 'rejected'" >
                <div class="d-flex flex-row">
                    <div class="pe-2" style="min-width:200px;" >
                        Reason for rejection:
                    </div>
                    <div class="flex-grow-1 text-danger">
                        {{viewItem.rejected_notes}}
                    </div>
                </div>
            </div>
            <div class="lead mb-5px w-100" v-if="(viewItem.status == 'approved' || viewItem.status == 'collected' ) && viewItem.approval_notes.length > 0 " >
                <div class="d-flex flex-row">
                    <div class="pe-2" style="min-width:200px;" >
                        Approval Note:
                    </div>
                    <div class="flex-grow-1 text-success">
                        {{viewItem.approval_notes}}
                    </div>
                </div>
            </div>
            <div class="lead mb-5px w-100" v-if="viewItem.status == 'collected' && viewItem.collection_notes.length > 0 " >
                <div class="d-flex flex-row">
                    <div class="pe-2" style="min-width:200px;" >
                        Allocation Note:
                    </div>
                    <div class="flex-grow-1 text-success">
                        {{viewItem.collection_notes}}
                    </div>
                </div>
                <div class="d-flex flex-row">
                    <div class="pe-2" style="min-width:200px;" >
                        Collected On:
                    </div>
                    <div class="flex-grow-1">
                        {{viewItem.collection_date}}
                    </div>
                </div>
            </div>
            <div class="lead mb-1 mt-1 w-100" v-if="supportDocuments.length > 0" >
              <div class="d-flex flex-row">
                    <div class="pe-2 text-muted">
                        Supported Documents:
                    </div>
                    <div class="flex-grow-1">
                        
                    </div>
              </div>
              <div class="d-flex flex-row justify-content-start flex-wrap">
                <div 
                  v-for="(supportDocument, docIndex) in supportDocuments"
                  :key="docIndex"
                  class=" d-flex bg-light p-1 has-support-doc-download-btn"
                  style="margin: 5px; 5px; 0px; 0px;"
                  @click.prevent="onClickDownloadDoc(supportDocument)"
                  >
                  <div >
                    <span>
                      <i :class="iconRefs[supportDocument.type]" style="font-size:50px;" ></i>  
                    </span>
                  </div>
                  <div style="width:150px; padding: 0px 5px 0px 5px; ">
                    {{supportDocument.name}}
                  </div>
                  <div class="support-doc-download-btn">
                    <i class="far fa-arrow-alt-circle-down"></i>
                  </div>
                </div>
                
              </div>
            </div>
            <!-- {{ viewItem }} -->
        </div>
    </div>
  </CardContainer>
</template>

<script >
import CardContainer from "@/components/containers/CardContainer.vue";
import StepperContainer from "@/components/containers/StepperContainer.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils/";
import { MDBBadge } from "mdb-vue-ui-kit";

export default {
  components: {
    CardContainer,
    StepperContainer,
    MDBBadge
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    classes: {
      type: String,
      default: "",
    },
    views: {
      type: Object,
      default: function () {
        return null;
      },
    },
    viewContext: {
      type: String,
      default: "view",
    },
  },
  data() {
    return {
      pages: [
        {
          title: "Request Details",
          number: 1,
          canSkip: false,
        },
        {
          title: "Support Documents",
          number: 2,
          canSkip: false,
        },
        {
          title: "Asset Details",
          number: 3,
          canSkip: false,
        },
      ],
      activePageIndex: 0,
      viewItem: null,
      allocations: [],
      supportDocuments: [],
      iconRefs: Utils.fileTypeIconRef(),
    };
  },
  methods: {
    ...Vm.fetch,
    ...Vm.loaders,
    loadDependencies() {
      let vm = this;
      vm.fetchItem(
        "requisitionViewDetails",
        vm.viewItem,
        function (thisVm, res) {
          thisVm.viewItem = res.requisition;
          thisVm.allocations = res.allocations;
          thisVm.supportDocuments = res.supportDocuments;
        }
      );
    },
    onPageChange(page) {
      this.activePageIndex = parseInt(page);
    },
    phpTimeToDateStr(phpTime) {
      return Utils.phpTimeToJsDateString(phpTime);
    },
    onClickDownloadDoc(supportDocument){
      let vm = this;
      vm.downloadFile(supportDocument.link);
    }
  },
  computed:{
    cmptStyle(){
      let s  = "min-height: 500px;";
      if(this.viewContext != "view"){
        s = "min-height: 170px;";
        if(this.viewContext == "collect"){
          s = "min-height: 116px;";
        }
      }
      return s;
    }
  },
  mounted() {
    this.viewItem = {
      ...this.views,
    };
    this.loadDependencies();
  },
};
</script>
