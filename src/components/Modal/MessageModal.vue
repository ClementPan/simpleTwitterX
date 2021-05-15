<template>
  <div
    class="modal fade"
    id="messageModal"
    tabindex="-1"
    role="dialog"
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
          >
            <img src="../../assets/image/close.svg" alt="" />
          </button>

          <p class="title">傳送訊息給 {{ localUserData.name }}</p>
          <button
            :disabled="processing"
            class="btn send"
            @click="sendPrivateMessage"
          >
            傳送
          </button>
        </div>

        <div class="modal-body">
          <textarea
            name="privateMessage"
            id="privateMessage"
            cols="75"
            rows="8"
            required
            maxlength="160"
            v-model="privateMessage"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "../../utils/helpers";
import { mapState } from "vuex";
import socketsAPI from "../../apis/socket";

export default {
  name: "MessageModal",
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localUserData: {},
      privateMessage: "",
      processing: false,
    };
  },
  methods: {
    async sendPrivateMessage() {
      this.processing = true;

      const message = this.privateMessage;
      if (!message) {
        Toast.fire({
          icon: "error",
          title: "尚未輸入訊息!",
        });
        return;
      }

      // 判斷有沒有聊過天
      try {
        const { data } = await socketsAPI.getRoomsByUser();
        const historyMessages = data.find(
          (each) => each.userId === this.localUserData.id
        );
        let hasSpoken = historyMessages.length ? true : false;

        if (hasSpoken) {
          // hasSpoken = true
          let roomId = historyMessages.roomId;
          this.$socket.emit(
            "private chat message",
            {
              roomId: historyMessages.roomId,
              userId: this.currentUser.id,
              newMessage: !hasSpoken,
              message,
            },
            () => {
              console.log("currentRoomId: " + roomId);
              console.log(`private chat message, new: ${!hasSpoken}`);
            }
          );
          this.privateMessage = "";
          this.processing = false;
          Toast.fire({
            icon: "success",
            title: "已發送訊息",
          });
          console.log("currentRoomId: " + roomId);
          console.log(`private chat message, new: ${!hasSpoken}`);
          return;
        } else {
          // hasSpoken = false;
          // create new room
          const roomId = await this.createNewChat(this.localUserData.id);
          this.joinPrivateRoom(roomId);
          this.$store.commit("setCurrentRoomId", roomId);

          // send message
          this.$socket.emit(
            "private chat message",
            {
              roomId: roomId,
              userId: this.currentUser.id,
              newMessage: !hasSpoken,
              message,
            },
            () => {
              console.log("currentRoomId: " + this.currentRoomId);
              console.log("private chat message, new: false");
            }
          );
          console.log("currentRoomId: " + this.currentRoomId);
          console.log(`private chat message, new: ${!hasSpoken}`);
          this.privateMessage = "";
          this.processing = false;

          Toast.fire({
            icon: "success",
            title: "已發送訊息",
          });
          return;
        }
      } catch (error) {
        this.processing = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: error,
        });
      }
    },
    async createNewChat(userId) {
      try {
        const { data } = await socketsAPI.createPrivateRoom(userId);
        const { roomId } = data;

        console.log(data);
        console.log("RoomId: " + roomId);

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        Toast.fire({
          icon: "success",
          title: "已建立連線！",
        });

        this.$socket.emit("leave", this.currentUser.id, this.currentRoomId);
        return roomId;
      } catch (error) {
        console.log(error);
      }
    },
    joinPrivateRoom(roomId) {
      console.log("join private room: " + roomId);
      this.$socket.emit("join", {
        username: this.currentUser.name,
        roomId,
        userId: this.currentUser.id,
      });
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
  watch: {
    userData: {
      handler: function () {
        this.localUserData = this.userData;
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(["currentUser", "currentRoomId"]),
  },
};
</script>

<style scoped>
/*  */
.modal-content {
  top: 100px;
  width: 600px;
  height: 300px;
}

.modal-header {
  padding: 0;
  height: 55px;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}

button.start {
  display: flex;
  align-items: center;
  justify-content: center;
}

p.title {
  font-size: 19px;
  font-weight: 700;
  height: 100%;
  padding: 0;
  margin: 0;
  line-height: 55px;
  margin-left: 44px;
}

.modal-body {
  padding: 0;
  display: grid;
  place-items: center;
}

textarea {
  resize: none;
  border-radius: 20px;
  border: none;
  border: 1px solid #dee2e6;
  padding: 10px;
}

.send {
  position: absolute;
  right: 20px;
  background-color: var(--orange);
  color: var(--white);
}
</style>