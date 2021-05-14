<template>
  <div class="container">
    <div class="userInfo">
      <div class="avatar">
        <router-link :to="`/userprofile/${localData.user.id}`">
          <img v-if="localData.user" :src="localData.user.avatar" alt="" />
          <img v-else src="'' | emptyImageFilter" alt="" />
        </router-link>
      </div>
      <div class="userTitle">
        <router-link :to="`/userprofile/${localData.user.id}`">
          <p class="text-dark">
            {{ localData.user ? localData.user.name : "資料讀取中" }}
          </p>
        </router-link>

        <p>@{{ localData.user ? localData.user.account : "資料讀取中" }}</p>
      </div>
    </div>

    <div class="textContent">
      <p>{{ localData.description }}</p>
    </div>
    <div class="updatedAt">
      <p class="tweetUpdateAt">{{ localData.updatedAt | exactDate }}</p>
    </div>
    <div class="feedbackCount">
      <p>{{ localData.commentsLength }} <span>回復 </span></p>
      <p>{{ localData.likesLength }} <span>喜歡次數</span></p>
    </div>
    <div class="tweetPanel">
      <div class="comments">
        <img
          data-toggle="modal"
          :data-target="`#tweetReplyModal-${localData.id}`"
          src="../../assets/image/commentCount.svg"
          alt=""
        />
      </div>
      <TweetReplyModal
        v-on="$listeners"
        :tweet="dataForModal"
      ></TweetReplyModal>
      <div class="likes">
        <img
          v-if="!localData.isLiked"
          :class="{ liked: localData.isLiked }"
          src="../../assets/image/likeCount.svg"
          alt=""
          @click="toggleLike()"
        />
        <img
          v-else
          src="../../assets/image/likedLikeCount.svg"
          alt=""
          @click="toggleLike()"
        />
        <p></p>
      </div>
    </div>
  </div>
</template>

<script>
import { emptyImageFilter } from "../../utils/mixins";
import { exactDateFilter } from "../../utils/mixins";
import TweetReplyModal from "../Modal/TweetReplyModal";
import { Toast } from "../../utils/helpers";
import tweetsAPI from "../../apis/tweets";

export default {
  name: "ReplyDetailContent",
  mixins: [emptyImageFilter, exactDateFilter],
  components: {
    TweetReplyModal,
  },
  props: {
    dataForContent: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dataForModal: {},
      localData: {
        user: {
          id: null,
        },
      },
    };
  },
  methods: {
    setDataForModal() {
      const {
        id,
        user,
        updatedAt,
        description,
        createdAt,
      } = this.dataForContent;
      this.dataForModal = {
        id,
        updatedAt,
        description,
        createdAt,
        user,
      };
    },
    async toggleLike() {
      try {
        // call api to like this tweet by user
        const id = this.dataForContent.id;
        const tweet = this.dataForContent;

        if (tweet.isLiked) {
          const { data } = await tweetsAPI.unlikeTweet(id);
          if (data.status !== "success") {
            throw new Error(data.message);
          }
          tweet.isLiked = false;
          tweet.likesLength -= 1;
        } else {
          const { data } = await tweetsAPI.likeTweet(id);
          if (data.status !== "success") {
            throw new Error(data.message);
          }
          tweet.isLiked = true;
          tweet.likesLength += 1;
        }

        // inform user
        Toast.fire({
          icon: "success",
          title: "動作執行成功！",
        });

        // tell Main.vue to change data
        this.$emit("afterToggleLike", tweet.isLiked);
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "無法執行動作，請稍後再試！",
        });
      }
    },
  },
  watch: {
    dataForContent: {
      handler: function (newVal) {
        this.localData = newVal;
        this.setDataForModal();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.container {
  border-bottom: 1px solid #e6ecf0;
  padding: 15px;
}

.userInfo {
  display: flex;
}

.userTitle {
  display: flex;
  flex-direction: column;
}

p {
  margin: 0;
}

.userTitle p {
  flex: 1;
  font-weight: 700;
  font-size: 15px;
  color: #1c1c1c;
}

.userTitle p:last-child {
  font-weight: 500;
  color: #657786;
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

/* textContent */
.textContent {
  margin: 15px 0 15px;
  /* background-color: #333; */
}

.textContent p {
  font-size: 23px;
}

/* updatedAt */
.updatedAt {
  border-bottom: 1px solid #e6ecf0;
  padding-bottom: 15px;
}
.updatedAt p {
  font-size: 15px;
  font-weight: 500;
  color: #657786;
}

/* feedbackCount */
.feedbackCount {
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid #e6ecf0;
}

.feedbackCount p,
.feedbackCount span {
  font-size: 19px;
  line-height: 19px;
  font-weight: 700;
}

.feedbackCount span {
  color: #657786;
}

.feedbackCount p:first-child {
  margin-right: 20px;
}

/* tweetPanel */
.tweetPanel {
  padding-top: 20px;
  display: flex;
  flex-direction: row;
}

.tweetPanel img {
  height: 25px;
  width: 25px;
}

.tweetPanel img:hover {
  cursor: pointer;
}

.tweetPanel .comments {
  margin-right: 155px;
}
</style>