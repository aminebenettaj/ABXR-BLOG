import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import AddPost from "../views/Posts/AddPost.vue";
import EditPost from "../views/Posts/EditPost.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/posts/add",
    name: "AddPost",
    component: AddPost,
  },
  {
    path: "/posts/edit/:id",
    name: "EditPost",
    component: EditPost,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
