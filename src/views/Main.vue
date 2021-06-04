<template>
  <div class="main flex">
    <!-- UserSidebar -->
    <UserSidebar></UserSidebar>
    <!-- Main -->
    <div class="mainSection">
      <div class="title stickyTitle">
        <h1>首頁</h1>
      </div>
      <!-- CreateTweet -->
      <!-- <CreateTweet @afterCreateTweet="afterCreateTweet"></CreateTweet> -->
      <CreateTweet></CreateTweet>

      <!-- FollowingUsersTweets -->
      <Spinner v-if="!tweets.length"></Spinner>
      <FollowingUsersTweets
        v-else
        :tweets="tweets"
        @afterToggleLike="afterToggleLike"
      ></FollowingUsersTweets>
    </div>

    <!-- RecommendedFollowers -->
    <RecommendedFollowers></RecommendedFollowers>
  </div>
</template>

<script>
import UserSidebar from "../components/Common/UserSidebar";
import RecommendedFollowers from "../components/Common/RecommendedFollowers";
import CreateTweet from "../components/Main/CreateTweet";
import FollowingUsersTweets from "../components/Main/FollowingUsersTweets";
import { Toast } from "../utils/helpers";
import tweetsAPI from "../apis/tweets";
import Spinner from "../components/Common/Spinner";

export default {
  name: "Main",
  components: {
    UserSidebar,
    RecommendedFollowers,
    CreateTweet,
    FollowingUsersTweets,
    Spinner,
  },
  created() {
    this.fetchTweets();
    // eventbus for afterCreateReply
    this.$bus.$on("afterCreateReply", (payload) => {
      this.afterCreateReply(payload);
    });
    this.$bus.$on("afterCreateTweet", (newTweet) => {
      this.afterCreateTweet(newTweet);
    });
  },
  data() {
    return {
      tweets: [],
      tweet: {
        UserId: undefined,
        created: "",
        description: "",
        id: undefined, // tweetId
        likeCount: 0,
        replyCount: 0,
        updatedAt: "",
        user: {
          account: "",
          name: "",
          avatar: "",
        },
        isLiked: false, // 要後端補
      },
    };
  },
  methods: {
    async fetchTweets() {
      try {
        const { data } = await tweetsAPI.getAllFollowedTweets();
        this.tweets = data;
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法取得推文，請稍後再試！",
        });
      }
    },
    afterCreateTweet(newTweet) {
      this.tweets.unshift({
        ...this.tweet, // set up correct properties for TweetItem
        ...newTweet,
      });
    },
    afterToggleLike(toggleTweet) {
      // rerender
      this.tweets = this.tweets.map((tweet) => {
        if (tweet.id === toggleTweet.id) {
          return {
            ...tweet,
            isLiked: toggleTweet.isLiked,
          };
        } else {
          return tweet;
        }
      });
    },
    afterCreateReply(payload) {
      const tweetId = payload.tweetId;
      console.log("tweetId: " + tweetId);
      this.tweets = this.tweets.map((tweet) => {
        if (tweet.id !== tweetId) {
          return {
            ...tweet,
          };
        } else {
          return {
            ...tweet,
            replyCount: tweet.replyCount + 1,
          };
        }
      });
    },
  },
};
</script>

<style scoped>
.mainSection {
  overflow-y: scroll;
}

.title {
  background-color: #fff;
  z-index: 100;
}
</style>