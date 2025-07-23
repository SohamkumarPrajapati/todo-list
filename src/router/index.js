import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/signin",
    component: () => import('../views/SignIn.vue'),
  }
]

const router = new VueRouter({
  mode: 'history',
  routes: routes,
});

export default router