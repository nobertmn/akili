<template>
    <div
        class="p-1"
        style="width: 450px; background-color: #cbc8eb08 !important"
    >
        <h4 class="mt-1">Acquired Item Preview</h4>
        <hr />
        <KeyValueList :items="basicInfo" classes="d-felx w-100" />
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
    views: {
      type: Object,
      default: function () {
        return null;
      },
    },
  },
  data() {
    return {
      basicInfo: [],
    };
  },
  methods: {
    loadConfig() {
      let config = localStorage.getItem("config");
      if (config) {
        config = JSON.parse(config);
      } else {
        config = Utils.defaultConfigs();
      }

      this.basicInfo = [
        {
          key: "Item Name",
          value: this.views.name,
        },
        {
          key: "Package Label",
          value: this.views.receive_package_identity_label,
        },
        {
          key: "&nbsp;&nbsp;",
          value: "",
        },
        {
          key: "Unit Price",
          value: `${Utils.comma(
            this.views.unit_price
          )} <span class='text-muted'>${config.currency}</span>`,
        },
        {
          key: "Ordered Quantity",
          value: `${Utils.comma(this.views.quantity_delivered)}`,
        },
        {
          key: "Recorded Quantity",
          value: `${Utils.comma(this.views.quantity_recorded)}`,
        },
        {
          key: "Remaining Quantity",
          value: `${Utils.comma(this.views.quantity_remaining)}`,
        },
        {
          key: "&nbsp;&nbsp;",
          value: "",
        },
        {
          key: "Purchase Date",
          value: this.views.acquisition_order.delivery_date,
        },
        {
          key: "Order Number",
          value: this.views.acquisition_order.order_number,
        },
        {
          key: "Grn Number",
          value: this.views.acquisition_order.grn_number,
        },
        {
          key: "&nbsp;&nbsp;",
          value: "",
        },
        {
          key: "Specs",
          value: this.views.specifications,
        },
      ];
    },
    onFormSuccess() {
      this.$emit("on-success");
    },
  },
  mounted() {
    this.loadConfig();
  },
};
</script>