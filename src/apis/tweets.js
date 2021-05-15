import { apiHelper } from './../utils/helpers'

export default {
  getAllFollowedTweets() {
    // get all tweets
    return apiHelper.get('tweets')
  },
  createNewTweet(payload) {
    return apiHelper.post('/tweets', payload)
  },
  adminDeleteTweet({ tweetId }) {
    return apiHelper.delete(`/admin/tweets/${tweetId}`)
  },
  getUserTweet(userId) {
    // get one users' all tweets
    return apiHelper.get(`/users/${userId}/tweets`)
  },
  getUserFollowersTweet({ userId }) {
    // get one users' all followers
    return apiHelper.get(`/users/${userId}/followers`)
  },
  getTweet(tweetId) {
    // get one tweet
    return apiHelper.get(`/tweets/${tweetId}`)
  },
  getTweetReplies(tweetId) {
    // get one tweet's all replies
    return apiHelper.get(`/tweets/${tweetId}/replies`)
  },
  getAllTweetsByUserId(userId) {
    // get one user's all tweets
    return apiHelper.get(`/users/${userId}/tweets`)
  },
  getAllRepliedTweets(userId) {
    return apiHelper.get(`/users/${userId}/replied_tweets`)
  },
  getAllLikedTweets(userId) {
    // get tweets liked by one user
    return apiHelper.get(`/users/${userId}/likes`)
  },
  createReply(tweetId, payload) {
    return apiHelper.post(`/tweets/${tweetId}/replies`, payload)
  },
  likeTweet(tweetId) {
    return apiHelper.post(`/tweets/${tweetId}/like`)
  },
  unlikeTweet(tweetId) {
    return apiHelper.post(`/tweets/${tweetId}/unlike`)
  },
  putTweet(tweetId, description) {
    return apiHelper.put(`/tweets/${tweetId}`, { description })
  },
  deleteTweet(tweetId) {
    return apiHelper.delete(`/tweets/${tweetId}`)
  }
}