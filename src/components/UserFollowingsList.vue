<template>
  <div class="container">
    <div
      class="following-container"
      v-for="following of followings"
      :key="following.followingId"
    >
      <div class="avatar">
        <img :src="following.avatar | emptyImageFilter" alt="" />
      </div>
      <div class="follower-info">
        <div class="isfollowed-info">
          <div class="follower-title">
            <router-link
              :to="{
                name: 'user-profile',
                params: { id: following.followingId },
              }"
            >
              <div class="name">{{ following.name }}</div>
            </router-link>
            <div class="account">@{{ following.account }}</div>
          </div>

          <div class="toggleFollow">
            <button
              v-if="following.isFollowing"
              class="btn isFollowing"
              @click.prevent.stop="deleteFollowing(following)"
              :disabled="isProcessing"
            >
              正在跟隨
            </button>
            <button
              v-else
              class="btn"
              @click.prevent.stop="addFollowing(following)"
              :disabled="isProcessing"
            >
              跟隨
            </button>
          </div>
        </div>
        <p>{{ following.introduction }}</p>
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
    Followings: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      followings: [],
      isProcessing: false,
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  watch: {
    Followings(newVal) {
      this.fetchFollowings(newVal);
    },
  },
  methods: {
    fetchFollowings() {
      this.followings = this.Followings;
    },
    async addFollowing(following) {
      try {
        // call api to toggle isFolloweda
        this.isProcessing = true;
        const payload = { id: following.followingId };
        const { data } = await usersAPI.followUser(payload);
        // console.log(data);
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        // rerender
        this.renderAfterFollowToggle(following);

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
    async deleteFollowing(following) {
      try {
        this.isProcessing = true;
        const { data } = await usersAPI.unfollowUser(following.followingId);
        // console.log("followingId:", following.followingId);
        // console.log("data", data);
        if (data.status !== "success") {
          throw new Error(data.message);
        }

        this.renderAfterFollowToggle(following);

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
          title: "無法取消追蹤，請稍後再試！",
        });
      }
    },
    renderAfterFollowToggle(following) {
      this.followings = this.followings.map((_following) => {
        if (_following.followingId === following.followingId) {
          return {
            ..._following,
            isFollowing: !following.isFollowing,
          };
        } else {
          return _following;
        }
      });
    },
  },
};
</script>

<style scoped>
.following-container {
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
