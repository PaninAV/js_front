import Vue from "vue";
import VueRouter from "vue-router";
import Login from "./components/login.vue";
import home from "./components/AppOld.vue";




Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      component: Login,
      name: "login",
      path: "/login",
    },
    {
      component: home,
      name: "home",
      path: "/",
      
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/AboutView.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
    try {
    console.log(localStorage.getItem("token"))
    } catch (error){
        console.log(error)
    }
    if (localStorage.getItem('token') === null && to.name !== "login") {
        next({
            name: "login"
        })
    } else {
        next()
    }
})

export default router
