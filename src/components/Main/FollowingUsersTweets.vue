<template>
  <div class="container">
    <ul class="tweetList">
      <TweetItem
        v-for="tweet in $attrs.tweets"
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
  components: {
    TweetItem,
  },
};
</script>

<style scoped>
.container {
  padding: 0;
  /* height: calc(100% - 175px); */
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

.spinner {
  padding: 0;
}
</style>