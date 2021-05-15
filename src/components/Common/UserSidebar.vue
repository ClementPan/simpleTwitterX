<template>
  <div class="userSidebar">
    <div class="logo">
      <router-link to="/main">
        <img src="../../assets/image/logo.png" alt="" />
      </router-link>
    </div>
    <div class="buttonList">
      <div class="navItem index">
        <div v-if="location === 'main'" class="icon">
          <!-- 橘色 -->
          <img src="../../assets/image/atHome.svg" alt="" />
        </div>
        <div v-else class="icon">
          <!-- 黑色 -->
          <img src="../../assets/image/home.svg" alt="" />
        </div>
        <button class="btn">
          <router-link to="/main">
            <p v-if="location === 'main'" class="located" id="routerMain">
              首頁
            </p>
            <p v-else id="routerMain">首頁</p>
          </router-link>
        </button>
      </div>
      <!--  -->

      <div class="navItem notification">
        <div class="icon">
          <img
            v-if="this.noti.length > 0"
            src="../../assets/image/getNoti.svg"
            alt=""
          />
          <img
            v-else-if="notification"
            src="../../assets/image/atNoti.svg"
            alt=""
          />
          <img v-else src="../../assets/image/noti.svg" alt="" />
        </div>
        <button class="btn">
          <router-link to="/notification">
            <p
              v-if="location === 'notification'"
              class="located"
              id="routerNotification"
            >
              通知
            </p>
            <p v-else id="routerNotification">通知</p>
          </router-link>
        </button>
      </div>
      <!--  -->

      <div class="navItem userProfile">
        <div v-if="location === 'publicMessage'" class="icon">
          <i class="far fa-envelope tempIcon"></i>
        </div>
        <div v-else class="icon">
          <i class="far fa-envelope tempIcon"></i>
        </div>
        <button class="btn">
          <router-link to="/publicMessage">
            <p
              v-if="location === 'publicMessage'"
              class="located"
              id="routerPublicMessage"
            >
              公開聊天室
            </p>
            <p v-else id="routerPublicMessage">公開聊天室</p>
          </router-link>
        </button>
      </div>
      <!--  -->

      <div class="navItem userProfile">
        <div v-if="location === 'privateMessage'" class="icon">
          <i class="far fa-envelope tempIcon"></i>
        </div>
        <div v-else class="icon">
          <i class="far fa-envelope tempIcon"></i>
        </div>
        <button class="btn">
          <router-link to="/privateMessage">
            <p
              v-if="location === 'privateMessage'"
              class="located"
              id="routerPrivateMessage"
            >
              私人訊息
            </p>
            <p v-else id="routerPrivateMessage">私人訊息</p>
          </router-link>
        </button>
      </div>
      <!--  -->

      <div class="navItem userProfile">
        <div v-if="location === 'userProfile'" class="icon">
          <img src="../../assets/image/atProfile.svg" alt="" />
        </div>
        <div v-else class="icon">
          <img src="../../assets/image/profile.svg" alt="" />
        </div>
        <button class="btn">
          <router-link
            :to="{ name: 'user-profile', params: { id: currentUser.id } }"
          >
            <p
              v-if="location === 'userProfile'"
              class="located"
              id="routerProfile"
            >
              個人資料
            </p>
            <p v-else id="routerProfile">個人資料</p>
          </router-link>
        </button>
      </div>
      <div class="navItem setting">
        <div v-if="location === 'accountEdit'" class="icon">
          <img src="../../assets/image/atSetting.svg" alt="" />
        </div>
        <div v-else class="icon">
          <img src="../../assets/image/setting.svg" alt="" />
        </div>
        <button class="btn">
          <router-link to="/accountEdit">
            <p
              v-if="location === 'accountEdit'"
              class="located"
              id="routerSetting"
            >
              設定
            </p>
            <p v-else id="routerSetting">設定</p>
          </router-link>
        </button>
      </div>
      <div class="navItem newTweet">
        <button class="btn" @click="showModal">
          <p>推文</p>
        </button>
        <CreateTweetModal :user="currentUser"></CreateTweetModal>
      </div>
      <div class="navItem logout">
        <div class="icon">
          <img src="../../assets/image/logout.svg" alt="" />
        </div>
        <button class="btn" @click.stop.prevent="logout">
          <p>登出</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import CreateTweetModal from "./Modal/CreateTweetModal";
import CreateTweetModal from "../Modal/CreateTweetModal";
import $ from "jquery";

export default {
  name: "UserSidebar",
  components: { CreateTweetModal },
  data() {
    return {
      noti: [],
      main: false,
      notification: false,
      publicMessage: false,
      privateMessage: false,
      profile: false,
      accountEdit: false,
      location: " ",
    };
  },
  sockets: {
    connection: function (data) {
      console.log("Data:" + data);
    },
    notification: function (data) {
      console.log("notification", data);
      this.noti.push(data.id);

      if (data && !this.notification) {
        this.$socket.emit(
          "tweet",
          {
            id: data.id,
            account: data.account,
            name: data.name,
            UserId: data.id,
            avatar: data.avatar,
            tweetId: data.tweetId,
            tweet: data.tweet,
            replyId: data.replyId,
            reply: data.reply,
          },
          this.currentUser.id
        );
      }
    },
  },
  created() {
    this.$bus.$on("closeModal", (modalId) => {
      this.closeModal(modalId);
    });
    const location = this.$route.path.split("/")[1];
    this.setCurrentLocation(location);
  },
  methods: {
    logout() {
      // delete token => log out
      this.$store.commit("revokeAuthentication");
      this.$router.push("/signin");
      sessionStorage.clear();
    },
    showModal() {
      console.log("open from sidebar");
      $("#tweetModal").modal("show");
    },
    closeModal(modalId) {
      console.log("closed");
      $(modalId).modal("hide");
      $(".modal-backdrop").hide();
    },
    setCurrentLocation(location) {
      console.log("location: " + location);
      switch (location) {
        case "main":
          this.main = true;
          break;
        case "notification":
          this.notification = true;
          break;
        case "publicMessage":
          this.publicMessage = true;
          break;
        case "privateMessage":
          this.privateMessage = true;
          break;
        case "profile":
          this.profile = true;
          break;
        case "accountEdit":
          this.accountEdit = true;
          break;
      }
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style scoped>
.userSidebar {
  margin-left: 103px;
  width: 235px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e6ecf0;
}
.logo {
  margin-bottom: 24px;
}
.logo img {
  width: 50px;
  height: 50px;
}
.buttonList {
  flex: 1;
  position: relative;
}
.buttonList .navItem {
  height: 60px;
  display: flex;
  align-items: center;
}

.navItem .btn .located {
  color: var(--orange);
}

.icon {
  height: 26px;
}

.btn {
  padding: 0;
}

.btn a {
  text-decoration: none;
}

.btn p {
  height: 26px;
  margin: 0;
  font-weight: 700;
  font-size: 18px;
  color: #1c1c1c;
}

.newTweet p {
  font-weight: 500;
}

.icon img,
.icon .tempIcon {
  margin: 17px 0;
  width: 16px;
  height: 20px;
  margin: 0 25px 0 10px;
}

.newTweet button {
  width: 210px;
  height: 45px;
  border-radius: 100px;
  background-color: var(--orange);
}
.newTweet button p {
  color: var(--white);
}
.logout {
  position: absolute;
  bottom: 0;
}
</style>