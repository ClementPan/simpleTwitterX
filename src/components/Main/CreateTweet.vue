<template>
  <!-- CreateTweet.vue => modal id="tweetModal" -->
  <div class="createTweet">
    <div class="container">
      <div class="avatar">
        <img :src="user.avatar | emptyImageFilter" alt="" />
      </div>
      <div class="textInput">
        <p data-toggle="modal" data-target="#tweetModal">有什麼新鮮事？</p>
      </div>
    </div>
    <div class="tweetButton">
      <button
        type="button"
        class="btn"
        data-toggle="modal"
        data-target="#tweetModal"
      >
        推文
      </button>
    </div>

    <!-- modal -->
    <CreateTweetModal :user="user"></CreateTweetModal>

    <!-- modal -->
  </div>
</template>

<script>
import CreateTweetModal from "../Modal/CreateTweetModal";
import { emptyImageFilter } from "../../utils/mixins";
import { mapState } from "vuex";

export default {
  name: "CreateTweet",
  mixins: [emptyImageFilter],
  components: {
    CreateTweetModal,
  },
  created() {
    this.fetchCurrentUser();
  },
  data() {
    return {
      user: {},
      tweetContent: "",
      isProcessing: false,
    };
  },
  methods: {
    fetchCurrentUser() {
      this.user = this.currentUser;
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style scoped>
.createTweet {
  border-bottom: 10px solid #e6ecf0;
  flex-direction: column;
  padding: 10px 15px;
  /* border: 1px solid #000; */
}

.container {
  display: flex;
  align-items: center;
  padding: 0;
}

.avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3c3c3c;
}

.textInput {
  flex: 1;
  margin-left: 10px;
}

.textInput textarea,
.textInput input {
  border: none;
  resize: none;
  background-color: transparent;
}

.textInput p {
  font-weight: 500;
  font-size: 18px;
  color: #9197a3;
}

.textInput p:hover {
  cursor: pointer;
}

.textInput input::placeholder {
  font-weight: 500;
  font-size: 18px;
  color: #9197a3;
}

.tweetButton {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.tweetButton .btn {
  width: 64px;
  height: 40px;
  background-color: var(--orange);
  color: var(--white);
  border-radius: 100px;
  font-weight: 500;
  font-size: 18px;
}
</style>