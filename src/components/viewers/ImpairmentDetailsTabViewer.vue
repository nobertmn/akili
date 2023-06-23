<template>
  <div v-if="viewItem != null">
    <div class="text-start px-1 d-flex justify-content-between">
      <span>
        ASSET #:
        <b class="ms-1 text-uppercase">
          {{ viewItem.identifier_number }}
          {{
            viewItem.identifier_number && viewItem.identifier_number.length > 0
              ? "-"
              : ""
          }}
          {{ viewItem.asset.name }}
        </b>
      </span>
      <span>
        Type:
        <b class="text-uppercase" style="margin-left: 35px">{{viewItem.type}}</b>
      </span>
    </div>
    <div class="text-start px-1 d-flex justify-content-between">
      <span>
        Reported Asset Condition:
        <b class="text-capitalize" style="margin-left: 12px">{{ viewItem.asset_condition }}</b>
      </span>
      <span>
        Status:
        <b class="text-uppercase" style="margin-left: 35px">
            {{  viewItem.status }}
        </b>
      </span>
    </div>
    <div class="text-start px-1 d-flex justify-content-between">
      <span>
        Custodian:
        <b style="margin-left: 12px">
          {{viewItem.custodian ?  viewItem.custodian.name : '------' }}
        </b>
      </span>
      <span>
        Contact:
        <b class="" style="margin-left: 35px">
             {{viewItem.custodian ?  viewItem.custodian.contact : '------' }}
        </b>
      </span>
    </div>
    <br/>
    <div class="text-start px-1 d-flex justify-content-between">
      <span>
        Occurence Date:
        <b style="margin-left: 12px">{{ viewItem.occured_date && viewItem.occured_date.length > 0 ? viewItem.occured_date : '....' }}</b>
      </span>
      <span>
        Impairment Value:
        <b class="" style="margin-left: 35px">
            {{ comma(viewItem.impairment_value_amount) }}
        </b>
      </span>
    </div>
    <div class="text-start px-1 d-flex justify-content-between"
        v-if="viewItem.status == 'approved'"
    >
      <span>
        Debit Account:
        <b style="margin-left: 12px">
            {{ viewItem.debit_account ? viewItem.debit_account.name : 'pending approval' }}
        </b>
      </span>
      <span>
        Credit Account:
        <b class="" style="margin-left: 35px">
            {{ viewItem.credit_account ? viewItem.credit_account.name : 'pending approval' }}
        </b>
      </span>
    </div>
    <div class="d-flex justify-content-center">
      <hr class="w-90 my-1" style="colors: #ebe9f142" />
    </div>
    <div class="text-start px-1 d-flex justify-content-between mt-1">
      <div style="min-width: 200px; width: 200px;">Notes:</div>
      <div
        class="flex-grow-1 ms-1 p-1 rounded"
        style="background-color: #cccccc3b; min-height: 40px"
      >
        {{ viewItem.notes }}
      </div>
    </div>
    <div v-if="viewItem.status != 'rejected'">
        <div class="text-start px-1 d-flex justify-content-between mt-1">
            <div style="min-width: 200px; width: 200px;" class="d-flex justify-content-between">
                Approval:
                <b v-if="viewItem.approved_date.length > 0" class="ms-1 text-success">{{
                    viewItem.approved_date
                }}</b>
                <b v-else class="ms-1"><i>pending approval</i></b>
            </div>
            <div
                class="flex-grow-1 ms-1 p-1 rounded"
                style="background-color: #cccccc3b; min-height: 40px"
            >
                <span class="text-success">{{ viewItem.approval_notes }}</span>
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
          style="background-color: #cccccc3b; min-height: 40px"
        >
          {{ viewItem.rejected_notes }}
        </div>
      </div>
    </div>
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