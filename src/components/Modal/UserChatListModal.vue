<template>
  <div
    class="modal fade"
    id="allUserList"
    tabindex="-1"
    role="dialog"
    aria-labelledby=""
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <div class="title">
            <h1>選擇要發送訊息的用戶</h1>
          </div>
          <button type="button" class="start btn" @click="closeModal">
            <span aria-hidden="true" data-dismiss="modal" aria-label="Close"
              ><img src="../../assets/image/close.svg" alt=""
            /></span>
          </button>
        </div>

        <div class="modal-body">
          <ul class="userList">
            <Spinner class="spinner" v-if="isProcessing"></Spinner>
            <template v-else>
              <li
                class="userItem"
                v-for="user in allUserList"
                :key="user.id"
                @click="userSelected(user)"
              >
                <div class="userContainer">
                  <div class="avatar">
                    <img :src="user.avatar | emptyImageFilter" alt="" />
                  </div>
                  <div class="userInfo">
                    <p>{{ user.name }}</p>
                    <p>@{{ user.account }}</p>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </div>

        <div class="modal-footer"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "../Spinner";
import { emptyImageFilter } from "../../utils/mixins";
import $ from "jquery";

export default {
  name: "UserChatListModal",
  mixins: [emptyImageFilter],
  components: {
    Spinner,
  },
  props: {
    allUserList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isProcessing: true,
    };
  },
  methods: {
    userSelected(user) {
      console.log("Select userId: " + user.id);
      this.$emit("afterUserSelected", user);
      this.closeModal();
    },
    closeModal() {
      $("#allUserList").modal("hide");
      $(".modal-backdrop").hide();
      const modalBackdrops = document.getElementsByClassName("modal-backdrop");
      document.body.removeChild(modalBackdrops[0]);
    },
  },
  watch: {
    allUserList: {
      deep: true,
      handler: function () {
        this.isProcessing = false;
      },
    },
  },
};
</script>

<style scoped>
.modal-content {
  /* border: 3px solid red; */
  width: 300px;
  left: 50%;
  transform: translateX(-50%);
  top: 0px;
}

.modal-header {
  padding: 0 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 55px;
}

.modal-footer {
  height: 30px;
}

.title {
  height: 100%;
}

.title h1 {
  font-weight: 700;
  font-size: 19px;
  margin: 0;
  line-height: 55px;
}

.modal-body {
  padding: 0;
}

.userList {
  margin: 0;
}

.userItem {
  border-bottom: 1px solid #e6ecf0;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
}

.userItem:hover {
  cursor: pointer;
  background-color: #f7f7f7;
}

.userContainer {
  /* height: 60px; */
  display: flex;
  flex-direction: row;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  height: 100%;
  width: 100%;
}

.userInfo {
  display: flex;
}

.userInfo p {
  margin: 0;
  margin: 0 10px;
  line-height: 60px;
  font-weight: 500;
}

.userInfo p:last-child {
  color: #657786;
}

.spinner {
  margin: 0;
  padding: 0;
}
</style>