import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import SignUp from '../views/SignUp.vue'
import NotFound from '../views/NotFound.vue'
import AdminSignIn from '../views/AdminSignIn.vue'
import store from './../store'

// store
// import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/signin'
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
    path: '/admin',
    name: 'admin-root',
    redirect: '/admin/signin'
  },
  {
    path: '/admin/signin',
    name: 'admin-sign-in',
    component: AdminSignIn
  },
  {
    path: '/main',
    name: 'main',
    component: Main
  },
  {
    path: '/notification/mentions',
    name: 'notification-mentions',
    component: () => import('../views/NotificationMentions.vue')
  },
  {
    path: '/notification',
    name: 'notification',
    component: () => import('../views/Notification.vue')
  },
  {
    path: '/publicMessage',
    name: 'publicMessage',
    component: () => import('../views/PublicMessage.vue')
  },
  {
    path: '/privateMessage',
    name: 'privateMessage',
    component: () => import('../views/PrivateMessage.vue')
  },
  {
    path: '/accountEdit',
    name: 'account-edit',
    component: () => import('../views/AccountEdit.vue')
  },
  {
    path: '/replydetail/:id',
    name: 'reply-detail',
    component: () => import('../views/ReplyDetail.vue')
  },
  {
    path: '/userprofile/:id/replies',
    name: 'user-profile-replies',
    component: () => import('../views/UserProfileReply.vue')
  },
  {
    path: '/userprofile/:id/likes',
    name: 'user-profile-Likes',
    component: () => import('../views/UserProfileLike.vue')
  },
  {
    path: '/userprofile/:id',
    name: 'user-profile',
    component: () => import('../views/UserProfile.vue')
  },
  {
    path: '/userprofile/followers',
    name: 'user-profile-followers',
    component: () => import('../views/UserFollowers.vue')
  },
  {
    path: '/userprofile/following',
    name: 'user-profile-following',
    component: () => import('../views/UserFollowing.vue')
  },
  {
    path: '/admin/tweets',
    name: 'admin-tweets',
    component: () => import('../views/AdminTweets.vue')
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('../views/AdminUsers.vue')
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound
  },

]

const router = new VueRouter({
  linkExactActiveClass: 'active',
  routes
})

router.beforeEach(async (to, from, next) => {
  // get token from localStorage
  const tokenInLocalStorage = localStorage.getItem('token')
  const tokenInStore = store.state.token

  let isAuthenticated = store.state.isAuthenticated

  if (tokenInLocalStorage && tokenInLocalStorage !== tokenInStore) {
    // check currentUser with server
    console.log('SERVER-CHECK: tokenInLocalStorage !== tokenInStore')
    isAuthenticated = await store.dispatch('fetchCurrentUser')
  }

  const pathsWithoutAuthentication = ['sign-in', 'sign-up', 'admin-sign-in']

  // check with server when !isAuthenticated && trying to open pathsWithoutAuthentication
  if (!isAuthenticated && !pathsWithoutAuthentication.includes(to.name)) {
    next('/signin')
    // return
  }

  // if token's valid, push to main
  if (isAuthenticated && pathsWithoutAuthentication.includes(to.name)) {
    next('/main')
  }
  next()
})

export default router
