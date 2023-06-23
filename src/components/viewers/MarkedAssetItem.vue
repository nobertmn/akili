<template>
  <div class="p-1 dashed-primary" style="margin: 2px 0px">
    <div class="d-flex justify-content-between align-items-center">
      <span class="text-muted">
        #
        <strong class="text-black">
          {{ views.name.value ? views.name.value : views.name }}
        </strong>
      </span>
      <div class="d-flex align-items-center">
        <span class="text-muted">Type:</span>
        <strong class="text-black ps-1 pe-2">
          {{ views.type.value ? views.type.value : views.type }}
        </strong>
        <IconButton
          kind="btn-danger"
          classes="p-4px ms-1"
          @on-click="onClickDeleteAssetBtn"
          v-if="showDeleteBtn"
        >
          <i class="fas fa-times-circle"></i>
        </IconButton>
      </div>
    </div>
    <div
      class="d-flex justify-content-between align-items-center"
      style="padding: 5px 0px"
    >
      <span class="text-muted">
        Cost:
        <span class="text-black">
            {{comma(views.purchaseCost.value?views.purchaseCost.value:views.purchaseCost)}}
        </span>
      </span>
      <span class="text-muted">
        Years:
        <span class="text-black">
            {{comma(views.usefulYears.value?views.usefulYears.value:views.usefulYears)}}
        </span>
      </span>
      <span class="text-muted">
        Salvage:
        <span class="text-black">
            {{comma(views.salvageAmount.value??views.salvageAmount)}}
        </span>
      </span>
      <span class="text-muted">
        Value:
        <span class="text-black">
            {{comma(views.currentValue.value??views.currentValue)}}
        </span>
      </span>
    </div>
    <div
      class="d-flex justify-content-between align-items-center"
      style="margin-top: 5px"
    >
      <span class="text-muted">
        RE: <span class="text-black">{{ views.addedNotes.value??views.addedNotes }}</span>
      </span>
    </div>
    <div
      class="d-flex justify-content-start align-items-center"
      style="margin-top: 5px"
    >
      <span class="text-muted">
        Condition:
        <i class="text-black me-2">{{ views.condition.value??views.condition }},</i>
        Status: <i class="text-black">{{ views.status.value??views.status }}</i>
      </span>
    </div>
  </div>
</template>

<script>
import IconButton from "@/components/inputs/IconButton.vue";
import Utils from "@/utils/";
export default {
  components: {
    IconButton,
  },
  props: {
    views: {
      type: Object,
      default: function () {
        return null;
      },
    },
    index: {
      type: [String, Number],
      default: "",
    },
    showDeleteBtn: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onClickDeleteAssetBtn(e) {
      if (e) {
        this.$emit("on-click-delete", { views: this.views, index: this.index });
      }
    },
    comma(val){
      return Utils.comma(val);
    }
  },
};
</script>