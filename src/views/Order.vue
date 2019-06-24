<template>
    <div>
        <OrderComponent/>
    </div>
</template>


<script lang="ts">
import {Vue,Component} from 'vue-property-decorator'
import OrderComponent from '@/components/OrderComponent.vue'
@Component({
components: {
    OrderComponent,
  },
})

export default class Order extends Vue{}
</script>

<style lang="">

</style>

