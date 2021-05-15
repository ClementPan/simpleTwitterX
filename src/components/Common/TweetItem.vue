<template>
  <div class="tweet">
    <div class="avatar">
      <router-link
        :to="{ name: 'user-profile', params: { id: localTweet.UserId } }"
      >
        <img v-if="localTweet.user" :src="localTweet.user.avatar" alt="" />
        <img v-else :src="'' | emptyImageFilter" alt="" />
      </router-link>
    </div>
    <div class="tweetInfo">
      <div class="userInfo">
        <router-link
          :to="{ name: 'user-profile', params: { id: localTweet.UserId } }"
        >
          <p class="userName mr-1">
            {{ localTweet.user ? localTweet.user.name : "UserName" }}
          </p>
        </router-link>
        <p class="userAccount">
          @{{ localTweet.user ? localTweet.user.account : "UserAccount" }}
        </p>
        <span class="mx-1">&#xb7;</span>
        <p class="tweetUpdateAt">{{ localTweet.createdAt | fromNow }}</p>
        <!-- isMine -->
        <button
          class="btn deleteTweet"
          v-if="currentUser.id === localTweet.UserId"
          @click.stop.prevent="deleteTweet(localTweet.id)"
        >
          <i class="fas fa-times"></i>
        </button>
        <!-- isMine -->
      </div>
      <div class="tweetContent">
        <!-- <router-link to="/replydetail"> -->
        <router-link :to="`/replydetail/${localTweet.id}`">
          <p>{{ localTweet.description }}</p>
        </router-link>
      </div>
      <div class="tweetPanel">
        <div class="comments">
          <img
            src="../../assets/image/commentCount.svg"
            alt=""
            @click="showModal(localTweet.id)"
          />
          <p>
            {{ localTweet.replyCount }}
          </p>
        </div>
        <div class="likes">
          <img
            v-if="!localTweet.isLiked"
            :class="{ liked: localTweet.isLiked }"
            src="../../assets/image/likeCount.svg"
            alt=""
            @click="toggleLike(localTweet)"
          />
          <img
            v-else
            src="../../assets/image/likedLikeCount.svg"
            alt=""
            @click="toggleLike(localTweet)"
          />
          <p>
            {{ localTweet.likeCount }}
          </p>
        </div>
      </div>
    </div>
    <TweetReplyModal :tweet="localTweet"></TweetReplyModal>
  </div>
</template>

<script>
import TweetReplyModal from "../Modal/TweetReplyModal";
import { fromNowFilter } from "../../utils/mixins";
import { emptyImageFilter } from "../../utils/mixins";
import { Toast } from "../../utils/helpers";
import tweetsAPI from "../../apis/tweets";
import { mapState } from "vuex";
import $ from "jquery";

export default {
  name: "TweetItem",
  mixins: [fromNowFilter, emptyImageFilter],
  components: {
    TweetReplyModal,
  },
  props: {
    tweet: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localTweet: {},
      isMine: false,
    };
  },
  created() {
    this.localTweet = this.tweet;
    // eventbus for afterCreateReply from
    this.$bus.$on("afterCreateReply", (payload) => {
      this.afterCreateReply(payload);
    });
  },
  methods: {
    async toggleLike(tweet) {
      try {
        let response = {};

        // if unlike tweet
        if (tweet.isLiked) {
          tweet.isLiked = false;
          tweet.likeCount -= 1;
          // call api to like this tweet by user
          response = await tweetsAPI.unlikeTweet(tweet.id);
        } else {
          // if like tweet
          tweet.isLiked = true;
          tweet.likeCount += 1;
          // call api to like this tweet by user
          response = await tweetsAPI.likeTweet(tweet.id);

          const { id: userId } = this.$route.params;
          this.$socket.emit("like", {
            userId,
            currentUserId: this.currentUser.id,
          });
        }

        if (response.data.status !== "success") {
          throw new Error(response.data.message);
        }

        // inform user
        Toast.fire({
          icon: "success",
          title: "操作成功！",
        });

        // tell Main.vue to change data
        this.$emit("afterToggleLike", tweet);
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法執行此操作，請稍後再試！",
        });
      }
    },
    afterCreateReply(payload) {
      if (this.localTweet.id === payload.tweetId) {
        this.tweet.replyCount++;
      }
    },
    async deleteTweet(tweetId) {
      try {
        const { data } = await tweetsAPI.deleteTweet(tweetId);
        console.log(data);

        if (data.status !== "success") {
          throw new Error();
        }

        // inform user
        Toast.fire({
          icon: "success",
          title: "成功刪除推文！",
        });

        // inform Main.vue & UserProfile to rerender view
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "API尚未建立，請下個月再試！",
        });
      }
    },
    showModal(tweetId) {
      // #tweetReplyModal-${localTweet.id}
      $(`#tweetReplyModal-${tweetId}`).modal("show");
      $(`#tweetReplyModal-${tweetId}`).appendTo("body");
      console.log("Open modal");
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  watch: {
    tweet: {
      handler: function () {
        this.localTweet = this.tweet;
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.tweet {
  border-bottom: 1px solid #e6ecf0;
  display: flex;
  padding: 10px 15px;
  width: 100%;
}

.tweet:hover {
  background-color: hsl(205deg 92% 95%);
}

.avatar {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.tweetInfo {
  /* width: 100%; */
  width: calc(100% - 60px);
}

.userInfo {
  display: flex;
  align-items: center;
  height: 22px;
  position: relative;
}

.userInfo p {
  margin: 0;
}

.userInfo i {
  font-size: 15px;
  height: 100%;
}

.userInfo .userName {
  font-weight: 700;
}
.userInfo .userAccount,
.userInfo .tweetUpdateAt,
.userInfo span {
  font-weight: 500;
  color: #657786;
  line-height: 22px;
}

.deleteTweet {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  margin: 0;
  padding: 0;
  height: 22px;
  width: 22px;
}

.deleteTweet p {
  margin: auto;
}

.tweetContent {
  width: 100%;
  margin-bottom: 15px;
}

.tweetContent a {
  display: block;
  text-decoration: none;
}

.tweetContent p {
  width: 100%;
  margin: 0;
  font-weight: 500;
  font-size: 15px;
  word-wrap: break-word;
}

.tweetPanel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 130px;
  margin: 0;
}

.tweetPanel .comments,
.tweetPanel .likes {
  width: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.tweetPanel img {
  height: 16px;
  width: 16px;
  margin-right: 10px;
  color: #657786;
}

.tweetPanel .liked {
  color: transparent;
}

.tweetPanel img:hover {
  cursor: pointer;
}

.tweetPanel p {
  margin: 0px;
  color: #657786;
}

/*  */
.modal-backdrop {
  display: none;
  z-index: 1040 !important;
}

.modal-content {
  z-index: 1100 !important;
}
</style>