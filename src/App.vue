<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <v-btn large :to="{name:'home'}">UPizza</v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn large :to="{name:'pedidos'}">Mis compras</v-btn>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
