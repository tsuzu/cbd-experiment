import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from './views/HelloWorld.vue';
import Four from '@/views/Four.vue';
import TF from '@/views/TF.vue';
import Flashcard from '@/views/Flashcard.vue';
import Finish from '@/views/Finish.vue';
import Test from '@/views/Test.vue';


Vue.use(Router);

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HelloWorld,
    },
    {
      path: '/four',
      name: "four",
      component: Four,
    },
    {
      path: '/tf',
      name: 'tf',
      component: TF,
    },
    {
      path: '/flashcard',
      name: 'flashcard',
      component: Flashcard,
    },
    {
      path: '/thank_you',
      name: 'thank_you',
      component: Finish,
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
    },

  ],
});

// router.beforeEach((to, from, next) => {
//   if (to.path !== '/' && to.path !== '/view' && API.getObservable() == null) {
//     next("/")

//     return;
//   }
//   next()
// })


export default router;