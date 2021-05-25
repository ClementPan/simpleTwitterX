<template>
  <div id="simple-twitter">
    <router-view />
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { mapState } from "vuex";
export default {
  name: "App",
  created() {
    console.log("[App.vue]: App.vue created!");
    this.$bus.$on("updateSession", (payload) => {
      this.updateSession(payload);
    });
  },
  sockets: {
    "set session": function (data) {
      console.log("[App.vue - SESSION]: SET SESSION!");
      console.log(data);
      console.log("-----------");
      sessionStorage.setItem("rooms", JSON.stringify(data));
    },
  },
  methods: {
    startSession() {
      const token = localStorage.getItem("token");
      if (!token) return;
      console.log("[App.vue - SESSION]: Starting session...");
      const rooms = JSON.parse(sessionStorage.getItem("rooms"));

      if (rooms) {
        console.log("rooms: ");
        console.log(rooms);
        console.log("-----------");
        console.log("[App.vue - SESSION]: rooms exist");
        console.log("userId: " + this.currentUser.id);
        this.$socket.emit("start session", rooms, this.currentUser.id);
      } else {
        console.log("[App.vue - SESSION]: no rooms exist");
        console.log("[App.vue - SESSION]: emit start session");
        this.$socket.emit(
          "start session",
          { rooms: null },
          this.currentUser.id
        );
      }
    },
    updateSession(roomId) {
      const { name, id } = this.currentUser;
      const rooms = [`# ${name}`, `self ${id}`, `${roomId}`];
      this.$socket.emit("start session", rooms, this.currentUser.id);
      sessionStorage.setItem("rooms", JSON.stringify(rooms));
    },
  },
  watch: {
    currentUser: {
      deep: true,
      handler: function () {
        this.startSession();
      },
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style scoped>
#simple-twitter {
  max-width: 1440px;
  margin: auto;
}
</style>