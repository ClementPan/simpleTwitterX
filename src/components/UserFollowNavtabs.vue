<template>
  <ul class="nav nav-tabs">
    <li class="nav-item">
      <router-link
        :to="{ name: 'user-profile-followers', params: { id: userData.id } }"
        class="nav-link"
      >
        跟隨者
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        :to="{ name: 'user-profile-following', params: { id: userData.id } }"
        class="nav-link"
      >
        正在跟隨
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: "UserFollowNavtabs",
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  // data() {
  //   return {
  //     user: {},
  //   };
  // },
  // watch: {
  //   userData(newValue) {
  //     this.user = {
  //       ...this.user,
  //       ...newValue,
  //     };
  //   },
  // },
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