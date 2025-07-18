import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: HomeView,
  },
]

const router = new VueRouter({
  mode: 'hash',
  routes: routes,
});

export default router