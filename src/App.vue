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
  sockets: {
    "set session": function (data) {
      sessionStorage.setItem("rooms", JSON.stringify(data));
    },
  },
  methods: {
    startSession() {
      const rooms = JSON.parse(sessionStorage.getItem("rooms"));
      if (rooms) {
        this.$socket.emit("start session", rooms, this.currentUser.id);
      } else {
        this.$socket.emit(
          "start session",
          { rooms: null },
          this.currentUser.id
        );
      }
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