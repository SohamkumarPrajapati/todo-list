import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignIn from '../views/SignIn.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/signin",
    component: SignIn,
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes: routes,
});

export default router