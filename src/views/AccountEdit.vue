<template>
  <div id="AccountEdit">
    <!-- UserSidebar -->
    <UserSidebar></UserSidebar>
    <!-- AccountEditForm -->
    <div class="accountEditPanel">
      <div class="title">
        <h1>帳戶設定</h1>
      </div>

      <AccountEditForm :isSignUp="isSignUp"></AccountEditForm>
    </div>
  </div>
</template>

<script>
import UserSidebar from "../components/Common/UserSidebar";
import AccountEditForm from "../components/AccountEditForm";

export default {
  name: "AccountEdit",
  components: {
    UserSidebar,
    AccountEditForm,
  },
  data() {
    return {
      isSignUp: false,
    };
  },
};
</script>

<style scoped>
#AccountEdit {
  display: flex;
}

.accountEditPanel {
  flex: 1;
}

.title {
  height: 55px;
  border-bottom: 1px solid #e6ecf0;
  padding: 10px 15px;
  display: flex;
  align-items: center;
}

.title h1 {
  font-weight: 700;
  font-size: 19px;
  margin: 0;
}
</style>