<template>
  <div class="replyDetailContent">
    <!-- UserSidebar -->
    <UserSidebar></UserSidebar>

    <!-- ReplyDetail -->
    <div class="mainSection">
      <div class="title stickyTitle">
        <button class="btn" @click="$router.back()">
          <img src="../assets/image/lastPage.svg" alt="" />
        </button>
        <h1>推文</h1>
      </div>
      <ReplyDetailContent
        :dataForContent="dataForContent"
        @afterToggleLike="afterToggleLike"
      ></ReplyDetailContent>

      <!-- ReplyDetailList -->
      <ReplyDetailList :dataForList="dataForList"></ReplyDetailList>
    </div>

    <!-- RecommendedFollowers -->
    <RecommendedFollowers class="recommendedFollowers"></RecommendedFollowers>
  </div>
</template>

<script>
import UserSidebar from "../components/Common/UserSidebar";
import RecommendedFollowers from "../components/Common/RecommendedFollowers";
import ReplyDetailContent from "../components/ReplyDetail/ReplyDetailContent";
import ReplyDetailList from "../components/ReplyDetail/ReplyDetailList";
// import { mapState } from "vuex";
import { Toast } from "../utils/helpers";
import tweetsAPI from "../apis/tweets";
// import usersApi from "../apis/users";

export default {
  name: "ReplyDetail",
  components: {
    UserSidebar, // 不需要資料
    RecommendedFollowers, // 自行處理
    ReplyDetailContent, // 需要 tweetId, UserId, name, account, avatar, description, updatedAt, createdAt, likeCount, replyCount
    ReplyDetailList, // 需要 UserId, Comments
  },
  created() {
    const { id } = this.$route.params;
    this.fetchTweetInfo(id);
    // eventbus for afterCreateReply
    this.$bus.$on("afterCreateReply", () => {
      this.afterCreateReply();
    });
  },
  data() {
    return {
      tweetInfo: {},
      dataForContent: {},
      dataForList: {},
    };
  },
  methods: {
    async fetchTweetInfo(tweetId) {
      try {
        // ReplyDetailContent
        const { data } = await tweetsAPI.getTweet(tweetId);
        const { id, user } = data;

        // all data in ReplyDetail
        this.tweetInfo = { ...data };

        // data for ReplyDetailContent
        this.dataForContent = { ...data };

        // data for ReplyDetailList
        this.dataForList = {
          tweetId: id,
          user,
        };
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取得推文資訊，請稍後再試！",
        });
      }
    },
    afterToggleLike(boolean) {
      const result = boolean;
      this.tweetInfo = {
        ...this.tweetInfo,
        isLiked: result,
      };
    },
    afterCreateReply() {
      const newNum = this.tweetInfo.commentsLength + 1;
      this.tweetInfo = {
        ...this.tweetInfo,
        commentsLength: newNum,
      };
    },
  },
  watch: {
    tweetInfo: {
      deep: true,
      handler: function (newVal) {
        this.dataForContent = newVal;
      },
    },
  },
};
</script>

<style scoped>
.replyDetailContent {
  display: flex;
  overflow-y: hidden;
}

.mainSection {
  overflow-y: scroll;
}

.recommendedFollowers {
  display: block;
}

.title .btn {
  padding: 0;
  height: 100%;
  width: 20px;
  margin-right: 43px;
  display: flex;
  align-items: center;
}

.title img {
  height: 14px;
  width: 17px;
}

.title img:hover {
  cursor: pointer;
}
</style>