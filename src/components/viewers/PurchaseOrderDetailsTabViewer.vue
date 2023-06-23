<template>
  <div v-if="viewItem != null">
    <div class="text-start px-1 d-flex justify-content-between">
      <span> &nbsp; </span>
      <span>
        Order #: <b class="ms-1 text-uppercase">{{ viewItem.order_number }}</b>
      </span>
    </div>
    <div class="text-start px-1 d-flex justify-content-between">
      <span>
        Branch:
        <b style="margin-left: 30px">{{ viewItem.branch.name }}</b>
      </span>
      <span>
        Type:
        <b class="text-uppercase" style="margin-left: 35px">{{
          viewItem.type
        }}</b>
      </span>
    </div>
    <div class="text-start px-1 d-flex justify-content-between">
      <span>
        Total:
        <b style="margin-left: 45px">{{ comma(viewItem.total_amount) }}</b>
      </span>
      <span>
        No Of Items:
        <b style="margin-left: 10px">{{ comma(viewItem.no_of_items) }}</b>
      </span>
      <span>
        Required Date:
        <b style="margin-left: 37px">
          {{ viewItem.required_date }}
        </b>
      </span>
    </div>
    <div class="d-flex justify-content-center">
      <hr class="w-90 my-1" style="color: #ebe9f142" />
    </div>
    <div
      class="text-start px-1 d-flex justify-content-between"
      style="margin-top: 10px"
    >
      <span>
        Supplier:
        <b style="margin-left: 25px">
          {{ viewItem.supplier.name }}
        </b>
      </span>
      <span>
        Contacts:
        <b style="margin-left: 30px">
          {{ viewItem.supplier.primary_contact }}
          {{
            viewItem.supplier.other_contact &
            (viewItem.supplier.other_contact.length > 0)
              ? "/" + viewItem.supplier.other_contact
              : ""
          }}
        </b>
      </span>
    </div>
    <div
      class="text-start px-1 d-flex justify-content-between"
      style="margin-top: 10px"
    >
      <span>
        Address:
        <b style="margin-left: 25px">
          {{ viewItem.supplier.address }}
        </b>
      </span>
      <span> &nbsp; </span>
    </div>
    <div class="d-flex justify-content-center">
      <hr class="w-90 my-1" style="colors: #ebe9f142" />
    </div>
    <div class="text-start px-1 d-flex justify-content-between mt-1">
      <div style="min-width: 126px">Remarks:</div>
      <div
        class="flex-grow-1 ms-1 p-1 rounded"
        style="background-color: #cccccc0d; min-height: 40px"
      >
        {{ viewItem.notes }}
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <hr class="w-90 my-1" style="color: #ebe9f142" />
    </div>
    <div v-if="viewItem.status != 'rejected'">
        <div class="text-start px-1 d-flex justify-content-between">
            <span>
            Approval Date:
            <b v-if="viewItem.approved_date.length > 0" class="ms-1">{{
                viewItem.approved_date
            }}</b>
            <b v-else class="ms-1"><i>pending approval</i></b>
            </span>
            <span> </span>
        </div>
        <div class="text-start px-1 d-flex justify-content-between">
            <div style="min-width: 126px;">Approval Notes:</div>
            <div
                class="flex-grow-1 ms-1 p-1 rounded text-success"
                style="background-color: #cccccc0d; min-height: 40px"
            >
                {{ viewItem.approval_notes }}
            </div>
        </div>
        <div class="d-flex justify-content-center">
            <hr class="w-90" style="margin: 6px 0px; color: #f9fafbde" />
        </div>
        <div class="text-start px-1 d-flex justify-content-between">
            <span>
            Delivery Date:
            <b v-if="viewItem.delivery_date.length > 0" class="ms-2">{{
                viewItem.delivery_date
            }}</b>
            <b v-else class="ms-2"><i>pending delivery</i></b>
            </span>
            <span> </span>
        </div>
        <div class="text-start px-1 d-flex justify-content-between">
            <div style="min-width: 126px;">Delivery Notes:</div>
            <div
            class="flex-grow-1 ms-1 p-1 rounded text-issued"
            style="background-color: #cccccc0d; min-height: 40px"
            >
            {{ viewItem.delivery_notes }}
            </div>
        </div>
    </div>
    <div v-else>
      <div class="text-start px-1 d-flex justify-content-between">
        <span>
          Rejected Date: <b class="ms-1">{{ viewItem.rejected_date }}</b>
        </span>
        <span> </span>
      </div>
      <div class="text-start px-1 d-flex justify-content-between">
        <div class="me-2" style="min-width: 126px">Reason:</div>
        <div
          class="flex-grow-1 ms-0 p-1 rounded text-danger"
          style="background-color: #cccccc0d; min-height: 40px"
        >
          {{ viewItem.rejected_notes }}
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <!-- nothing -->
  </div>
</template>

<script >
import Utils from "@/utils/";
export default {
  props: {
    viewItem: {
      type: Object,
      default: function () {
        return null;
      },
    },
  },
  methods: {
    comma(val) {
      return Utils.comma(val);
    },
  },
};
</script>