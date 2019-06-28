<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
     <v-flex xs4 v-for='element in menu' :key='element.id' :element='element'>
      <v-card>
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

        <v-card-actions>
          <v-expansion-panel focusable>
              <v-expansion-panel-content
              :key="element.id">
                <template v-slot:header>
                  <span flat color="blue">Descripcion</span>
                </template>
                <v-card>
                  <v-card-text>{{ element.descripcion }}</v-card-text>
                  <br>
                  <v-btn flat color="blue" :to="{name:'order',params: {id: element.id}}">Ordenar</v-btn>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
        </v-card-actions>
      </v-card>
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
        this.$axios.get('http://127.0.0.1:8000/api/v1/pizzas/menu')
        .then(
          menu => {
            this.menu = menu.data['menu']
          }
        )
      }
    }
  }
</script>

<style>

</style>
