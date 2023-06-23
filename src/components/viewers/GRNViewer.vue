<template>
    <div
        class="p-1 w-100 d-flex flex-column"
    >
        <div class="d-flex justify-content-between">
            <div></div>
            <div>
                <span class="text-muted me-1">GRN Number:</span>
                <span class="text-danger text-md text-uppercase">#<b>{{views.grnNumber.value}}</b></span>
            </div>
        </div>
        <div class="d-flex justify-content-center align-items-center "  style="margin: 0px 0px 20px; 0px; border: 1px solid #0000004a">
            <h4 class="m-0" style="padding: 5px 0px;"><b>Goods Received Note</b></h4>
        </div>
        <div class="d-flex justify-content-between align-items-center" style="margin: 10px 0px;" >
            <div class="d-flex flex-grow-1">
                <div class="grn-label" style="min-widthx:105px;">
                    Supplier
                </div>
                <div class="grn-underlined-value">
                    {{order.supplier.name}}
                </div>
            </div>
            <div class="d-flex flex-grow-1">
                <div class="grn-label" style="min-widthx:123px;">
                    Contacts
                </div>
                <div class="grn-underlined-value">
                    {{order.supplier.primary_contact}}
                    {{order.supplier.email.length > 0 ? (' @' + order.supplier.email) : ""}}
                </div>
            </div>
            <div class="d-flex flex-grow-1"> 
                <div class="grn-label" style="min-widthx:46px;">Date</div>
                <div class="grn-underlined-value">
                    {{views.deliveryDate.value}}
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-between align-items-center" style="margin: 10px 0px;" >
            <div class="d-flex flex-grow-1">
                <div class="grn-label">
                    Order Number
                </div>
                <div class="grn-underlined-value">
                    {{order.order_number}}
                </div>
            </div>
            <div class="d-flex flex-grow-1">
                <div class="grn-label">
                    Delivery Location
                </div>
                <div class="grn-underlined-value">
                    {{order.branch.name}}
                </div>
            </div>
            <div class="d-flex flex-grow-1">
                <div class="grn-label">Status</div>
                <div class="grn-underlined-value">
                    {{order.status}}
                </div>
            </div>
        </div>
        <table class="" style="border: 1px solid #0000004a; margin-top: 30px;" cell="1" border-width="1">
            <thead style="border-width: 1px;">
                <tr>
                    <th style="border-width: 1px; text-align: center"></th>
                    <th style="border-width: 1px; text-align: center">Goods</th>
                    <th style="border-width: 1px; text-align: center">Unit Price</th>
                    <th style="border-width: 1px; text-align: center">Ordered QTY</th>
                    <th style="border-width: 1px; text-align: center">Delivered QTY</th>
                    <th style="border-width: 1px; text-align: center">Comments</th>
                </tr>
            </thead>
            <tbody style="border-width: 1px;">
                <tr v-for="(item, index) in rows" :key="index" style="border-width: 1px;" >
                    <td style="border-width: 1px; text-align: center">{{index+1}}</td>
                    <td style="border-width: 1px; text-align: left; padding-left: 10px;">{{item.name.value}}</td>
                    <td style="border-width: 1px; text-align: right; padding-right: 10px;">{{comma(item.unitPrice.value)}}</td>
                    <td style="border-width: 1px; text-align: center">{{comma(item.quantity.value)}}</td>
                    <td style="border-width: 1px; text-align: center">{{comma(item.quantityDelivered.value)}}</td>
                    <td style="border-width: 1px; text-align: left; padding-left: 10px;">{{item.rejectionComment.value}}</td>
                </tr>
            </tbody>
        </table>
        <div class="d-flex justify-content-between align-items-center" style="margin-top: 30px;" >
            <div class="d-flex flex-grow-1"> 
                <div class="grn-label" >Checked By</div>
                <div class="grn-underlined-value">
                    {{views.checkedByName.value}}
                </div>
            </div>
            <div class="d-flex flex-grow-1">
                <!-- <div class="grn-label" style="min-widthx:105px;">
                    Received By
                </div>
                <div class="grn-underlined-value">
                    {{receivedBy}}
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import AddAssetForm from "@/components/forms/AddAssetForm.vue";
import KeyValueList from "@/components/lists/KeyValueList.vue";
import Vm from "@/utils/Vm";
import Utils from "@/utils";

export default {
  components: {
    AddAssetForm,
    KeyValueList,
  },
  props: {
    order: {
      type: Object,
      default: function () {
        return null;
      },
    },
    views: {
      type: Object,
      default: function () {
        return null;
      },
    },
    rows: {
      type: Array,
      default: function () {
        return [];
      },
    },
    receivedBy: {
        type: String,
        default: ""
    }
  },
  methods: {    
    comma(value){
        return Utils.comma(value);
    }
  },
  computed: {
    cmptdDeliveryDate(){
        if(this.views.grnNumber){
            return this.views.grnNumber.value;
        }
        return "";
    }
  }
};
</script>