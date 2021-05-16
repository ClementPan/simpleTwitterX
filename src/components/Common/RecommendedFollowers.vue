<template>
  <div class="container">
    <div class="title">
      <h1>跟隨誰</h1>
    </div>
    <hr />
    <div class="users">
      <ul class="usersList">
        <spinner class="spinner" v-if="isLoading"></spinner>
        <template v-else>
          <li class="user" v-for="user of recommendedFollowers" :key="user.id">
            <div class="userContent">
              <div class="avatar">
                <router-link :to="`/userProfile/${user.id}`">
                  <img :src="user.avatar | emptyImageFilter" alt="" />
                </router-link>
              </div>
              <div class="info">
                <div class="name">
                  <router-link :to="`/userProfile/${user.id}`">
                    <h2>{{ user.name }}</h2>
                  </router-link>
                </div>
                <div class="account">
                  <router-link :to="`/userProfile/${user.id}`">
                    <h2>@{{ user.account }}</h2>
                  </router-link>
                </div>
              </div>
              <div class="toggleFollow">
                <button
                  v-if="user.isFollowed"
                  class="btn isFollowing"
                  @click.prevent.stop="unfollowUser(user)"
                  :disabled="isProcessing"
                >
                  正在跟隨
                </button>
                <button
                  v-else
                  class="btn"
                  @click.prevent.stop="followUser(user)"
                  :disabled="isProcessing"
                >
                  跟隨
                </button>
              </div>
            </div>
            <hr />
          </li>
        </template>
      </ul>
    </div>

    <div class="showMore">
      <button class="btn" @click="fetchRecommendedFollowers">顯示更多</button>
    </div>
  </div>
</template>

<script>
import Spinner from "./Spinner";
import usersAPI from "../../apis/users";
import { emptyImageFilter } from "../../utils/mixins";
import { Toast } from "../../utils/helpers";
import { mapState } from "vuex";

export default {
  components: { Spinner },
  name: "RecommendedFollowers",
  mixins: [emptyImageFilter],
  created() {
    this.fetchRecommendedFollowers();
    // bus.emit from UserProfileCard
    this.$bus.$on("toggleFollowFromProfileCard", (userId) => {
      this.renderAfterFollowToggle(userId);
    });
  },
  data() {
    return {
      recommendedFollowers: [],
      isLoading: true,
      isProcessing: false,
    };
  },
  methods: {
    async fetchRecommendedFollowers() {
      try {
        this.isLoading = true;
        // call api to get recommended Followers data
        const { data } = await usersAPI.getRecommendedFollowers();
        this.recommendedFollowers = data.filter(
          (user) => user.id !== this.currentUser.id
        );
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法取得推薦追蹤資料，請稍後再試！",
        });
      }
    },
    async followUser(user) {
      try {
        // call api to toggle isFolloweda
        this.isProcessing = true;
        const userId = user.id;
        const { data } = await usersAPI.followUser(userId);

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        // rerender
        this.renderAfterFollowToggle(user);

        // inform userProfileCard to change number
        this.$bus.$emit("afterFollowUser", user.id);

        Toast.fire({
          icon: "success",
          title: "追蹤成功！",
        });

        this.$socket.emit("follow", {
          userId: user.id,
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

        // rerender
        this.renderAfterFollowToggle(user);

        // inform userProfileCard to change number
        this.$bus.$emit("afterUnfollowUser", user.id);

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
    disabledButtonAlert() {
      Toast.fire({
        icon: "info",
        title: "這個按鈕目前沒有功能，請下個月再試！",
      });
    },
    renderAfterFollowToggle(user) {
      let userId = "";
      if (typeof user === "number") {
        // getting 'userId' from UserProfileCard
        userId = user;
      } else {
        // getting 'user' from RecommendedFollowers
        userId = user.id;
      }

      this.recommendedFollowers = this.recommendedFollowers.map((each) => {
        if (each.id === userId) {
          return {
            ...each,
            isFollowed: !each.isFollowed,
          };
        } else {
          return each;
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
.container {
  width: 350px;
  margin: 15px 82px auto 30px;
  background-color: #f5f8fa;
  border-radius: 14px;
  padding: 0;
  display: block;
}

.title {
  padding: 10px 15px;
}

.title h1 {
  font-size: 18px;
}

hr {
  margin: 0;
}

.usersList {
  margin: 0;
}

.userContent {
  display: flex;
  padding: 10px 15px;
  justify-content: space-between;
  align-items: center;
}

.userContent .avatar {
  height: 50px;
  width: 50px;
  background-color: #c4c4c4;
  border-radius: 50%;
}
.userContent .avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.userContent .info {
  flex: 1;
  margin: 0 10px;
}

.userContent .info h2 {
  font-size: 15px;
  font-weight: 700;
}

.userContent .info .account h2 {
  color: #657786;
}

button {
  border: 1px solid var(--orange);
  border-radius: 100px;
  color: var(--orange);
}

.toggleFollow button {
  font-size: 15px;
  font-weight: 700;
}

.toggleFollow .isFollowing {
  width: 92px;
  background-color: var(--orange);
  color: var(--white);
}

.showMore {
  padding: 12px 0 12px 15px;
}

.showMore .btn {
  padding: 4px 8px;
  border: none;
  font-weight: 400;
}

.spinner {
  padding: 0;
}
</style>