<template>
  <div class="notification">
    <!-- UserSidebar -->
    <UserSidebar></UserSidebar>
    <div class="mainSection">
      <div class="title stickyTitle">
        <h1>通知</h1>
      </div>
      <div class="noti-panel">
        <template v-for="item of messageList">
          <!-- tweetItem -->
          <li v-if="item.type === 1" class="tweetItem" :key="item.id">
            <div class="tweet-noti">
              <div class="avatar">
                <img :src="item.avatar" alt="" />
              </div>
              <h6>{{ item.name }} 有新的推文通知</h6>
              <p>
                {{ item.tweet }}
              </p>
            </div>
          </li>

          <!-- followItem -->

          <li v-if="item.type === 2" class="followItem" :key="item.id">
            <div class="follow-noti">
              <div class="avatar">
                <img :src="item.avatar" alt="" />
              </div>
              <h6>{{ item.name }} 開始追蹤你</h6>
            </div>
          </li>

          <!-- replyItem -->

          <li v-if="item.type === 3" class="replyItem" :key="item.id">
            <div class="reply-noti">
              <div class="avatar">
                <img :src="item.avatar" alt="" />
              </div>
              <h6>你的貼文有新的回覆</h6>
              <p>
                {{ item.reply }}
              </p>
            </div>
          </li>

          <!-- likeItem -->

          <li v-if="item.type === 4" class="likeItem" :key="item.id">
            <div class="like-noti">
              <div class="avatar">
                <img :src="item.avatar" alt="" />
              </div>
              <h6>{{ item.name }} 喜歡你的貼文</h6>
            </div>
          </li>
        </template>
      </div>
    </div>

    <!-- RecommededFollowers -->
    <RecommededFollowers></RecommededFollowers>
  </div>
</template>

<script>
import UserSidebar from "../components/Common/UserSidebar";
import RecommededFollowers from "../components/Common/RecommendedFollowers";
import { mapState } from "vuex";
import { Toast } from "../utils/helpers";
import socketsAPI from "../apis/socket";

export default {
  name: "notification",
  components: { UserSidebar, RecommededFollowers },
  data() {
    return {
      messageList: [],
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  sockets: {
    connection: function (data) {
      console.log("Data:" + data);
    },
    notification: function (data) {
      console.log("notification", data);

      if (data) {
        console.log("data");
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
            type: data.type,
          },
          this.currentUser.id
        );
        this.messageList.unshift({
          type: data.type,
          id: this.messageList.length + 1,
          account: data.account,
          name: data.name,
          UserId: data.id,
          avatar: data.avatar,
          tweetId: data.tweetId,
          tweet: data.tweet,
          replyId: data.replyId,
          reply: data.reply,
        });
      }
    },
  },
  async created() {
    try {
      const { data } = await socketsAPI.getNotification();
      console.log("apidata", data);
      this.messageList = data;
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: "無法取得通知資料，請稍後再試！",
      });
    }
  },

  methods: {},
};
</script>

<style scoped>
.notification {
  display: flex;
}

.mainSection {
  overflow-y: scroll;
}

.avatar {
  width: 25px;
  height: 25px;
}
.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-size: cover;
  object-fit: cover;
}

.tweet-noti,
.reply-noti,
.follow-noti,
.like-noti {
  padding: 10px;
  border-bottom: 1px solid #e6ecf0;
}

h6 {
  margin-top: 10px;
  font-weight: 900;
}
</style>