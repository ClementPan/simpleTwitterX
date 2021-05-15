import { apiHelper } from './../utils/helpers'

export default {
  putUser(userId, payload) {
    return apiHelper.put(`/users/${userId}`, payload)
  },
  getUser(userId) {
    return apiHelper.get(`/users/${userId}`)
  },
  getCurrentUser() {
    return apiHelper.get('/users/current_user')
  },
  getTotalUser() {
    return apiHelper.get('/admin/users')
  },
  setUser(payload) {
    return apiHelper.post('/users', payload)
  },
  getRecommendedFollowers() {
    return apiHelper.get('/users')
  },
  getUserFollowers(userId) {
    return apiHelper.get(`/users/${userId}/followers`)
  },
  getUserFollowings(userId) {
    return apiHelper.get(`/users/${userId}/followings`)
  },
  followUser(userId) {
    return apiHelper.post('/followships', { id: userId })
  },
  unfollowUser(userId) {
    return apiHelper.delete(`/followships/${userId}`)
  },
  subscribeUser(payload) {
    return apiHelper.post('/subscriptions', payload)
  },
  unsubscribeUser(userId) {
    return apiHelper.delete(`/subscriptions/${userId}`)
  }
}