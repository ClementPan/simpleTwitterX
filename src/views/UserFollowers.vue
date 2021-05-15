<template>
  <div id="UserFollowers flex">
    <Spinner v-if="isLoading" />
    <template v-else>
      <!-- // UserSidebar -->
      <UserSidebar />
      <div class="mainSection">
        <div class="title">
          <div class="pre-page">
            <button class="btn" @click="$router.back()">
              <img src="../assets/image/lastPage.svg" alt="" />
            </button>
          </div>
          <div class="title-info">
            <div class="name">{{ user.name }}</div>
            <div class="tweet-count">{{ user.tweetCount }}推文</div>
          </div>
        </div>
        <div class="admin-users-card">
          <!-- // UserFollowNavtabs -->
          <UserFollowNavtabs :userData="user" />
          <!-- // UserFollowersList -->
          <UserFollowersList :followers="followers" />
        </div>
      </div>

      <!-- // RecommendedFollowers -->
      <RecommendedFollowers />
    </template>
  </div>
</template>

<script>
import UserSidebar from "./../components/Common/UserSidebar";
import UserFollowNavtabs from "./../components/UserFollowNavtabs";
import UserFollowersList from "./../components/UserFollowersList";
import RecommendedFollowers from "./../components/Common/RecommendedFollowers";
import { Toast } from "../utils/helpers";
import usersAPI from "../apis/users";
import Spinner from "../components/Common/Spinner";

export default {
  name: "UserFollowers",
  components: {
    UserSidebar,
    UserFollowNavtabs,
    UserFollowersList,
    RecommendedFollowers,
    Spinner,
  },
  // if entering from none userProfiles
  async beforeRouteEnter(to, from, next) {
    try {
      next((vm) => {
        // vue instance not created yet, use next to invoke this
        // console.log("fetchUser @ beforeRouteEnter");
        const { id } = to.params;
        vm.fetchUser(id);
        vm.fetchFollowers(id);
        vm.fetchingData = true;
      });
    } catch (error) {
      console.log(error);
    }
  },
  // if entering from userProfiles
  async beforeRouteUpdate(to, from, next) {
    // console.log("fetchUser @ beforeRouteUpdate");
    try {
      if (this.fetchingData) next();
      const { id } = to.params;
      await this.fetchUser(id);
      this.fetchFollowers(id);
      next();
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      followers: [],
      user: {},
      isLoading: true,
      fetchingData: false,
    };
  },
  created() {
    const { id: userId } = this.$route.params;
    this.fetchFollowers(userId);
    this.fetchUser(userId);
  },
  methods: {
    async fetchUser(userId) {
      try {
        const { data } = await usersAPI.getUser(userId);
        this.user = data;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取得使用者資料，請稍後再試！",
        });
      }
    },
    async fetchFollowers(userId) {
      try {
        const { data } = await usersAPI.getUserFollowers(userId);
        this.followers = data;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取得跟隨者資料，請稍後再試！",
        });
      }
    },
  },
};
</script>

<style scoped>
#UserFollowers {
  justify-content: center;
  min-height: 100vh;
  width: auto;
}

.title {
  margin-bottom: 10px;
}

.pre-page {
  width: 30px;
  margin: 5px 25px 15px 15px;
}

.title-info {
  margin-top: 3px;
  margin-left: 15px;
}

.title-info .name {
  font-weight: 900;
  font-size: 20px;
  line-height: 15px;
  margin-top: 5px;
  padding-bottom: 0;
}
.title-info .tweet-count {
  color: gray;
  font-size: 10px;
  margin-top: 0;
  padding-top: 0;
}
</style>