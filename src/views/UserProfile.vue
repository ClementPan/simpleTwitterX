<template>
  <div id="userProfile">
    <!--  UserSidebar -->
    <UserSidebar />
    <div class="mainSection">
      <div class="title stickyTitle">
        <button class="btn" @click="$router.back()">
          <img src="../assets/image/lastPage.svg" alt="" />
        </button>
        <div class="nameTag">
          <p>{{ user.name }}</p>
          <p>{{ user.tweetCount }} 則推文</p>
        </div>
      </div>
      <div class="admin-users-card">
        <!--  UserProfileCard -->
        <UserProfileCard :userData="user" />
        <!--  UserProfileNavtabs -->
        <UserProfileNavtabs :userData="user" />
        <!--  UserProfileTweetsList -->
        <UserProfileTweetsList :userData="user" />
      </div>
    </div>

    <!-- RecommendedFollowers -->
    <RecommendedFollowers />
  </div>
</template>

<script>
import UserSidebar from "./../components/Common/UserSidebar";
import UserProfileCard from "./../components/UserProfileCard";
import UserProfileNavtabs from "./../components/UserProfileList/UserProfileNavtabs";
import UserProfileTweetsList from "./../components/UserProfileList/UserProfileTweetsList";
import RecommendedFollowers from "./../components/Common/RecommendedFollowers";
import { Toast } from "../utils/helpers";
import { mapState } from "vuex";
import usersAPI from "../apis/users";

export default {
  name: "UserProfile",
  components: {
    UserSidebar,
    UserProfileCard,
    UserProfileNavtabs,
    UserProfileTweetsList,
    RecommendedFollowers,
  },
  // if entering from none userProfiles
  async beforeRouteEnter(to, from, next) {
    try {
      next((vm) => {
        // vue instance not created yet, use next to invoke this
        const { id } = to.params;
        vm.fetchUser(id);
        vm.fetchingData = true;
      });
    } catch (error) {
      console.log(error);
    }
  },
  // if entering from userProfiles
  async beforeRouteUpdate(to, from, next) {
    try {
      if (this.fetchingData) next();
      const { id } = to.params;
      await this.fetchUser(id);
      next();
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      user: {},
      tweets: [],
      fetchingData: false,
    };
  },
  methods: {
    async fetchUser(userId) {
      try {
        const { data } = await usersAPI.getUser(userId);
        this.user = data;
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取得使用者資訊，請稍後再試！",
        });
      }
    },
    afterToggleLike(toggleTweet) {
      // rerender
      this.tweets = this.tweets.map((tweet) => {
        if (tweet.id === toggleTweet.id) {
          return {
            ...tweet,
            isLiked: toggleTweet.isLiked,
          };
        } else {
          return tweet;
        }
      });
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style scoped>
#userProfile {
  display: flex;
  min-height: 100vh;
  justify-content: center;
}

.mainSection {
  overflow-y: scroll;
}

.title {
  z-index: 1;
}

.title .btn {
  padding: 0;
  height: 100%;
  width: 20px;
  margin-right: 43px;
  display: flex;
  align-items: center;
}

.title img {
  height: 14px;
  width: 17px;
}

.title img:hover {
  cursor: pointer;
}

.nameTag p:first-child {
  height: 24px;
  font-weight: 900;
  font-size: 19px;
  margin: 0;
}
.nameTag p:last-child {
  font-weight: 500;
  height: 19px;
  font-size: 13px;
  color: #657789;
  margin: 0;
}

.admin-users-card {
  position: relative;
  z-index: 0;
}
</style>