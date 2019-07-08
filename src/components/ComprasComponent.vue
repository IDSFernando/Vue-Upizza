<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
	  <v-flex xs12>
		  <v-tabs
			v-model="active"
			color="indigo lighten-1"
			dark
			slider-color="indigo lighten-5"
			>

			<v-tab>
				Carrito de compras
			</v-tab>
			<v-tab>
				Compras realizadas
			</v-tab>

			<v-tab-item>
				<v-card flat>
					<v-card-text v-if="pendientes.length == 0">No tienes compras pendientes</v-card-text>
					<div v-else>
						<v-card color="indigo darken-1" class="white--text" v-for="pizza in pendientes" :key="pizza.id">
							<v-card-title primary-title>
								<div>
									<div class="headline">{{ pizza.pizza }}</div>
									<span>$ {{ pizza.total }}</span>
								</div>
							</v-card-title>
						</v-card>
						<v-btn block color="indigo darken-2" @click="pagar()">Pagar</v-btn>
					</div>
				</v-card>
			</v-tab-item>

			<v-tab-item>
				<v-card flat>
					<v-data-table
						:headers="headers"
						:items="pedidos"
						class="elevation-4"
					>
						<template v-slot:items="props">
						<td>{{ props.item.id }}</td>
						<td>{{ props.item.pizza }}</td>
						<td>{{ props.item.total }}</td>
						<td>{{ props.item.direccion }}</td>
						<td>{{ props.item.nombre }}</td>
						<td>{{ props.item.tipoPago }}</td>
						<td>{{ props.item.status }}</td>
						</template>
					</v-data-table>
				</v-card>
			</v-tab-item>

			</v-tabs>
	  </v-flex>
    </v-layout>
  </v-container>
  
</template>

<script>
export default {
    data: () => ({
		active: null,
        headers: [
                {
                    text: 'Orden',
                    sortable: true,
                    value: 'id'
                },
                {
                    text: 'Especialidad',
                    sortable: true,
                    value: 'pizza'
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
                    text: 'Pidió',
                    sortable: true,
                    value: 'nombre'
                },
                {
                    text: 'Tipo de pago',
                    sortable: false,
                    value: 'tipoPago'
                },
                {
                    text: 'Estado de la compra',
                    sortable: true,
                    value: 'status'
                }
            ],
			pedidos:[],
			pendientes: []
    }),
    created (){
        this.fetchata()
    },
    methods: {
        async fetchata(){
            // await this.$axios.get(`https://f05ba791.ngrok.io/api/v1/pizzas/ordenes`)
            // .then(
            //     (response) => {
            //         this.pedidos = response.data.pedidos
            //         console.log(response.data.pedidos)
            //     }
            // )
            // .catch(err => {
            //     console.log(err)
			// })
			
			// Tabla de compras realizadas
            const firestore = this.$Firebase.firestore()
            firestore.collection('pedidos').where('cliente', '==', localStorage.getItem('clientToken'))
            .get()
            .then(
                (pedidos) => {
                    pedidos.forEach(pizza => {
						this.pedidos.push({
							id: pizza.id,
							pizza: pizza.data().pizza,
							total: pizza.data().total,
							direccion: pizza.data().direccion,
							nombre: pizza.data().nombre,
							tipoPago:'VISA',
							status: pizza.data().estado
						})
                        // this.pedidos.push(pizza.data())
                    })
                }
			)
			
			// Tabla de pedidos pendientes
			const _pendientes = JSON.parse( localStorage.getItem('ordenes') )
			_pendientes.pizzas.forEach(element => {
			});
			this.pendientes = _pendientes.pizzas
		},
		
		async pagar(){
			const firestore = this.$Firebase.firestore()
			let _total = 0
			let cant_pizzas = 0
			let lastPizza = {}
			let token = null
			this.pendientes.forEach(p => {
				// firestore.collection('pedidos').add(p)
				_total += p.total
				lastPizza = p
				token = p.stripe_token
				cant_pizzas += 1
			})
			

			swal(
				'Aviso',
				`Tu compra es de ${_total}`,
				'warning'
			)

			this.$axios.get(`http://127.0.0.1:8000/api/v1/pizzas/cobrar/${token}/${_total}`)
			.then(
				(response) => {
					firestore.collection('pedidos').add({
						cantidad_pizzas: cant_pizzas,
						cliente: localStorage.getItem('clientToken'),
						correo: lastPizza.correo,
						direccion: lastPizza.direccion,
						estado: 'Tu pizza ya está en el horno',
						nombre: lastPizza.nombre,
						pizza: lastPizza.pizza,
						stripe_token: token,
						telefono: lastPizza.telefono,
						total: _total
					})
					swal('Compra realizada', '', 'success')
					this.$router.push({ name: 'home' })
				}
			)

			localStorage.setItem('ordenes', JSON.stringify({ pizzas:[] }))

		}
    }
}
</script>
