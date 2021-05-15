<template>
  <div class="container">
    <ul class="tweetList">
      <template v-if="isLoading">
        <p class="loading">資料讀取中...</p>
      </template>

      <template v-else>
        <p v-if="!tweets.length" class="noData">無資料</p>
        <TweetItem
          v-for="tweet in tweets"
          :key="tweet.replyId"
          :userData="user"
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
import usersAPI from "../../apis/users";

export default {
  name: "UserProfileReplyList",
  components: { TweetItem },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      user: {},
      tweets: [],
      isLoading: true,
    };
  },
  methods: {
    fetchUser(newVal) {
      this.user = newVal;
    },
    async fetchALlRepliedTweets(userId) {
      // console.log("fetchUserTweets in List");
      // console.log("fetchUser:" + userId);
      try {
        this.isLoading = true;
        const { data } = await tweetsAPI.getAllRepliedTweets(userId);
        // this.tweets = data;
        this.tweets = data.map((each) => {
          const { id: replyId } = each; // v-for key
          const { TweetId: id } = each;
          const {
            createdAt,
            description,
            isLiked,
            likeCount,
            replyCount,
          } = each.Tweet;
          const { avatar, name, account, id: UserId } = each.Tweet.User;
          return {
            replyId, // v-for key
            UserId,
            createdAt,
            description,
            id, // tweetId
            isLiked,
            likeCount,
            replyCount,
            user: {
              avatar,
              name,
              account,
            },
          };
        });
        // 不處理重複回覆的貼文呈現
      } catch (error) {
        console.log("in fetchUser");
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取得推文資料，請稍後再試！",
        });
      }
    },
    async fetchAllReplyUsers() {
      // 根據取得的回覆中所帶的 UserId 取得回覆者資料
      this.isLoading = true;
      this.tweets = await Promise.all(
        this.tweets.map(async (tweet) => {
          try {
            const { data } = await usersAPI.getUser(tweet.UserId);
            const { avatar, name, account } = data;
            return {
              ...tweet,
              user: {
                avatar,
                name,
                account,
              },
            };
          } catch (error) {
            console.log("in fetchAllReplyUsers");
            console.log(error);
            Toast.fire({
              icon: "error",
              title: "無法取得完整回覆資料，請稍後再試！",
            });
          }
        })
      );
      this.isLoading = false;
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
          await this.fetchALlRepliedTweets(userId);
          await this.fetchAllReplyUsers();
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