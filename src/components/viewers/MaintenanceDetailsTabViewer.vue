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
        Current Asset Condition:
        <b class="text-capitalize" style="margin-left: 12px">{{ viewItem.asset.condition }}</b>
      </span>
      <span>
        Current Asset Status:
        <b class="text-uppercase" style="margin-left: 35px">
            {{  viewItem.asset.status  }}
        </b>
      </span>
    </div>
    <div class="text-start px-1 d-flex justify-content-between">
      <span>
        Approval Time Condition:
        <b style="margin-left: 12px">
          {{viewItem.approved_date && viewItem.approved_date.length > 0 ?  viewItem.approval_time_condition : 'pending approval' }}
        </b>
      </span>
      <span>
        Approval Time Status:
        <b class="" style="margin-left: 35px">
             {{viewItem.approved_date && viewItem.approved_date.length > 0 ?  viewItem.approval_time_status : 'pending approval' }}
        </b>
      </span>
    </div>
    <br/>
    <div class="text-start px-1 d-flex justify-content-between">
      <span>
        Scheduled Maintenance Date:
        <b style="margin-left: 12px">{{ viewItem.scheduled_maintenance_date && viewItem.scheduled_maintenance_date.length > 0 ? viewItem.scheduled_maintenance_date : '....' }}</b>
      </span>
      <span>
        Actuall Execution Date:
        <b class="" style="margin-left: 35px">
            {{ viewItem.performed_maintenance_date && viewItem.performed_maintenance_date.length > 0 ? viewItem.performed_maintenance_date : '....' }}
        </b>
      </span>
    </div>
    <div class="text-start px-1 d-flex justify-content-between">
      <span>
        Last Maintenance Date:
        <b style="margin-left: 60px">
            {{ viewItem.last_maintenance_date && viewItem.last_maintenance_date.length > 0 ? viewItem.last_maintenance_date : '....' }}
        </b>
      </span>
      <span>
        Next Maintenance Date:
        <b class="text-uppercase" style="margin-left: 35px">
            {{ viewItem.next_maintenance_date && viewItem.next_maintenance_date.length > 0 ? viewItem.next_maintenance_date : '....' }}
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
        {{ viewItem.maintenance_notes }}
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
        <div class="text-start px-1 d-flex justify-content-between mt-1">
            <div style="min-width: 200px; width: 200px;" class="d-flex justify-content-between">
                Recall:
                <b v-if="viewItem.recalled_date.length > 0" class="ms-1 text-recalled">{{
                    viewItem.recalled_date
                }}</b>
                <b v-else class="ms-1"><i>pending asset recall</i></b>
            </div>
            <div
                class="flex-grow-1 ms-1 p-1 rounded"
                style="background-color: #cccccc3b; min-height: 40px"
            >
                <span class="text-recalled">{{ viewItem.recalled_notes }}</span>
            </div>
        </div>
        <div class="text-start px-1 d-flex justify-content-between mt-1">
            <div style="min-width: 200px; width: 200px;" class="d-flex justify-content-between">
                Return:
                <b v-if="viewItem.returned_date.length > 0" class="ms-1 text-returned">{{
                    viewItem.returned_date
                }}</b>
                <b v-else class="ms-1"><i>pending asset return</i></b>
            </div>
            <div
                class="flex-grow-1 ms-1 p-1 rounded"
                style="background-color: #cccccc3b; min-height: 40px"
                v-if="viewItem.returned_date.length > 0"
            >
                <div class="d-flex justify-content-between" style="background-color: transparent !important;">
                    <span>
                        Return Condition: <b class="text-capitalize">{{ viewItem.returned_condition }}</b>
                    </span>
                    <span>
                        Return Asset Status: <b class="text-capitalize">{{ viewItem.returned_status }}</b>
                    </span>
                </div>
                <div>
                  <span class="text-returned" >{{ viewItem.returned_notes }}</span>
                </div>
            </div>
            <div
                class="flex-grow-1 ms-1 p-1 rounded"
                style="background-color: #cccccc3b; min-height: 40px"
                v-else
            >
              &nbsp;
            </div>

        </div>
        <div class="text-start px-1 d-flex justify-content-between mt-1">
            <div style="min-width: 200px; width: 200px;" class="d-flex justify-content-between">
                Budget:
                <b v-if="viewItem.status.indexOf('pending','approved') >= 0" class="ms-1"><i>pending works scheduling</i></b>
                <b v-if="viewItem.budgeted_date.length > 0" class="ms-1 text-budgeted">{{
                    viewItem.budgeted_date
                }}</b>
            </div>
            <div
                class="flex-grow-1 ms-1 p-1 rounded "
                style="background-color: #cccccc3b !important; min-height: 40px"
                v-if="viewItem.status.indexOf('pending','approved') < 0"
            >
                <div class="d-flex justify-content-between" style="background-color: transparent !important;">
                    <span>
                        Total Amount: <b>{{ comma(viewItem.total_amount) }}</b>
                    </span>
                    <span>
                        Days Gained: <b>{{ comma(viewItem.total_life_time_gained_days) }}</b>
                    </span>
                </div>
                <div class="d-flex justify-content-between" style="background-color: transparent !important;">
                    <span>
                        End Of Life Before: 
                        <b>{{ viewItem.before_maintenance_outof_service_date && viewItem.before_maintenance_outof_service_date.length > 0 ? viewItem.before_maintenance_outof_service_date : '....' }}</b>
                    </span>
                    <span>
                        End Of Life After: 
                        <b>{{ viewItem.after_maintenance_outof_service_date && viewItem.after_maintenance_outof_service_date.length > 0 ? viewItem.after_maintenance_outof_service_date : '....' }}</b>
                    </span>
                </div>
            </div>
            <div
                class="flex-grow-1 ms-1 p-1 rounded "
                style="background-color: #cccccc3b !important; min-height: 40px"
                v-else
            >
                &nbsp;
            </div>
        </div>
        <div v-if="viewItem.status == 'budget rejected'">
            <div class="text-start px-1 d-flex justify-content-between mt-1">
              <div style="min-width: 300px; width: 300px;" class="d-flex justify-content-between">
                  Budget Rejected:
                  <b  class="ms-1 text-danger">{{viewItem.budget_rejected_date}}</b>
              </div>
              <div
                  class="flex-grow-1 ms-1 p-1 rounded"
                  style="background-color: #cccccc3b; min-height: 40px"
              >
                  <span class="text-danger">{{ viewItem.budget_rejected_notes }}</span>
              </div>
          </div>
        </div>
        <div v-else>
            <div class="text-start px-1 d-flex justify-content-between mt-1">
                <div style="min-width: 300px; width: 300px;" class="d-flex justify-content-between">
                    Budget Approval: 
                    <b v-if="viewItem.budget_approved_date.length > 0" class="ms-1 text-budget approved">{{
                        viewItem.budget_approved_date
                    }}</b>
                    <b v-else class="ms-1"><i>pending approval</i></b>
                </div>
                <div
                    class="flex-grow-1 ms-1 p-1 rounded text-budget approved"
                    style="background-color: #cccccc3b; min-height: 40px"
                >
                    {{ viewItem.budget_approved_notes }}
                </div>
            </div>
            <div class="text-start px-1 d-flex justify-content-between mt-1">
                <div style="min-width: 300px; width: 300px;" class="d-flex justify-content-between">
                    Works Execution: 
                    <b v-if="viewItem.performed_maintenance_date.length > 0" class="ms-1">{{
                        viewItem.performed_maintenance_date
                    }}</b>
                    <b v-else class="ms-1"><i>pending execution</i></b>
                </div>
                <div
                    class="flex-grow-1 ms-1 p-1 rounded"
                    style="background-color: #cccccc3b; min-height: 40px"
                >
                    {{ viewItem.performed_notes }}
                </div>
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