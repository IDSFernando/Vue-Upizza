<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm12 pa-3>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">Elige tu pizza</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2">Llena tus datos</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">Confirma tu pedido</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 3" step="4">Pago</v-stepper-step>
          </v-stepper-header>
          
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-chip color="white" text-color="black">Seleccionaste: {{ pizza.nombre_pizza}}</v-chip>
                <v-flex mb12 xs12 sm12>
                  <v-select v-model="especialidad" :items="items" :rules="[v => !!v || 'Debes seleccionar un tamaño']" label="Seleccione el tamaño de la pizza" required></v-select>
                </v-flex>
                <v-chip color="white" text-color="black">Precio según el tamaño:</v-chip>
                <v-chip color="white" text-color="black" v-if="especialidad=='Chica'">Precio: ${{ parseFloat(parseFloat(pizza.precio)) }}</v-chip>
                <v-chip color="white" text-color="black" v-if="especialidad=='Mediana'">Precio: ${{ parseFloat(parseFloat(pizza.precio) + 50) }}</v-chip>
                <v-chip color="white" text-color="black" v-if="especialidad=='Grande'">Precio: ${{ parseFloat(parseFloat(pizza.precio) + 80) }}</v-chip>
              </v-form>
              <v-btn color="primary" @click="e1 = 2"  :disabled="!valid">Continue</v-btn>
              <v-btn flat color="error" to="/">Cancelar</v-btn>
            </v-stepper-content>
            
            <v-stepper-content step="2">
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Nombre" required></v-text-field>            
                <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                <v-text-field v-model="number" :rules="numberRules"  label="Número de teléfono" required></v-text-field>
                <v-text-field v-model="direccion" :rules="direccionRules" label="Dirección" required></v-text-field>
                <v-text-field v-model="referencias"  label="Referencias de la casa"></v-text-field>                           
                <v-btn color="primary" @click="e1 = 3">Continue</v-btn>
                <v-btn flat color="error" to="/">Cancel</v-btn>
              </v-form>
            </v-stepper-content>
            
            <v-stepper-content step="3">
              <v-card>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">Resumen de pedido</h3>
                    <div> 
                      <h4> Especialidad: {{ especialidad }}</h4>
                      <h4>Tamaño y precio: {{ especialidad }} - {{ precio_final }}</h4>
                      <h4><label>Nombre del cliente:</label> {{ name }}</h4>
                      <h4><label> Dirección de entrega:</label> {{ direccion }}</h4>
                      <h4>Hora de entrega: 6:00 pm</h4>
                    </div>
                  </div>
                </v-card-title>
                <v-btn color="primary" @click="e1 = 4">Mis datos son correctos</v-btn>
                <v-btn flat>Cancel</v-btn>
              </v-card>
            </v-stepper-content>
            <v-stepper-content step="4">
              <div ref="card"></div>
              <v-btn color="primary" @click="purchase()">Terminar compra</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-container>  
</template>

<script>
  let stripe = Stripe(`pk_test_0O64VFv2CpBBw2tXLQjY41tf00kIe8lGmk`),
  elements = stripe.elements(),
  card = undefined;
  export default {
    mounted: function () {
      card = elements.create('card',{hidePostalCode: true});
      card.mount(this.$refs.card);
      
    },
    data: () => ({
      pizza: {
        id: null,
        nombre_pizza: null,
        descripcion_pizza: null,
        imagen: null,
        precio: null
      },
      valid: true,
      especialidad: '',
      especialidadRules: [
      (v) => !!v || 'La especialidad es requerida',
      (v) => (v && v.length >= 5) || 'La especialidad debe tener al menos 5 caracteres'
      ],
      email: '',
      emailRules: [
      (v) => !!v || 'El correo es requerido',
      (v) => /.+@.+/.test(v) || 'El correo no es válido'
      ],
      tamanioPizza: null,
      items: [
      'Chica',
      'Mediana',
      'Grande'
      ],
      checkbox: false,
      e1: 0,
      name: '',
      nameRules: [
      (v) => !!v || 'Tu nombre es necesario',
      (v) => (v.length >= 3) || 'Tu nombre no es válido'
      ],
      number: '',
      numberRules: [
      (v) => !!v || 'Tu número telefónico es requerido',
      (v) => (v.length >= 10) || 'Tu número no es válido'
      ],
      direccion: '',
      direccionRules: [
      (v) => !!v || 'Tu dirección es requerida',
      (v) => (v.length >= 5) || 'Tu dirección no es válida'
      ],
      referencias: '',
      precio_final: 0,
      tokenPago: null,
      /* Datos para stripe */
    }),
    
    created(){
      this.getPizzaSeleccionada()
    },
    methods: {
      async getPizzaSeleccionada()
      {

        const pedidos = JSON.parse(localStorage.getItem('ordenes'))
        if(!pedidos)
        {
          localStorage.setItem('ordenes', JSON.stringify({
            pizzas: []
          }))
        }


        const firestore = this.$Firebase.firestore()
        firestore.collection('menu').where('id', '==', parseInt( this.$route.params.id))
        .get()
        .then(
          (entradas) => {
            entradas.forEach(pizza => {
              this.pizza.id = pizza.data().id
              this.pizza.nombre_pizza = pizza.data().nombre_pizza
              this.pizza.imagen = pizza.data().imagen
              this.pizza.precio = pizza.data().precio
            })
          }
        )
        .catch(
          err => console.log(err)
        )
        // await this.$axios.get(`https://f05ba791.ngrok.io/api/v1/pizzas/menu/especialidad/${parseInt(this.$route.params.id)}`)
        // .then((response) => {
        //   this.pizza.id = response.data['details'].id
        //   this.pizza.nombre_pizza = response.data['details'].nombre_pizza
        //   this.pizza.imagen = response.data['details'].imagen
        //   this.pizza.precio = response.data['details'].precio
        // })
        // .catch(err => {
        //   alert('Algo salió mal')
        // })
      },
      async purchase () {
        let token;
        await  stripe.createToken(card).then(function(result) {
          console.log(result)
          console.log(result.token)
          token = result.token.id;
          if (result.error) {
            self.hasCardErrors = true;
            self.$forceUpdate(); // Forcing the DOM to update so the Stripe Element can update.
            return;
          }
          
        });
        console.log(token)
        this.tokenPago = token
        this.submit()        
      },
      submit (){
        const carrito = JSON.parse(localStorage.getItem('ordenes'))
        const nuevaPizza = {
          nombre: this.name,
          pizza: this.pizza.nombre_pizza,
          correo: this.email,
          direccion: this.direccion,
          telefono: this.number,
          cantidad_pizzas: 1,
          total: Math.round(parseFloat(this.precio_final).toFixed(2)*100),
          cliente: localStorage.getItem('clientToken'),
          estado: 'Tu pizza ya está en el horno',
          stripe_token: this.tokenPago
        }
        carrito.pizzas.push(nuevaPizza)
        const newStructure = JSON.stringify(carrito)
        localStorage.setItem('ordenes', newStructure)
        swal("Pizza agregada al carrito", "Vista la sección de tus compras para pagar", "success")
        this.$router.push({ name: 'home' })
        
        // Almacenar en localStorage las compras, para después pagar y subir a firebase
        // this.$axios.get(`https://f05ba791.ngrok.io/api/v1/pizzas/order/create`, {
        //   params: {
        //     nombre: this.name,
        //     pizza: this.pizza.nombre_pizza,
        //     correo: this.email,
        //     direccion: this.direccion,
        //     telefono: this.number,
        //     stripe_token: this.tokenPago,
        //     cantidad_pizzas: 1,
        //     total: Math.round(parseFloat(this.precio_final).toFixed(2)*100)
        //   }
        // })
        // .then( (result) => {
        //   this.$axios.get(`https://f05ba791.ngrok.io/api/v1/pizzas/cobrar/${this.tokenPago}`)
        //   .then((result) => {
        //     // Insertar pedido en firestore
        //     const firestore = this.$Firebase.firestore()
        //     firestore.collection('clientes').add({
        //       token: localStorage.getItem('clientToken')
        //     })
        //     swal("Compra realizada", "Agradecemos tu preferencia", "success")
        //     this.$router.push({ name: 'home' })
        //   },
        //   errPago => {
        //     swal("No se pudo realizar la compra", "", "error")
        //     console.log(errPago)
        //   })
        // },
        // err => {
        //   console.log(err)
        // }
        // )
      }
    },
    watch: {
      especialidad: function(newValue, oldValue)
      {
        switch (newValue) {
          case 'Chica':
          this.precio_final = this.pizza.precio
          break;
          case 'Mediana':
          this.precio_final = parseFloat(parseFloat(this.pizza.precio) + 50)
          break;
          case 'Grande':
          this.precio_final = parseFloat(parseFloat(this.pizza.precio) + 80)
          break;
        }
      }
    }
  }
</script>

<style>
</style>
