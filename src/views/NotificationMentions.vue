<template>
  <div class="notification">
    <!-- UserSidebar -->
    <UserSidebar></UserSidebar>
    <div class="mainSection">
      <div class="title">
        <h1>通知</h1>
      </div>
      <div class="navtabs">
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
.notification {
  display: flex;
}

.mainSection {
  flex: 1;
  width: 100%;
  height: 100vh;
  border-right: 1px solid #e6ecf0;
  overflow-y: scroll;
}

/* scrollbar */
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
/* scrollbar */

.title {
  height: 55px;
  border-bottom: 1px solid #e6ecf0;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: #fff;
}

.title h1 {
  font-weight: 700;
  font-size: 19px;
  margin: 0;
}

.navtabs {
  display: flex;
  flex-direction: row;
}

.navtabs button {
  flex: 1;
  text-decoration: none;
  background-color: #fff;
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