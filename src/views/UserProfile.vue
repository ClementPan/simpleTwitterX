<template>
  <div id="userProfile">
    <!--  UserSidebar -->
    <UserSidebar />
    <div class="mainSection">
      <div class="title">
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
import UserSidebar from "./../components/UserSidebar";
// import UserProfileCard from "./../components/UserProfileCard";
import UserProfileCard from "./../components/UserProfileCard";
import UserProfileNavtabs from "./../components/UserProfileList/UserProfileNavtabs";
import UserProfileTweetsList from "./../components/UserProfileList/UserProfileTweetsList";
import RecommendedFollowers from "./../components/RecommendedFollowers";
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
        // console.log("fetchUser @ beforeRouteEnter");
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
    // console.log("fetchUser @ beforeRouteUpdate");
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
      // console.log("fetchUser in UserProfile");
      // console.log("fetchUser:" + userId);
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
    // afterCreateReply(tweetId) {
    //   this.tweets = this.tweets.map((tweet) => {
    //     if (tweet.id === tweetId) {
    //       return {
    //         ...tweet,
    //         replyCount: tweet.replyCount + 1,
    //       };
    //     } else {
    //       return tweet;
    //     }
    //   });
    // },
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
  flex: 1;
  width: 100%;
  height: 100vh;
  border-right: 1px solid #e6ecf0;
  overflow-y: scroll;
  position: relative;
}

/* for Chrome, Safari and Opera */
.mainSection {
  -ms-overflow-style: scrollbar;
  /* IE and Edge */
  /* scrollbar-width: 8px; */
  /* Firefox */
}

.mainSection::-webkit-scrollbar {
  width: 8px;
}

.mainSection::-webkit-scrollbar-thumb {
  background-color: #9197a3;
  border-radius: 15px;
}

.mainSection::-webkit-scrollbar-track {
  background-color: #ddd;
}
.title {
  height: 55px;
  border-bottom: 1px solid #e6ecf0;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
  /* z-index: 999; */
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
  /* work with z-index */
  z-index: 0;
}
</style>