<template>
  <div id="AdminTweets">
    <Spinner v-if="isLoading" />
    <template v-else>
      <!-- AdminSidebar.vue -->
      <AdminSidebar />
      <!-- AdminTweetsList.vue -->
      <div class="AdminTweetsPanel">
        <div class="title">
          <h1>推文清單</h1>
        </div>
        <AdminTweetsList
          v-for="tweet in tweets"
          :key="tweet.id"
          :tweet="tweet"
          @after-delete-tweet="afterDeleteTweet"
        />
      </div>
    </template>
  </div>
</template>

<script>
import AdminSidebar from "./../components/AdminSidebar";
import AdminTweetsList from "./../components/AdminTweetsList";
import { Toast } from "../utils/helpers";
import tweetsAPI from "../apis/tweets";
import Spinner from "../components/Common/Spinner";

export default {
  name: "AdminTweets",
  components: {
    AdminSidebar,
    AdminTweetsList,
    Spinner,
  },
  data() {
    return {
      tweets: [],
      isLoading: true,
    };
  },
  created() {
    this.fetchTweets();
  },
  methods: {
    async fetchTweets() {
      try {
        const { data } = await tweetsAPI.getAllFollowedTweets();
        // const { tweets } = response.data;
        this.tweets = data;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log("error", error);
        Toast.fire({
          icon: "error",
          title: "無法取得推文資料，請稍後再試",
        });
      }
    },
    async afterDeleteTweet(tweetId) {
      try {
        const { data } = await tweetsAPI.deleteTweet({ tweetId });

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        this.tweets = this.tweets.filter((tweet) => tweet.id !== tweetId);
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        Toast.fire({
          icon: "error",
          title: "無法將餐廳移除最愛，請稍後再試",
        });
        console.log("error", error);
      }
    },
  },
};
</script>

<style scoped>
#AdminTweets {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: auto;
}

.AdminTweetsPanel {
  flex: 1;
  min-height: 100vh;
}

.title {
  height: 55px;
  border-bottom: 1px solid #e6ecf0;
}

.title h1 {
  font-size: 19px;
  font-weight: 700;
  padding: 13px 0 14px 23px;
  margin: 0;
}
</style>