import Vue from "vue"
import App from "./App.vue"

Vue.config.productionTip = false

// Variable global, lien serveur
// Vue.prototype.$servApp = 'https://INTERNAL_IP/app/'

// Variable d'environement, lien localhost
Vue.prototype.$servApp = "http://127.0.0.1:8080/"


new Vue({
	render: h => h(App)
}).$mount("#app")