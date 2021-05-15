<template>
  <div class="container py-5">
    <form class="w-100" @submit.prevent.stop="handleSubmit">
      <div class="logo text-center">
        <img src="../assets/image/logo.png" alt="" />
      </div>
      <div class="admin-text text-center mb-4">
        <h1 class="h3 mb-3 font-weight-normal">後台登入</h1>
      </div>

      <div class="form-account form-label-group mb-2">
        <label for="account">帳號</label>
        <input
          id="account"
          v-model="account"
          name="account"
          type="text"
          class="form-control"
          autocomplete="useraccount"
          required
          autofocus
        />
      </div>

      <div class="form-password form-label-group mb-3">
        <label for="password">密碼</label>
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          class="form-control"
          autocomplete="current-password"
          required
        />
      </div>
      <button
        class="btn btn-lg btn-primary btn-block mb-3"
        type="submit"
        :disabled="isProcessing"
      >
        登入
      </button>
      <div class="sign-in text-center mb-3">
        <p>
          <router-link to="/signin">前台登入</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import authorizationAPI from "./../apis/authorization";
import { Toast } from "../utils/helpers";
export default {
  name: "AdminSignin",
  data() {
    return {
      account: "",
      password: "",
      isProcessing: false,
    };
  },
  methods: {
    async handleSubmit() {
      try {
        if (!this.account || !this.password) {
          Toast.fire({
            icon: "warning",
            title: "請填入帳號和密碼",
          });
          return;
        }

        this.isProcessing = true;
        // 使用 authorizationAPI 的 signIn 方法
        const response = await authorizationAPI.signIn({
          account: this.account,
          password: this.password,
        });
        console.log("response:", response);
        const { data } = response;

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        if (data.user.role !== "admin") {
          Toast.fire({
            icon: "warning",
            title: "您非管理者身分!",
          });
          this.isProcessing = false;
          return;
        }

        localStorage.setItem("token", data.token);
        this.$router.push("/admin/tweets");
      } catch (error) {
        this.password = "";
        this.isProcessing = false;

        Toast.fire({
          icon: "warning",
          title: "請確認您輸入了正確的帳號密碼",
        });
      }
    },
  },
};
</script>

<style scoped>
.logo {
  margin: 15px 0 30px 0;
}

.logo img {
  width: 50px;
  height: 50px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-label-group {
  position: relative;
  bottom: 30px;

  width: 540px;
  margin: 10px;
}

.form-password {
  margin-top: 12px;
}

#password {
  margin-top: 1px;
}

.form-label-group label {
  color: #657786;
  font-weight: 700;
}

.admin-text h1 {
  font-size: 23px;
  font-weight: 900;
}

input {
  height: 24px;
  border: none;
  border-radius: 0;
  background-color: #f5f8fa;
  border-bottom: 2px solid #657786;
}

.btn {
  position: relative;
  bottom: 13px;
  margin-top: 0;
  width: 540px;
  height: 50px;
  color: var(--white);
  background-color: var(--orange);
  border-radius: 50px;
  border: orangered;
  font-size: 18px;
  font-weight: 700;
}

form .sign-in {
  position: relative;
  left: 240px;
  bottom: 28px;
  font-weight: 900;
  text-decoration: underline;
  margin-top: 20px;
}
</style>