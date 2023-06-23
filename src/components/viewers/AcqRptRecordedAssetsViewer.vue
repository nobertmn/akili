<template>
  <div class="d-flex justify-content-center align-items-start h-100 inner-table-w-100" style="width:100%">
      <vue-good-table
        :columns="columns"
        :rows="rows"
        styleClass="vgt-table striped w-100"
        :line-numbers="true"
        max-height="400px"
        :fixed-header="true"
      >
        <template #table-actions >
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="d-flex align-items-center me-2 ">
              <h5 class="mb-0">
                Total Assets Value: <b>{{ cmpTotalAssetsValue }} {{}}</b>
                <b class="text-muted">{{ currency }}</b>
              </h5>
            </div>
          </div>
        </template>
        <template #emptystate>
          {{
            isLoading
              ? "Loading..."
              : rows.length == 0
              ? "There are no uploaded records"
              : ""
          }}
        </template>

        <template #table-row="props">
          <span
            v-if="props.column.field == 'asset_value'"
            class="d-flex justify-content-end"
          >
            {{ getAssetValue(props.row.asset) }}
          </span>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-good-table>
  </div>
</template>

<script>
import Vm from "@/utils/Vm";
import Utils from "@/utils/";

export default {
  components: {
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      columns: [
        {
          label: "Identity",
          field: "asset.identifier_number",
          sortable: false
        },
        {
          label: "Name",
          field: "asset.name",
          sortable: false
        },
        {
          label: "Category",
          field: "asset.category.name",
          sortable: false
        },
        {
          label: "Status",
          field: "asset.status",
          sortable: false
        },
        {
          label: "Asset value",
          field: "asset_value",
          thClass: "text-end",
          sortable: false
        }
      ],
      currency: "",
    };
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.delete,
    ...Vm.loaders,
    formatMoney(amount) {
      let value = parseFloat(amount);
      return value.toLocaleString();
    },
    getAssetValue(asset) {
      let assetValue = Utils.getCurrentAssetValue(asset);
      return this.formatMoney(assetValue);
    }
  },
  computed: {
    cmpTotalAssetsValue() {
      var total = 0;
      for (let index = 0; index < this.rows.length; index++) {
        const row = this.rows[index];
        let assetValue = Utils.getCurrentAssetValue(row.asset);
        total += assetValue;
      }
      return this.formatMoney(total);
    },
  },
  mounted() {
    this.currency = JSON.parse(localStorage.getItem("config")).currency;
  },
};
</script>