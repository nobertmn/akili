<template>
  <div v-if="viewItem != null">
    <div class="text-start px-1 d-flex justify-content-between">
      <span>
        Disposing Branch:
        <b style="margin-left: 5px">{{ viewItem.branch.name }}</b>
      </span>
      <span>
        Total Asset's Value: <b class="ms-1">{{comma(viewItem.total_assets_value)}}</b>
      </span>
    </div>
    <div class="d-flex justify-content-center">
      <hr class="w-90 my-1" />
    </div>
    <div class="text-start px-1 d-flex justify-content-between mt-1">
      <div style="min-width: 126px;">Remarks:</div>
      <div
        class="flex-grow-1 ms-1 p-1 rounded"
        style="background-color: #cccccc0d; min-height: 40px"
      >
        {{ viewItem.notes }}
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
          Disposal Date:
          <b v-if="viewItem.disposal_date.length > 0" class="ms-2">{{
            viewItem.disposal_date
          }}</b>
          <b v-else class="ms-2"><i>pending disposal</i></b>
        </span>
        <span> </span>
      </div>
      <div class="text-start px-1 d-flex justify-content-between">
        <div style="min-width: 126px;">Disposal Notes:</div>
        <div
          class="flex-grow-1 ms-1 p-1 rounded text-issued"
          style="background-color: #cccccc0d; min-height: 40px"
        >
          {{ viewItem.disposal_notes }}
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
  methods:{
      comma(val){
          return Utils.comma(val);
      }
  }
};
</script>