<template>
    <div>
        <v-stepper v-model="e1">
            <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">Elige tu pizza</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2">Llena tus datos</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">Confirma tu pedido</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field v-model="especialidad" :counter="10" :rules="especialidadRules" label="Especialidad" required></v-text-field>            
                        <v-select v-model="tamanioPizza" :items="items" :rules="[v => !!v || 'No has seleccionado un tamaño para la pizza']" label="Seleccione el tamaño de la pizza" required></v-select>
                        <v-btn color="primary" @click="e1 = 2">Continue</v-btn>
                        <v-btn flat>Cancel</v-btn>
                    </v-form>
                   
                </v-stepper-content>
            
                <v-stepper-content step="2">
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Nombre" required></v-text-field>            
                        <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                        <v-text-field v-model="number" :rules="numberRules"  label="Número de teléfono" required></v-text-field>
                        <v-text-field v-model="direccion" :rules="direccionRules" label="Dirección" required></v-text-field>
                        <v-text-field v-model="referencias"  label="Referencias de la casa"></v-text-field>                           
                        <v-btn color="primary" @click="e1 = 3">Continue</v-btn>
                        <v-btn flat>Cancel</v-btn>
                    </v-form>
                </v-stepper-content>

                <v-stepper-content step="3">
                    <v-card>
                        <v-card-title primary-title>
                          <div>
                              <h3 class="headline mb-0">Resumen de pedido</h3>
                              <div> 
                                  <h4> Especialidad: {{ especialidad }}</h4>
                                  <h4>Tamaño y precio: {{ tamanioPizza }}</h4>
                                  <h4><label>Nombre del cliente:</label> {{ name }}</h4>
                                  <h4><label> Dirección de entrega:</label> {{ direccion }}</h4>
                                  <h4>Hora de entrega: 6:00 pm</h4>
                              </div>
                          </div>
                        </v-card-title>
                    </v-card>
                    <v-btn color="primary" @click="e1 = 1">Confirmar pedido</v-btn>
                    <v-btn flat>Cancel</v-btn>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script lang="ts">
export default {
    data: () => ({
      valid: true,
      especialidad: '',
      especialidadRules: [
        (v:any) => !!v || 'La especialidad es requerida',
        (v:any) => (v && v.length >= 5) || 'La especialidad debe tener al menos 5 caracteres'
      ],
      email: '',
      emailRules: [
        (v:any) => !!v || 'El correo es requerido',
        (v:any) => /.+@.+/.test(v) || 'El correo no es válido'
      ],
      tamanioPizza: null,
      items: [
        'Chica - $120.00',
        'Mediana - $180.00',
        'Grande - $220.00',
        'Mega - $280.00'
      ],
      checkbox: false,
      e1: 0,
      name: '',
      nameRules: [
        (v:any) => !!v || 'Tu nombre es necesario',
        (v:any) => (v.length >= 3) || 'Tu nombre no es válido'
      ],
      number: '',
      numberRules: [
        (v:any) => !!v || 'Tu número telefónico es requerido',
        (v:any) => (v.length >= 10) || 'Tu número no es válido'
      ],
      direccion: '',
      direccionRules: [
        (v:any) => !!v || 'Tu dirección es requerida',
        (v:any) => (v.length >= 5) || 'Tu dirección no es válida'
      ],
      referencias: ''
    }),
    methods: {
      /*validate () {
        if (this.$refs.form.validate()) {
          this.snackbar = true
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      }*/
    }
  }
</script>

<style lang="">

</style>
