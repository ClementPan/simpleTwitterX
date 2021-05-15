<template>
  <div class="container">
    <ul class="tweetList">
      <template v-if="isLoading">
        <p class="loading">資料讀取中...</p>
      </template>

      <template v-else>
        <p class="noComment" v-if="!localComments.length">
          成為第一個留言的人!
        </p>
        <li
          class="commentItem"
          v-for="comment in localComments"
          :key="comment.id"
        >
          <div class="commentInfo">
            <div class="avatar">
              <router-link :to="`/userprofile/${comment.UserId}`">
                <img :src="comment.avatar | emptyImageFilter" alt="" />
              </router-link>
            </div>
            <div class="commentContent">
              <div class="userTitle">
                <router-link :to="`/userprofile/${comment.UserId}`">
                  <p>{{ comment.name }}</p>
                </router-link>
                <p>@{{ comment.account }}</p>

                <span class="mx-1">&#xb7;</span>
                <p>{{ comment.createdAt | fromNow }}</p>
              </div>
              <div class="replyTarget">
                <p>
                  回覆 <span>@{{ dataForList.user.account }}</span>
                </p>
              </div>
              <div class="textContent">
                <p>{{ comment.comment }}</p>
              </div>
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import { emptyImageFilter } from "../../utils/mixins";
import { fromNowFilter } from "../../utils/mixins";
import usersAPI from "../../apis/users";
import { Toast } from "../../utils/helpers";
import tweetsAPI from "../../apis/tweets";
import { mapState } from "vuex";

export default {
  name: "ReplyDetailList",
  props: {
    dataForList: {
      type: Object,
      required: true,
    },
  },
  created() {
    // eventbus for afterCreateReply
    this.$bus.$on("afterCreateReply", (tweetId) => {
      this.afterCreateReply(tweetId);
    });
  },
  data() {
    return {
      localComments: [],
      isLoading: true,
    };
  },
  mixins: [emptyImageFilter, fromNowFilter],
  methods: {
    async fetchAllReplies(tweetId) {
      try {
        console.log("fetchAllReplies");
        // 根據 tweetId => /tweets/:tweetId/replies 取得所有回覆
        const { data } = await tweetsAPI.getTweetReplies(tweetId);
        this.localComments = data;
        console.log(this.localComments);
      } catch (error) {
        console.log("fetchAllReplies");
        this.isLoading = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取得回覆資料，請稍後再試！",
        });
      }
    },
    async fetchAllReplyUsers() {
      // 根據取得的回覆中所帶的 UserId 取得回覆者資料
      this.localComments = await Promise.all(
        this.localComments.map(async (comment) => {
          try {
            const { data } = await usersAPI.getUser(comment.UserId);
            const { avatar, name, account } = data;
            return {
              ...comment,
              avatar,
              name,
              account,
            };
          } catch (error) {
            console.log("fetchAllReplyUsers");
            console.log(error);
            this.isLoading = false;

            Toast.fire({
              icon: "error",
              title: "無法取得完整回覆資料，請稍後再試！",
            });
          }
        })
      );
    },
    afterCreateReply(newReply) {
      // this.localComments.unshift(newReply);
      this.localComments.push(newReply);
    },
  },
  watch: {
    dataForList: {
      handler: async function (newVal) {
        const { tweetId } = newVal;
        this.isLoading = true;
        await this.fetchAllReplies(tweetId);
        await this.fetchAllReplyUsers();
        this.isLoading = false;
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style scoped>
.container {
  border-bottom: 1px solid #e6ecf0;
  padding: 0;
  width: 100%;
}

.loading,
.noComment {
  text-align: center;
  padding: 10px;
  color: #657786;
}

.commentItem {
  width: 100%;
  border-bottom: 1px solid #e6ecf0;
  padding: 18px 15px;
}

.commentItem:hover {
  background-color: hsl(205deg 92% 95%);
}

.avatar {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.avatar a {
  width: 100%;
  height: 100%;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.commentInfo {
  display: flex;
}

p {
  margin: 0;
}

.userTitle {
  display: flex;
}

.userTitle span,
.userTitle p {
  font-weight: 500;
  font-size: 15px;
  color: #657786;
}

.userTitle p:first-child {
  font-weight: 700;
  font-size: 15px;
  color: #1c1c1c;
  margin-right: 5px;
}

.replyTarget p {
  font-size: 15px;
  font-weight: 700;
  color: #657786;
}

.replyTarget {
  margin-bottom: 5px;
}

.replyTarget span {
  font-weight: 500;
  color: var(--orange);
}

.textContent p {
  /* word-wrap: break-word; */
  word-break: break-all;
  font-weight: 400;
  font-size: 15px;
  color: #1c1c1c;
}
</style>