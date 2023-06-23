 <template>
    <div :class="'p-2 ' + classes">
        <div v-for="(item, index) in items" :key="index" class="d-flex h6 justify-content-between border-bottom">
            <div v-html="item.key"> </div>
            <div class="kylist-value fw-bolder" v-html="item.value"></div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        items: {
            type: Array,
            default: function(){
                return [];
            }
        },
        classes: {
            type: String,
            default: "",
        },
    }
};
</script>