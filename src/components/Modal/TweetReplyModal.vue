<template>
  <div
    class="modal fade"
    :id="`tweetReplyModal-${tweet.id}`"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="start btn"
            data-dismiss="modal"
            aria-label="Close"
            @click="clearReplyContent"
          >
            <span aria-hidden="true"
              ><img src="../../assets/image/close.svg" alt=""
            /></span>
          </button>
        </div>

        <div class="modal-body">
          <!-- tweet -->
          <div class="container replyTarget">
            <div class="avatar">
              <img v-if="tweet.user" :src="tweet.user.avatar" alt="" />
              <img v-else :src="'' | emptyImageFilter" alt="" />
            </div>
            <div class="tweetInfo">
              <div class="userInfo">
                <p class="userName">
                  {{ tweet.user ? tweet.user.name : "" }}
                </p>
                <p class="userAccount">
                  @{{ tweet.user ? tweet.user.account : "" }}
                </p>
                <span class="mx-1">&#xb7;</span>
                <p class="tweetUpdateAt">
                  {{ tweet.updatedAt | fromNow }}
                </p>
              </div>
              <div class="tweetContent">
                <p>{{ tweet.description }}</p>
              </div>
              <div class="panel">
                <p>
                  回覆給
                  <span> @ {{ tweet.user ? tweet.user.name : "" }} </span>
                </p>
              </div>
            </div>
          </div>

          <!-- comment -->
          <div class="container myReply">
            <div class="avatar">
              <img :src="currentUser.avatar | emptyImageFilter" alt="" />
            </div>
            <div class="tweetInf">
              <div class="input">
                <textarea
                  id=""
                  name=""
                  cols="55"
                  rows="5"
                  autofocus
                  maxlength="140"
                  required
                  v-model="replyContent"
                  placeholder="推你的回覆 (字數限制 140 字元)"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="tweetButton">
            <button
              type="button"
              class="btn"
              @click="createReply(tweet.id)"
              :disabled="isProcessing"
            >
              {{ isProcessing ? "回覆中.." : "回覆" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "../../utils/helpers";
import { emptyImageFilter } from "../../utils/mixins";
import { fromNowFilter } from "../../utils/mixins";
import { mapState } from "vuex";
import tweetsAPI from "../../apis/tweets";
// jquery for closing modal
import $ from "jquery";

export default {
  name: "TweetReplyModal",
  mixins: [emptyImageFilter, fromNowFilter],
  props: {
    tweet: {
      type: Object,
      default: function () {
        return {
          user: {
            avatar: "",
            name: "",
            account: "",
          },
        };
      },
    },
  },
  data() {
    return {
      replyContent: "",
      isProcessing: false,
    };
  },
  methods: {
    clearReplyContent() {
      this.replyContent = "";
    },
    async createReply(tweetId) {
      const result = this.replyContentCheck(this.replyContent);
      if (!result) {
        return;
      }
      try {
        this.isProcessing = true;
        const payload = { comment: this.replyContent };
        // call api to create tweet reply
        const { data } = await tweetsAPI.createReply(tweetId, payload);
        const { ReplyId } = data;
        const id = ReplyId;

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        console.log("replyId", ReplyId);
        const { id: userId } = this.$route.params;
        this.$socket.emit("reply", {
          userId,
          replyId: ReplyId,
          reply: this.replyContent,
          currentUserId: this.currentUser.id,
        });

        // inform user
        Toast.fire({
          icon: "success",
          title: "回覆成功！",
        });

        // close modal after successfully replied
        // this.closeModal(tweetId);
        $(`#tweetReplyModal-${tweetId}`).modal("hide");
        // tweetReplyModal-${tweet.id}

        // use eventBus
        const payloadForList = {
          tweetId,
          name: this.currentUser.name,
          UserId: this.currentUser.id,
          account: this.currentUser.account,
          avatar: this.currentUser.avatar,
          comment: this.replyContent,
          createdAt: new Date(),
          id,
        };

        // inform Main.vue
        console.log(payloadForList);
        this.$bus.$emit("afterCreateReply", payloadForList);

        // clear replyContent
        this.clearReplyContent();

        // enable button
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法回復推文，請稍後再試！",
        });
      }
    },
    replyContentCheck(replyContent) {
      if (!replyContent) {
        Toast.fire({
          icon: "error",
          title: "尚未輸入回覆內容！",
        });
        return false;
      }
      if (replyContent.length > 140) {
        Toast.fire({
          icon: "error",
          title: "回覆字數不得超過 140 個字！",
        });
        return false;
      }
      return true;
    },
    closeModal(tweetId) {
      // close modal after successfully replied with pure js
      const modal = document.querySelector(`#tweetReplyModal-${tweetId}`);
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      modal.setAttribute("style", "display: none");

      // get modal backdrop
      const modalBackdrops = document.getElementsByClassName("modal-backdrop");

      // remove opened modal backdrop
      document.body.removeChild(modalBackdrops[0]);
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  padding: 10px 15px;
  display: flex;
}

/* replyTarget */
.replyTarget {
  position: relative;
}

.replyTarget::after {
  position: absolute;
  bottom: 0;
  left: 40px;
  content: "";
  display: block;
  width: 2px;
  transform: translateX(-50%);
  height: calc(100% - 70px);
  background-color: #ccd6dd;
}

/* modal-body */
.modal-body {
  padding: 0;
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
  width: calc(100% - 60px);
}

.userInfo {
  display: flex;
  height: 22px;
}

.userInfo p {
  font-size: 15px;
  height: 100%;
  margin: 0;
}

.userInfo .userName {
  margin-right: 10px;
  font-weight: 700;
}
.userInfo .userAccount,
.userInfo .tweetUpdateAt,
.userInfo span {
  font-weight: 500;
  color: #657786;
  line-height: 22px;
}

.tweetContent {
  width: 100%;
  margin-bottom: 15px;
}

.tweetContent a {
  text-decoration: none;
}

.tweetContent p {
  margin: 0;
  font-weight: 500;
  font-size: 15px;
  word-wrap: break-word;
}

/* panel */
.panel {
  font-size: 13px;
  font-weight: normal;
}

.panel p {
  margin: 0;
  color: #657786;
}

.panel span {
  color: #ff6600;
}

/* myReply */
.myReply .input {
  width: 100%;
}
.myReply textarea,
.myReply input {
  border: none;
  width: 100%;
  resize: none;
}

/* footer */
.modal-footer {
  border-top: none;
}

.tweetButton .btn {
  min-width: 64px;
  height: 40px;
  background-color: #ff6600;
  color: #fff;
  border-radius: 100px;
  font-weight: 500;
  font-size: 18px;
}
</style>