<template>
  <div>
    <div class="text-start px-1 d-flex justify-content-between">
      <span>
        Issuing Branch:
        <b style="margin-left: 5px">{{ viewItem.fromBranch.name }}</b>
      </span>
      <span>
        Receiving Branch: <b>{{ viewItem.toBranch.name }}</b>
      </span>
    </div>
    <div class="d-flex justify-content-center">
      <hr class="w-90 my-1" />
    </div>
    <div class="text-start px-1 d-flex justify-content-between">
      <span>
        Transfer Date:
        <b v-if="viewItem.transfer_date.length > 0" class="ms-1">{{
          viewItem.transfer_date
        }}</b>
        <b v-else class="ms-1"><i>pending transfer</i></b>
      </span>
      <span> </span>
    </div>
    <div class="text-start px-1 d-flex justify-content-between mt-1">
      <div style="min-width: 126px;">Transfer Notes:</div>
      <div
        class="flex-grow-1 ms-1 p-1 rounded"
        style="background-color: #cccccc0d; min-height: 40px"
      >
        {{ viewItem.transfer_notes }}
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <hr class="w-90" style="margin: 6px 0px; color: #f9fafbde" />
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
          Isuuing Date:
          <b v-if="viewItem.issued_date.length > 0" class="ms-2">{{
            viewItem.issued_date
          }}</b>
          <b v-else class="ms-2"><i>pending issuing</i></b>
        </span>
        <span> </span>
      </div>
      <div class="text-start px-1 d-flex justify-content-between">
        <div style="min-width: 126px;">Isuuing Notes:</div>
        <div
          class="flex-grow-1 ms-1 p-1 rounded text-issued"
          style="background-color: #cccccc0d; min-height: 40px"
        >
          {{ viewItem.issued_notes }}
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <hr class="w-90" style="margin: 6px 0px; color: #f9fafbde" />
      </div>
      <div class="text-start px-1 d-flex justify-content-between">
        <span>
          Receiving Date:
          <b v-if="viewItem.received_date.length > 0" class="ms-1">{{
            viewItem.received_date
          }}</b>
          <b v-else class="ms-1"><i>pending receiving</i></b>
        </span>
        <span> </span>
      </div>
      <div class="text-start px-1 d-flex justify-content-between">
        <div style="min-width: 126px">Receive Notes:</div>
        <div
          class="flex-grow-1 ms-1 p-1 rounded"
          style="background-color: #cccccc0d; min-height: 40px"
        >
          {{ viewItem.received_notes }}
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
</template>

<script >
export default {
  props: {
    viewItem: {
      type: String,
      default: function () {
        return false;
      },
    },
  },
};
</script>