<template>
  <div class="userSidebar">
    <div class="logo">
      <router-link to="/main">
        <img src="../assets/image/logo.png" alt="" />
      </router-link>
    </div>
    <div class="buttonList">
      <div class="navItem index">
        <div class="icon">
          <img v-if="tweets" src="../assets/image/atHome.svg" alt="" />
          <img v-else src="../assets/image/home.svg" alt="" />
        </div>
        <button class="btn">
          <router-link to="/admin/tweets">
            <p :class="{ active: tweets }" id="routerTweets">推文清單</p>
          </router-link>
        </button>
      </div>
      <div class="navItem userProfile">
        <div class="icon">
          <img v-if="users" src="../assets/image/atProfile.svg" alt="" />
          <img v-else src="../assets/image/profile.svg" alt="" />
        </div>
        <button class="btn">
          <router-link to="/admin/users">
            <p :class="{ active: users }" id="routerUsers">使用者列表</p>
          </router-link>
        </button>
      </div>

      <div class="navItem logout">
        <div class="icon">
          <img src="../assets/image/logout.svg" alt="" />
        </div>
        <button class="btn" @click.stop.prevent="logout">
          <p>登出</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminSidebar",
  created() {
    const location = this.$route.path.split("/")[2];
    this.setCurrentLocation(location);
  },
  data() {
    return {
      tweets: false,
      users: false,
    };
  },
  methods: {
    logout() {
      // delete token => log out
      this.$store.commit("revokeAuthentication");
      this.$router.push("/admin/signin");
    },
    setCurrentLocation(location) {
      console.log("location: " + location);
      if (location === "tweets") {
        this.tweets = true; // at tweets
        this.users = false;
      } else {
        this.tweets = false;
        this.users = true; // at users
      }
    },
  },
};
</script>

<style scoped>
.userSidebar {
  margin-left: 103px;
  width: 235px;
  height: auto;
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
.navItem .btn .active p {
  color: #ff6600;
}
/* .navItem .btn .active {
  border: 1px solid #000;
} */
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
.icon img {
  margin: 17px 0;
  width: 16px;
  height: 20px;
  margin: 0 25px 0 10px;
}
.newTweet button {
  width: 210px;
  height: 45px;
  border-radius: 100px;
  background-color: #ff6600;
}
.newTweet button p {
  color: #fff;
}
.logout {
  position: absolute;
  bottom: 0;
}
</style>