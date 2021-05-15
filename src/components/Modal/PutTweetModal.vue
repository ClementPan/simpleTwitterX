<template>
  <div
    class="modal fade"
    :id="`putTweetModal-${tweet.id}`"
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
            @click="clearTweetContent"
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
              <div class="tweetContent">
                <textarea
                  v-model="tweetContent"
                  name="tweetContent"
                  id="tweetContent"
                  cols="60"
                  rows="10"
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
              {{ isProcessing ? "更新中.." : "更新" }}
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
import { mapState } from "vuex";
import tweetsAPI from "../../apis/tweets";
import $ from "jquery";

export default {
  name: "PutTweetModal",
  mixins: [emptyImageFilter],
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
      tweetContent: "",
      isProcessing: false,
    };
  },
  created() {
    this.tweetContent = this.tweet.description;
  },
  methods: {
    clearTweetContent() {
      this.tweetContent = this.tweet.description;
    },
    async createReply(tweetId) {
      const result = this.tweetContentCheck(this.tweetContent);
      if (!result) {
        return;
      }
      try {
        this.isProcessing = true;
        const payload = this.tweetContent;
        // call api to create tweet reply
        const { data } = await tweetsAPI.putTweet(tweetId, payload);
        // const { ReplyId } = data;
        // const id = ReplyId;

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        // console.log("replyId", ReplyId);
        // const { id: userId } = this.$route.params;
        // this.$socket.emit("reply", {
        //   userId,
        //   replyId: ReplyId,
        //   reply: this.tweetContent,
        //   currentUserId: this.currentUser.id,
        // });

        // inform user
        Toast.fire({
          icon: "success",
          title: "推文更新成功！",
        });

        $(`#putTweetModal-${tweetId}`).modal("hide");

        // inform Main.vue
        this.$emit("afterPutTweet", this.tweetContent);

        // clear replyContent
        this.clearTweetContent();

        // enable button
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法更新推文，請稍後再試！",
        });
      }
    },
    tweetContentCheck(tweetContent) {
      if (!tweetContent) {
        Toast.fire({
          icon: "error",
          title: "尚未輸入推文內容！",
        });
        return false;
      }
      if (tweetContent.length > 140) {
        Toast.fire({
          icon: "error",
          title: "推文字數不得超過 140 個字！",
        });
        return false;
      }
      return true;
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

textarea {
  margin-top: 5px;
  resize: none;
  border-color: #ccc;
  padding: 5px;
  border-radius: 10px;
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
  background-color: var(--orange);
  color: var(--white);
  border-radius: 100px;
  font-weight: 500;
  font-size: 18px;
}
</style>