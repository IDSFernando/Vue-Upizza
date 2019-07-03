<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <v-data-table
            :headers="headers"
            :items="pedidos"
            class="elevation-1"
        >
            <template v-slot:items="props">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.total }}</td>
            <td>{{ props.item.direccion }}</td>
            <td>{{ props.item.pizza }}</td>
            <td>{{ props.item.tipoPago }}</td>
            </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
    data: () => ({
        headers: [
                {
                    text: 'Orden',
                    sortable: true,
                    value: 'id'
                },
                {
                    text: 'Precio',
                    sortable: true,
                    value: 'total'
                },
                {
                    text: 'Dirección',
                    sortable: false,
                    value: 'direccion'
                },
                {
                    text: 'Especialidad',
                    sortable: true,
                    value: 'pizza'
                },
                {
                    text: 'Tipo de pago',
                    sortable: false,
                    value: 'tipoPago'
                }
            ],
            pedidos:[]
    }),
    created (){
        this.fetchata()
    },
    methods: {
        async fetchata(){
            await this.$axios.get(`http://127.0.0.1:8000/api/v1/pizzas/ordenes`)
            .then(
                (response) => {
                    this.pedidos = response.data.pedidos
                    console.log(response.data.pedidos)
                }
            )
            .catch(err => {
                console.log(err)
            })
        }
    }
}
</script>
