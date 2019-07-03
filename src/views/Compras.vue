<template>
    <div>
        <ComprasComponent/>
    </div>
</template>

<script>
import {Vue,Component} from 'vue-property-decorator'
import ComprasComponent from '@/components/ComprasComponent.vue'
@Component({
components: {
    ComprasComponent,
  },
})

export default class Compras extends Vue{}
</script>
