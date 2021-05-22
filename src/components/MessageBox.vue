<template>
  <div class="messageBox">
    <template v-if="atPublic">
      <div class="title" @click="updateScroll">
        <h1>公開聊天室</h1>
      </div>
    </template>
    <template v-else>
      <div class="title private" v-if="currentChat.name">
        <h1>{{ currentChat.name ? currentChat.name : "UserName" }}</h1>
        <p>@{{ currentChat.account ? currentChat.account : "UserAccount" }}</p>
      </div>
      <div v-else class="title noChat">
        <h1>開啟聊天！</h1>
      </div>
    </template>

    <div class="container" ref="messageList">
      <ul class="messageList">
        <Spinner v-if="isProcessing"></Spinner>
        <template v-else>
          <div v-if="!messageList.length" class="emptyList">
            <img src="../assets/image/conversation.svg" alt="" />
          </div>
          <!--  -->
          <template v-else v-for="item of messageList">
            <!-- actionItem -->
            <li v-if="item.type === 0" class="actionItem" :key="item.id">
              <p>{{ item.text }}</p>
            </li>

            <!-- messageItem: others -->
            <li
              v-else
              class="messageItem"
              :key="item.id"
              :class="{ currentUser: item.UserId === currentUser.id }"
            >
              <div class="mainContent">
                <div class="avatar">
                  <img :src="item.avatar | emptyImageFilter" alt="" />
                </div>
                <div class="textContainer">
                  <div class="text">
                    {{ item.message }}
                  </div>
                </div>
              </div>
              <div class="textTime">{{ item.createdAt | fromNow }}</div>
            </li>
          </template></template
        >
      </ul>
    </div>
    <div class="meesagePanel">
      <input
        @keyup.enter="sendMessageHandler"
        id="textInput"
        placeholder="輸入訊息..."
        type="text"
        v-model="message"
        maxlength="160"
        required
        :disabled="currentChat.userId === undefined"
      />
      <button
        :disabled="currentChat.userId === undefined"
        type="submit"
        class="btn sendBtn"
        @click="sendMessageHandler"
      >
        <img src="../assets/image/send.svg" alt="" />
      </button>
    </div>
  </div>
</template>

<script>
import Spinner from "./Common/Spinner";
import { fromNowFilter } from "../utils/mixins";
import { emptyImageFilter } from "../utils/mixins";
import { Toast } from "../utils/helpers";
import { mapState } from "vuex";
// import $ from "jquery";

export default {
  name: "MessageBox",
  mixins: [emptyImageFilter, fromNowFilter],
  components: { Spinner },
  props: {
    currentChat: {
      type: Object,
      default: function () {
        return {
          userId: undefined,
          name: "",
          account: "",
        };
      },
    },
    messageList: {
      type: Array,
      required: true,
    },
    atPublic: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      message: "",
      isProcessing: false,
    };
  },
  updated() {
    this.updateScroll();
  },
  methods: {
    messageCheck(message) {
      if (!message.length) {
        Toast.fire({
          icon: "error",
          title: "尚未輸入訊息!",
        });
        return false;
      }
      return true;
    },
    sendMessageHandler: function () {
      const message = this.message;
      const messageCheckResult = this.messageCheck(message);
      if (!messageCheckResult) {
        return;
      }

      const newMessage = !this.messageList.length;
      console.log("atPublic: " + this.atPublic);

      const messageMode = this.atPublic
        ? "chat message"
        : "private chat message";

      this.sendMessage(messageMode, message, newMessage);

      this.message = "";

      Toast.fire({
        icon: "success",
        title: "訊息已發送!",
      });
    },
    sendMessage(messageMode, message, newMessage) {
      console.log("messageMode: " + messageMode);
      console.log("message: " + message);
      console.log("newMessage: " + newMessage);
      return this.$socket.emit(
        messageMode,
        {
          newMessage,
          message,
        },
        () => {
          console.log("currentRoomId: " + this.currentRoomId);
          console.log(`private chat message, new: ${newMessage}`);
        }
      );
    },
    toggleIsProcessing() {
      this.isProcessing = !this.isProcessing;
    },
    updateScroll() {
      this.$refs.messageList.scrollTop = this.$refs.messageList.scrollHeight;
    },
  },
  computed: {
    ...mapState(["currentUser", "currentRoomId"]),
  },
};
</script>

<style scoped>
.messageBox {
  flex: 2;
}
.messageBox .title {
  border-bottom: 1px solid #e6ecf0;
  height: 55px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: var(--white);
  z-index: 1;
}

.messageBox .private {
  display: block;
  padding: 0;
  padding-left: 10px;
}

.private h1 {
  height: 50%;
  line-height: 35px;
}
.private p {
  margin: 0;
  padding: 0;
  height: 50%;
}
.title h1 {
  font-weight: 700;
  font-size: 19px;
  margin: 0;
}

.noChat {
  height: 55px;
  display: flex;
  align-items: center;
}

.noChat h1 {
  /* margin-top: 20px; */
  display: inline-block;
}

/* message box */

.messageBox .container {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 115px);
  overflow-y: scroll;
}

.avatar {
  width: 50px;
  height: 50px;
  border: 1px solid var(--white);
  border-radius: 50%;
}
.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.messageBox .container::-webkit-scrollbar {
  display: none;
}

/* for Chrome, Safari and Opera */
.messageBox .container {
  -ms-overflow-style: none;
}

.messageList {
  flex: 1;
  margin: 0;
  /* min-height: 100%; */
}

.messageList .emptyList {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.messageList .emptyList img {
  min-width: 5%;
  width: 50px;
  height: 50px;
}

.mainContent {
  max-width: 60%;
  /* width: 200px; */
  /* height: 50px; */
  margin: 10px 10px 0 10px;
  display: flex;
  align-items: flex-end;
}
.textTime {
  margin-left: 70px;
  color: #777;
  font-weight: 500;
}
.messageItem .avatar {
  min-width: 50px;
  height: 50px;
}
.messageItem .textContainer {
  word-break: break-all;
  margin-left: 10px;
  height: 100%;
}
.messageItem .textContainer .text {
  padding: 10px 15px;
  border-radius: 20px 20px 20px 0;
  background: #e6ecf0;
  font-size: 16px;
}
.actionItem {
  margin: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.actionItem p {
  margin: 0;
  width: auto;
  background-color: hsl(0deg 0% 90%);
  color: hsl(207deg 14% 46%);
  padding: 5px 10px;
  border-radius: 10px;
  font-weight: 500;
}
/*////////// currentUser's message ///////////*/
.currentUser {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.currentUser .textContainer .text {
  border-radius: 20px 20px 0 20px;
  background-color: hsl(24deg 100% 50%);
  color: var(--white);
}
.currentUser .textTime {
  margin: 0;
  margin: 10px 10px 0;
}

.currentUser .mainContent .avatar {
  display: none;
}

.currentUser .textTime {
}

/*/ ////////////////// panel ///////////////*/
.meesagePanel {
  height: 60px;
  padding: 10px;
  display: flex;
  border: 1px solid #e6ecf0;
}
#textInput {
  flex: 1;
  height: 40px;
  outline: none;
  border: none;
  padding: 10px;
  background: #e6ecf0;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 500;
}
.sendBtn {
  width: 40px;
  height: 40px;
  padding: 0;
  padding-right: 10px;
  margin-left: 10px;
}

.sendBtn img {
  transform: rotate(45deg);
}
</style>
