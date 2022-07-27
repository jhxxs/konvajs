/*
 * @LastEditTime: 2022-07-20 10:40:17
 * @Date: 2022-06-17 17:24:54
 * @Author: Lena
 * @LastEditors: Lena
 */
import Vue from "vue"
import VueKonva from "vue-konva"
import "windi.css"
import App from "./App.vue"

Vue.use(VueKonva)

const app = new Vue({
  render: (h) => h(App)
})

app.$mount("#app")
