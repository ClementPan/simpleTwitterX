<template>
  <div class="notification flex">
    <!-- UserSidebar -->
    <UserSidebar></UserSidebar>
    <div class="mainSection">
      <div class="title stickyTitle">
        <h1>通知</h1>
      </div>
      <div class="navtabs flex">
        <button>
          <router-link to="/notification">全部</router-link>
        </button>
        <button>
          <router-link to="/notification/mentions">提及</router-link>
        </button>
      </div>
      <h1>noti mentions</h1>
    </div>

    <!-- RecommededFollowers -->
    <RecommededFollowers></RecommededFollowers>
  </div>
</template>

<script>
import UserSidebar from "../components/Common/UserSidebar";
import RecommededFollowers from "../components/Common/RecommendedFollowers";

export default {
  name: "notification-mentions",
  components: { UserSidebar, RecommededFollowers },
};
</script>

<style scoped>
.navtabs {
  flex-direction: row;
}

.navtabs button {
  flex: 1;
  text-decoration: none;
  background-color: var(--white);
  border: none;
}

.navtabs button:nth-child(2) {
  border-bottom: 2px solid rgb(29, 161, 242);
}

.navtabs button a {
  display: inline-block;
  width: 100%;
  padding: 12px 0;
  font-weight: 700;
}

.navtabs button:hover {
  background-color: hsl(205deg 92% 95%);
}
.navtabs button:hover a {
  text-decoration: none;
}
</style>