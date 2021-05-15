<template>
  <div class="container">
    <div
      class="follower-container"
      v-for="follower of followers"
      :key="follower.followerId"
    >
      <div class="avatar">
        <img :src="follower.avatar | emptyImageFilter" alt="" />
      </div>
      <div class="follower-info">
        <div class="isfollowed-info">
          <div class="follower-title">
            <router-link
              :to="{
                name: 'user-profile',
                params: { id: follower.followerId },
              }"
            >
              <div class="name">{{ follower.name }}</div>
            </router-link>
            <div class="account">@{{ follower.account }}</div>
          </div>

          <div class="toggleFollow">
            <button
              v-if="follower.isFollowing"
              class="btn isFollowing"
              @click.prevent.stop="deleteFollowing(follower)"
              :disabled="isProcessing"
            >
              正在跟隨
            </button>
            <button
              v-else
              class="btn"
              @click.prevent.stop="addFollowing(follower)"
              :disabled="isProcessing"
            >
              跟隨
            </button>
          </div>
        </div>
        <p>{{ follower.introduction }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import usersAPI from "../apis/users";
import { emptyImageFilter } from "../utils/mixins";
import { Toast } from "../utils/helpers";
import { mapState } from "vuex";

export default {
  name: "UserFollowersList",
  mixins: [emptyImageFilter],
  props: {
    Followers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      followers: [],
      isProcessing: false,
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  watch: {
    Followers(newVal) {
      this.fetchfollowers(newVal);
    },
  },
  created() {
    this.fetchfollowers();
  },
  methods: {
    fetchfollowers() {
      this.followers = this.Followers;
    },
    async addFollowing(follower) {
      try {
        // call api to toggle isFolloweda
        this.isProcessing = true;
        const payload = follower.followerId;
        const { data } = await usersAPI.followUser(payload);

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        this.renderAfterFollowToggle(follower);
        const { id: userId } = this.$route.params;
        this.$socket.emit("follow", {
          userId,
          currentUserId: this.currentUser.id,
        });

        Toast.fire({
          icon: "success",
          title: "追蹤成功！",
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
    async deleteFollowing(follower) {
      try {
        this.isProcessing = true;
        const { data } = await usersAPI.unfollowUser(follower.followerId);
        if (data.status !== "success") {
          throw new Error(data.message);
        }

        this.renderAfterFollowToggle(follower);
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
    renderAfterFollowToggle(follower) {
      this.followers = this.followers.map((_follower) => {
        if (_follower.followerId === follower.followerId) {
          return {
            ..._follower,
            isFollowing: !follower.isFollowing,
          };
        } else {
          return _follower;
        }
      });
    },
  },
};
</script>

<style scoped>
.follower-container {
  display: flex;
  height: auto;
  width: 100%;
  padding: 15px 0;
  border-bottom: 1px solid #e6ecf0;
  margin: 0;
}

.follower-info {
  width: 100%;
  margin: 0;
}

.isfollowed-info {
  display: flex;
  justify-content: space-between;
}
.name {
  font-weight: 900;
}
.avatar {
  min-width: 50px;
  width: 50px;
  height: 50px;
  margin-right: 10px;
  margin-top: 15px;
}
.avatar img {
  min-width: 50px;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-size: cover;
  object-fit: cover;
}

.account {
  color: gray;
}

button {
  border: 1px solid var(--orange);
  border-radius: 100px;
  color: var(--orange);
  margin-top: 7px;
  font-size: 15px;
  font-weight: 700;
}

.toggleFollow .isFollowing {
  width: 92px;
  background-color: var(--orange);
  color: var(--white);
}
.follower-info p {
  margin: 0;
}
</style>
