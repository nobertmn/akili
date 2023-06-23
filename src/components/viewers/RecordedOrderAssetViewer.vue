<template>
    <div class="p-1 dashed-primary" style="margin: 2px 0px">
        <div class="d-flex justify-content-between align-items-center">
            <span class="text-muted">
                {{views.asset.category.identifier}} #
                <strong class="text-black">
                    {{views.asset.identifier_number}}
                </strong>
            </span>
            <div class="d-flex align-items-center">
                <span class="text-muted">Category:</span>
                <span class="text-black ps-1 pe-2">
                {{views.asset.category.name}}
                </span>
            </div>
        </div>
        <div
            class="d-flex justify-content-between align-items-center"
            style="padding: 5px 0px"
        >
            <span class="text-muted">
                Name:
                <strong class="text-black" style="margin-left: 50px;">
                    {{views.asset.name}}
                </strong>
            </span>
        </div>
        <div
            class="d-flex justify-content-between align-items-center"
            style="padding: 5px 0px"
        >
            <span class="text-muted">
                Description:
                <span class="text-black" style="margin-left: 18px;">
                    {{views.asset.description}}
                </span>
            </span>
        </div>
    </div>
</template>


<script>
import Utils from "@/utils/";

export default {
    props: {
        views: {
            type: Object,
            default: function () {
                return null;
            },
        }
    },
}
</script>