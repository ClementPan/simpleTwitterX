<template>
  <div class="container">
    <ul class="tweetList">
      <TweetItem
        v-for="tweet in localTweets"
        @afterDeleteTweet="afterDeleteTweet"
        :key="tweet.id"
        :tweet="tweet"
      ></TweetItem>
    </ul>
  </div>
</template>

<script>
import TweetItem from "../Common/TweetItem";
export default {
  name: "FollowingUsersTweets",
  props: {
    tweets: {
      type: Array,
      required: true,
    },
  },
  created() {
    this.localTweets = this.tweets;
  },
  components: {
    TweetItem,
  },
  data() {
    return {
      localTweets: [],
    };
  },
  methods: {
    afterDeleteTweet(tweetId) {
      this.localTweets = this.localTweets.filter(
        (tweet) => tweet.id !== tweetId
      );
    },
  },
  watch: {
    tweets(newval) {
      this.localTweets = newval;
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

.spinner {
  padding: 0;
}
</style>