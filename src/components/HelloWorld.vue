<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
     <v-flex xs4 v-for='element in menu' :key='element.id' :element='element'>
       <v-hover>
        <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
          <v-img
            v-bind:src=element.imagen
            height="200px"
          >
          </v-img>

          <v-card-title primary-title>
            <div>
              <div class="headline">{{ element.nombre_pizza }}</div>
              <span class="green--text">$ {{ element.precio }}</span>
            </div>
          </v-card-title>

          <v-card-text>{{ element.descripcion }}</v-card-text>
          <v-btn color="blue" :to="{name:'order',params: {id: element.id}}">Ordenar</v-btn>
        </v-card>
       </v-hover>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      show: false,
      menu: [],
      element: {
        id: null,
        nombre_pizza: null,
        descripcion: null,
        imagen: null,
        precio: null
      }
    }),
    created (){
      this.loadMenuPizzas()
    },
    methods: {
      loadMenuPizzas(){
        // this.$axios.get('https://f05ba791.ngrok.io/api/v1/pizzas/menu')
        // .then(
        //   menu => {
        //     this.menu = menu.data['menu']
        //   }
        // )
        const firestore = this.$Firebase.firestore()
        firestore.collection('menu').get()
        .then(
          (querySnapshot) => {
            querySnapshot.forEach(entrada => {
              this.menu.push(entrada.data())
            })
          }
        )
      }
    }
  }
</script>

<style>

</style>
