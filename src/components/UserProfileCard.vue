<template>
  <div class="container">
    <div class="coverImage">
      <img
        :src="localUserData.cover | emptyImageFilter"
        class="card-img-top"
        alt=""
      />
    </div>
    <div class="avatar">
      <img
        :src="localUserData.avatar | emptyImageFilter"
        class="card-img-top"
        alt=""
      />
    </div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">
          {{ localUserData.name ? localUserData.name : "UserName" }}
        </h5>
        <p class="card-account">@{{ localUserData.account }}</p>
        <p class="card-content">
          {{
            localUserData.introduction
              ? localUserData.introduction
              : "Placeholder: It's empty here, write something down!"
          }}
        </p>
        <div class="follow-condition">
          <div class="following-count">
            <router-link :to="`/userprofile/${localUserData.id}/following`"
              ><span>{{ localUserData.followingCount }} 個</span
              >跟隨中</router-link
            >
          </div>
          <div class="follows-count">
            <router-link :to="`/userprofile/${localUserData.id}/followers`"
              ><span>{{ localUserData.followerCount }} 位</span
              >跟隨者</router-link
            >
          </div>
        </div>
      </div>
      <template v-if="userData.id !== undefined">
        <button
          v-if="currentUser.id === localUserData.id"
          class="btn btn-edit-user"
          @click="showModal('#edit-user-modal')"
        >
          編輯個人資料
        </button>

        <!-- btnPanel -->
        <div v-else class="btnPanel">
          <div>
            <button class="btn message" @click="showModal('#messageModal')">
              <img src="../assets/image/btn_message.svg" alt="" />
            </button>
          </div>
          <div>
            <button
              v-if="localUserData.isSubscribed"
              class="btn subscribed"
              :disabled="isProcessing"
              @click.prevent.stop="deleteSubscribe(localUserData)"
            >
              <img src="../assets/image/btn_noti_active.svg" alt="" />
            </button>
            <button
              v-else
              class="btn subscribe"
              :disabled="isProcessing"
              @click.prevent.stop="addSubscribe(localUserData)"
            >
              <img src="../assets/image/btn_noti.svg" alt="" />
            </button>
          </div>
          <div>
            <button
              v-if="localUserData.isFollowed"
              class="btn isFollowing"
              :disabled="isProcessing"
              @click.stop.prevent="unfollowUser(localUserData)"
            >
              正在跟隨
            </button>
            <button
              v-else
              class="btn follow"
              :disabled="isProcessing"
              @click.stop.prevent="followUser(localUserData)"
            >
              跟隨
            </button>
          </div>
        </div>
        <!-- btnPanel -->
        <!-- UserEditModal -->
        <UserEditModal
          @afterSaveSetting="afterSaveSetting"
          :userData="localUserData"
        ></UserEditModal>
        <!-- MessagModal -->
        <MessageModal :userData="userData"></MessageModal>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { emptyImageFilter } from "../utils/mixins";
import { Toast } from "../utils/helpers";
import usersAPI from "../apis/users";
import UserEditModal from "./Modal/UserEditModal";
import MessageModal from "./Modal/MessageModal";
import $ from "jquery";

export default {
  name: "UserProfileCard",
  mixins: [emptyImageFilter],
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  components: {
    UserEditModal,
    MessageModal,
  },
  data() {
    return {
      localUserData: {},
      isProcessing: false,
      roomId: "",
    };
  },
  created() {
    console.log("created userData");
    console.log(this.userData);
    // from RecommendedFollowers
    this.$bus.$on("afterFollowUser", (userId) => {
      this.afterFollowUser(userId);
    });
    // from RecommendedFollowers
    this.$bus.$on("afterUnfollowUser", (userId) => {
      this.afterUnfollowUser(userId);
    });
  },
  methods: {
    async followUser(user) {
      try {
        // call api to toggle isFolloweda
        this.isProcessing = true;
        const payload = user.id;
        const { data } = await usersAPI.followUser(payload);

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        Toast.fire({
          icon: "success",
          title: "追蹤成功！",
        });

        // rerender: invoke this.afterFollowUser(userId, true)
        this.afterFollowUser(user.id, true);

        const { id: userId } = this.$route.params;
        this.$socket.emit("follow", {
          userId,
          currentUserId: this.currentUser.id,
        });

        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法執行動作，請稍後再試！",
        });
      }
    },
    async unfollowUser(user) {
      try {
        this.isProcessing = true;
        const { data } = await usersAPI.unfollowUser(user.id);

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        // rerender: invoke this.afterFollowUser(userId, true)
        this.afterUnfollowUser(user.id, true);

        // inform user
        Toast.fire({
          icon: "success",
          title: "取消追蹤成功！",
        });
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;

        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法追蹤，請稍後再試！",
        });
      }
    },
    afterFollowUser(userId, fromProfileCard = false) {
      // 在目標追蹤者的頁面上，按 ProfileCard 上的追蹤按鈕追蹤
      if (this.userData.id === userId && fromProfileCard) {
        // 追蹤者的 followers 數量 ++
        console.log("Event A");
        this.localUserData.followerCount++;
        this.localUserData.isFollowed = true;
        // inform RecommendedFollowers to toggle
        this.$bus.$emit("toggleFollowFromProfileCard", userId);
        return;
      }

      // 在目標追蹤者的頁面上，按推薦追蹤者欄來追蹤

      if (
        this.userData.id === userId &&
        this.userData.id !== this.currentUser.id
      ) {
        // 追蹤者的 followers 數量 ++
        console.log("Event B");
        this.localUserData.followerCount++;
        this.localUserData.isFollowed = true;
        return;
      }

      // 在個人頁面上，按推薦追蹤追蹤其他使用者
      if (
        this.userData.id !== userId &&
        this.userData.id === this.currentUser.id
      ) {
        // 個人 following 數量 ++
        console.log("Event C");
        this.localUserData.followingCount++;
        return;
      }
      // 在個人頁面上，按推薦追蹤取消追蹤其他使用者
      if (
        this.userData.id !== userId &&
        this.userData.id === this.currentUser.id
      ) {
        // 個人 following 數量 ++
        console.log("Event C");
        this.localUserData.followingCount--;
        return;
      }
    },
    afterUnfollowUser(userId, fromProfileCard = false) {
      // 在目標追蹤者的頁面上，按 ProfileCard 上的追蹤按鈕追蹤
      if (this.userData.id === userId && fromProfileCard) {
        // 追蹤者的 followers 數量 ++
        console.log("Event A");
        this.localUserData.followerCount--;
        this.localUserData.isFollowed = false;
        // inform RecommendedFollowers to toggle
        this.$bus.$emit("toggleFollowFromProfileCard", userId);
        return;
      }

      // 在目標追蹤者的頁面上，按推薦追蹤者欄來取消追蹤

      if (
        this.userData.id === userId &&
        this.userData.id !== this.currentUser.id
      ) {
        // 追蹤者的 followers 數量 ++
        console.log("Event B");
        this.localUserData.followerCount--;
        this.localUserData.isFollowed = false;
        return;
      }

      // 在個人頁面上，按推薦追蹤追蹤其他使用者
      if (
        this.userData.id !== userId &&
        this.userData.id === this.currentUser.id
      ) {
        // 個人 following 數量 ++
        console.log("Event C");
        this.localUserData.followingCount++;
        return;
      }
      // 在個人頁面上，按推薦追蹤取消追蹤其他使用者
      if (
        this.userData.id !== userId &&
        this.userData.id === this.currentUser.id
      ) {
        // 個人 following 數量 ++
        console.log("Event C");
        this.localUserData.followingCount--;
        return;
      }
    },
    // import JQuery from 'jquery'
    showModal(modalId) {
      // $("#edit-user-modal").remove();
      $(modalId).appendTo("body");
      $(modalId).modal("show");
      /// 是不是因為 append 太多 modal，所以沒辦法一次關掉，因為一次只能關一個。
    },
    afterSaveSetting(form) {
      console.log("form: ");
      console.log(form);
      this.localUserData = {
        ...this.localUserData,
        ...form,
      };
      console.log("UserData: ");
      console.log(this.localUserData);
    },
    async addSubscribe(user) {
      try {
        // call api to toggle isFollowed
        this.isProcessing = true;
        const payload = user.id;
        const { data } = await usersAPI.subscribeUser(payload);

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        this.localUserData.isSubscribed = true;

        this.$socket.emit(
          "subscription",
          JSON.parse(sessionStorage.getItem("rooms")),
          user.account
        );

        Toast.fire({
          icon: "success",
          title: "訂閱成功！",
        });
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法執行動作，請稍後再試！",
        });
      }
    },
    async deleteSubscribe(user) {
      try {
        this.isProcessing = true;
        const payload = user.id;
        const { data } = await usersAPI.unsubscribeUser(payload);

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        this.localUserData.isSubscribed = false;

        this.$socket.emit(
          "cancel subscription",
          JSON.parse(sessionStorage.getItem("rooms")),
          user.account
        );

        Toast.fire({
          icon: "success",
          title: "取消訂閱成功！",
        });
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法追蹤，請稍後再試！",
        });
      }
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  watch: {
    userData: {
      handler: function () {
        this.localUserData = this.userData;
      },
      deep: true,
    },
    currentUser: {
      deep: true,
      handler: function () {
        this.startSession();
      },
    },
  },
};
</script>

<style scoped>
.container {
  padding: 0;
  position: relative;
}

.coverImage {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.coverImage img {
  width: 100%;
  height: 100%;
}

.avatar {
  position: absolute;
  width: 140px;
  height: 140px;
  top: 200px;
  left: 84px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: 999;
  object-fit: cover;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.avatar:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 142px;
  height: 142px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  border: 4px solid var(--white) fff;
}

.card {
  margin-top: 70px;
  position: relative;
  padding: 0 15px 20px;
  border: none;
}

.card-title {
  font-size: 19px;
  font-weight: 900;
}

.card-account {
  font-size: 15px;
  font-weight: 500;
  color: #657786;
}

.btn-edit-user {
  position: absolute;
  top: -60px;
  z-index: 999;
  right: 15px;
  height: 40px;
  width: 122px;
  color: var(--orange);
  border-color: var(--orange);
  border-radius: 100px;
}

.btn-edit-user:hover:hover {
  color: var(--white);
  background-color: var(--orange);
}
/* ////////////////////// */
.btnPanel {
  position: absolute;
  top: -60px;
  right: 15px;
  display: flex;
}

button {
  border-radius: 100px;
  color: var(--orange);
  font-weight: 700;
  font-size: 15px;
}

button.btn {
  margin: 0;
  padding: 0;
}

.btn.subscribe {
  margin: 0 10px;
}

button.subscribed {
  margin: 0 10px;
  background-color: var(--orange);
  color: var(--white);
}

.btn.follow,
.btn.isFollowing {
  height: 40px;
  padding: 0 12px;
}

.follow {
  color: var(--orange);
  background-color: var(--white);
  border: 1px solid var(--orange);
}

.isFollowing {
  background-color: var(--orange);
  color: var(--white);
}

/* ////////////////////// */
.card h5,
.card p {
  margin: 0;
}

div.card-body {
  padding: 0;
}

.card-account {
  padding-bottom: 10px;
}

.follow-condition {
  padding-top: 10px;
  display: flex;
}

.follow-condition span {
  font-weight: 700;
  color: #222;
}

.follow-condition a {
  color: #657786;
  font-weight: 700;
}

.follow-condition a:hover {
  text-decoration: none;
}

.follow-condition > div {
  display: block;
  height: 20px;
  font-weight: 500;
  font-size: 14px;
}

.following-count {
  margin-right: 20px;
}
</style>