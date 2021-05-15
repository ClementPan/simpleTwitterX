<template>
  <ul class="nav nav-tabs">
    <li class="nav-item">
      <router-link
        :to="{ name: 'user-profile', params: { id: userData.id } }"
        class="nav-link"
      >
        推文
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        :to="{ name: 'user-profile-replies', params: { id: userData.id } }"
        class="nav-link"
      >
        推文與回覆
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        :to="{ name: 'user-profile-Likes', params: { id: userData.id } }"
        class="nav-link"
      >
        喜歡的內容
      </router-link>
    </li>
  </ul>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "UserProfileNavtabs",
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  // data() {
  //   return {
  //     routes: [
  //       { id: 1, title: "推文", name: "user-profile", params: { id: "" } },
  //       {
  //         id: 2,
  //         title: "推文與回覆",
  //         name: "user-profile-replies",
  //         params: { id: "" },
  //       },
  //       {
  //         id: 3,
  //         title: "喜歡的內容",
  //         name: "user-profile-Likes",
  //         params: { id: "" },
  //       },
  //     ],
  //   };
  // },
  // watch: {
  //   userData: {
  //     deep: true,
  //     handler: function (newVal) {
  //       const { id } = newVal;
  //       this.routes.forEach((each) => {
  //         each.params.id = id;
  //       });
  //     },
  //   },
  // },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style scoped>
.nav .nav-tabs {
  margin-top: 20px;
}
.nav-tabs .nav-link {
  color: gray;
  width: 150px;
  text-align: center;
}
.nav-tabs .nav-link:focus,
.nav-tabs .nav-link:hover,
.nav-tabs .nav-item.show .nav-link,
.nav-tabs .nav-link.active {
  border: none;
  border-bottom: 1px solid var(--orange);
  color: var(--orange);
  font-weight: 700;
}
.nav-tabs .nav-link:hover {
  background-color: hsl(205deg 92% 95%);
}
</style>