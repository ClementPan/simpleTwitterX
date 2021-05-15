<template>
  <div
    class="modal fade"
    id="tweetModal"
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
            @click="tweetContent = ''"
          >
            <span aria-hidden="true"
              ><img src="../../assets/image/close.svg" alt=""
            /></span>
          </button>
        </div>

        <div class="modal-body">
          <div class="container">
            <div class="avatar">
              <img :src="user.avatar | emptyImageFilter" alt="" />
            </div>
            <div class="textInput">
              <textarea
                name=""
                id=""
                cols="65"
                rows="5"
                autofocus
                maxlength="140"
                required
                v-model="tweetContent"
                placeholder="有什麼新鮮事？ (字數限制 140 字元)"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="tweetButton">
            <button
              type="button"
              class="btn"
              @click="createNewTweet"
              :disabled="isProcessing"
            >
              {{ isProcessing ? "推文中" : "推文" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import {mapState} from 'vuex'
import { Toast } from "../../utils/helpers";
import { emptyImageFilter } from "../../utils/mixins";
import tweetsAPI from "../../apis/tweets";
import { mapState } from "vuex";
// jquery for closing modal
import $ from "jquery";

export default {
  name: "CreateTweetModal",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  mixins: [emptyImageFilter],
  data() {
    return {
      tweetContent: "",
      isProcessing: false,
    };
  },
  methods: {
    async createNewTweet() {
      const contentCheck = this.contentCheck(this.tweetContent);
      if (!contentCheck) {
        this.tweetContent = "";
        return;
      }
      try {
        this.isProcessing = true;
        // data
        const payload = {
          description: this.tweetContent,
        };
        // call api to create new tweet: 回傳 tweet id?
        const { data } = await tweetsAPI.createNewTweet(payload);

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        const { id, UserId, createdAt, description, updatedAt } = data.tweet[0];

        const { account, name, avatar } = this.currentUser;
        const newTweet = {
          user: { account, name, avatar },
          id,
          UserId,
          createdAt,
          description,
          updatedAt,
        };

        this.$socket.emit("notification", {
          userId: UserId,
          tweetId: id,
          tweet: description,
        });

        // inform user
        Toast.fire({
          icon: "success",
          title: "推文成功！",
        });

        $("#tweetModal").modal("hide");

        const modalId = "#tweetModal";
        this.$bus.$emit("closeModal", modalId);

        // inform Main.vue to push new tweet
        // inform UserProfile to push new tweet
        this.$bus.$emit("afterCreateTweet", newTweet);

        // clear tweetContent
        this.tweetContent = "";

        // enable button
        this.isProcessing = false;
      } catch (error) {
        console.log(error);
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法推文，請稍後再試！",
        });
      }
    },
    contentCheck(tweetContent) {
      // 內容檢查：不能空白
      const checkTarget = tweetContent.trim();
      if (!checkTarget) {
        Toast.fire({
          icon: "error",
          title: "尚未輸入推文內容！",
        });
        return false;
      }
      // 內容檢查：字數小於140
      if (checkTarget.length > 140) {
        Toast.fire({
          icon: "error",
          title: "推文字數不得超過 140 個字！",
        });
        return false;
      }
      return true;
    },
    closeModal(modalId) {
      // close modal after successfully replied with pure js
      const modal = document.querySelector(`#${modalId}`);
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
  display: flex;
  align-items: center;
  padding: 0;
}

.avatar img,
.imagePlaceholder {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3c3c3c;
}

/* modal */
.modal-content {
  height: 300px;
  border-radius: 14px;
  width: 600px;
}

.modal-header {
  border-bottom: 1px solid #e6ecf0;
}

.modal-body {
  height: 245px;
}

.modal-body input {
  width: 100%;
}

.modal-content .container {
  align-items: start;
}

.textInput {
  flex: 1;
  margin-left: 10px;
}

.textInput textarea,
.textInput input {
  border: none;
  resize: none;
  background-color: transparent;
}

.textInput p {
  font-weight: 500;
  font-size: 18px;
  color: #9197a3;
}

.textInput p:hover {
  cursor: pointer;
}

.textInput input::placeholder {
  font-weight: 500;
  font-size: 18px;
  color: #9197a3;
}

.tweetButton {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
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

.modal-footer {
  border: none;
}

/* modal */
</style>