import Vue from 'vue';
import './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import axios from 'axios'
import Firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyCtMaIOquerNgeGVbnFse5FX7b6jt7w5-E",
  authDomain: "upizza-soa.firebaseapp.com",
  databaseURL: "https://upizza-soa.firebaseio.com",
  projectId: "upizza-soa",
  storageBucket: "",
  messagingSenderId: "31627757100",
  appId: "1:31627757100:web:f190ee736f633ce1"
};
Firebase.initializeApp(firebaseConfig)
const messaging = Firebase.messaging()
messaging.usePublicVapidKey('BJgy5-tORwT7FS_Xuk4OqZRwHkqERO8pdD8Y8lWZPWzXFG62xRbvEw5n-4LW3497gh4ZGGbVWJR_4E2hv6hBhhM')
messaging.requestPermission()
.then(() => Firebase.messaging().getToken())
.then((token) => {
  console.log(token)
  const currentFCMToken = localStorage.getItem('clientToken')
  if(!currentFCMToken)// Si no se ha guardado el token
  {
    console.log(token)
    localStorage.setItem('clientToken', ''+token)// yeah, has to be this way :c
  }
  else// ya se guardó pero el token cambió
  {
    if(token != currentFCMToken)
    {
      localStorage.setItem('clientToken', ''+token)
      //  Actualizar el token en firestore
      let firestore = Firebase.firestore()
      let ref = firestore.collection('clientes').get()
      .then(
        (registros) => {
          registros.forEach(element => {
            if(element.data().token != currentFCMToken)
            {
              let query = firestore.doc('clientes/'+element.id).update({token: token})
              console.log('Se ha actualizado el token FCM')
            }
          });
        }
      )
    }
  }
  
  // checar si el token cambió
  
})
.catch(err => {
  console.log(err)
})

messaging.onMessage((payload) => {
  console.log(payload)
})

// function setFirestoreDocRef()
// {
//   const ls_docRef = localStorage.getItem('docRef')
//   const firestore = Firebase.firestore()
//   if(!ls_docRef)
//   {
//     firestore.collection('clientes').add({
//       token: localStorage.getItem('clientToken')
//     })
//     .then((docRef) => {
//       localStorage.setItem('docRef', JSON.stringify(docRef))
//     })
//     .catch(err => {
//       console.log(err)
//     })
//   }
// }
Vue.prototype.$axios = axios
Vue.prototype.$Firebase = Firebase
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');