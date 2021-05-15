<template>
  <div class="container">
    <ul class="tweetList">
      <template v-if="isLoading">
        <p class="loading">資料讀取中...</p>
      </template>

      <template v-else>
        <p v-if="!tweets.length" class="noData">無資料</p>

        <TweetItem
          v-else
          v-for="tweet in tweets"
          :key="tweet.id"
          :tweet="tweet"
        ></TweetItem>
      </template>
    </ul>
  </div>
</template>

<script>
import TweetItem from "../Common/TweetItem";
import { mapState } from "vuex";
import { Toast } from "../../utils/helpers";
import tweetsAPI from "../../apis/tweets";

export default {
  name: "UserProfileLikeList",
  components: {
    TweetItem,
  },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      user: {},
      tweets: {},
      isLoading: true,
    };
  },
  methods: {
    fetchUser(newVal) {
      this.user = newVal;
    },
    async fetchUserLikedTweets(userId) {
      // console.log("fetchUserLikedTweets in List");
      // console.log("fetchUser:" + userId);
      try {
        this.isLoading = true;
        const { data } = await tweetsAPI.getAllLikedTweets(userId);

        this.tweets = data.map((tweet) => {
          const { Tweet } = tweet;
          const { User } = tweet.Tweet;
          return {
            ...Tweet,
            user: User,
            UserId: Tweet.User.id,
          };
        });
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取得推文資料，請稍後再試！",
        });
      }
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  watch: {
    userData: {
      handler: async function (newVal) {
        try {
          this.fetchUser(newVal);
          const userId = this.user.id;
          await this.fetchUserLikedTweets(userId);
        } catch (error) {
          console.log(error);
          Toast.fire({
            icon: "error",
            title: "無法取得推文資料，請稍後再試！",
          });
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.container {
  padding: 0;
  width: 100%;
}
.tweetList {
  /* overflow-y: scroll; */
  height: 100%;
  width: 100%;
}
/* for Chrome, Safari and Opera */
.tweetList::-webkit-scrollbar {
  display: none;
}
.tweetList {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.loading,
.noData {
  text-align: center;
  padding: 10px;
  color: #657786;
}
</style>