<template>
    <div class="">
        <h4 v-html="title"></h4>
        <h6 class="mt-4" v-html="subTitle"></h6>
        <hr/>
        <div class="delete-concent-records">
            <div class="d-flex justify-space-between consent-fact-row">
            <div class="">
                <b class="text-black">SCAN LIMITT:</b>
            </div>
            <div class="flex-grow-1 text-end ms-1">
                <b class="text-danger">{{ comma(parseInt(scan_limit) - 1) }}</b>
            </div>
            </div>
            <div
            v-for="(rec, table_name) in records"
            :key="table_name"
            class="d-flex flex-row justify-content-between consent-fact-row"
            >
            <div class="">
                <b class="text-danger">{{ tableRefs[table_name]? tableRefs[table_name]:  table_name}}</b>
            </div>
            <div class="flex-grow-1 text-end">
                <b class="red--text">{{
                rec.length == 0
                    ? "No "
                    : comma(rec.length > scan_limit ? scan_limit - 1 : rec.length)
                }}</b>
                {{
                rec.length == 0
                    ? "records affected"
                    : (rec.length > scan_limit ? "+ " : "") +
                    "Record(s) will be deleted"
                }}
            </div>
            </div>
            <div class="d-flex flex-row justify-content-between consent-fact-row ">
            <div class="">
                <b class="black--text">TOTAL NO. OF RECORDS AFFECTED:</b>
            </div>
            <div class="flex-grow-1 text-end">
                {{ total > scan_limit ? "Over " : "" }}
                <b class="red--text">
                {{ comma(total) }} {{ total > scan_limit ? "+ " : "" }}</b
                >
                Record(s)
            </div>
            </div>
            <br />
        </div>
    </div>
</template>

<script>
import Utils from "@/utils/";
import Vm from "@/utils/Vm";
export default {
  components: {
  },
  props: {
    title: {
      type: String,
      default: "This will remove the selected record",
    },
    subTitle: {
      type: String,
      default: "Affected Records After Delete",
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    seed: {
      type: Object,
      default: () => {
        return null;
      },
      required: true,
    },
    pst: {
      type: Number,
      default: 0,
    },
  },
  data: () => {
    return {
      not_found: false,
      records: null,
      total: 0,
      scan_limit: 0,
      errors: [],
      tableRefs: {
          asset_extra_field: "Asset Extra Fields",
          allocation: "Asset Allocations ",
          disposal_asset: "Selected Disposal Assets",
          disposal_support_document: "Disposal Support Documents",
          transfer_asset: "Selected Transfer Assets",
          transfer_support_document: "Transfer Support Documents",
          support_document: "Requisition Support Documents",
          acquisition_order: "Acquisition Orders",
          order_item: "Acquisition Orders Items",
          order_support_document: "Acquisition Support Documents"
      }
    };
  },
  watch: {
    pst(val) {
      if (this.edits == null) {
        this.onSubmit();
      } else {
        this.onSaveEdits();
      }
    },
  },
  methods: {
    ...Vm.loaders,
    ...Vm.fetch,
    ...Vm.delete,
    loadDependencies(){
        var vm = this;
        vm.fetchDeleteDeps(vm.seed, function(thisVm, res){
            thisVm.records = res.records;
            thisVm.total = res.total_affected;
            thisVm.scan_limit = res.limit;
        });
    },
    onSubmit() {
        var vm = this;
        vm.deleteCascade(vm.seed, function(thisVm, res){
            thisVm.$emit("on-delete-success");
        });
    },
    comma(v) {
      return Utils.comma(v);
    },
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>