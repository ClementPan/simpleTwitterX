import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import SignUp from '../views/SignUp.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/signup'
  },
  {
    path: '/signup',
    name: 'sign-up',
    component: SignUp
  },
  {
    path: '/signin',
    name: 'sign-in',
    component: () => import('../views/SignIn.vue')
  },
  {
    path: '/main',
    name: 'Main',
    component: Main
  },
    path: '/accountEdit',
    name: 'AccountEdit',
    component: () => import('../views/AccountEdit.vue')
  },
  {
    path: '/userprofile',
    name: 'user-profile',
    component: () => import('../views/UserProfile.vue')
  },
  {
    path: '/userprofile/replies',
    name: 'user-profile-replies',
    component: () => import('../views/UserProfileReply.vue')
  },
  {
    path: '/userprofile/likes',
    name: 'user-profile-Likes',
    component: () => import('../views/UserProfileLike.vue')
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound
  }
]

const router = new VueRouter({
  linkExactActiveClass: 'active',
  routes
})

router.beforeEach(async (to, from, next) => {
  // do something
  console.log(to)
  next()
})

export default router
