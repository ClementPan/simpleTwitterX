<template>
  <form @submit.prevent.stop="handleSubmit($event)">
    <div class="row">
      <label for="account"
        >帳號<span v-if="!inputCheck.account" class="note ml-5"
          >*帳號長度不得大於 50 字元</span
        ></label
      >
      <input
        id="account"
        name="account"
        type="text"
        v-model="form.account"
        required
        maxlength="50"
      />
    </div>

    <div class="row">
      <label for="name"
        >名稱<span v-if="!inputCheck.name" class="note ml-5"
          >*名稱長度不得大於 50 字元</span
        ></label
      >
      <input
        id="name"
        name="name"
        type="text"
        v-model="form.name"
        maxlength="50"
        required
      />
    </div>

    <div class="row">
      <label for="email"
        >Email<span v-if="!inputCheck.email" class="note ml-5"
          >*信箱長度不得大於 50 字元</span
        ></label
      >
      <input
        id="email"
        name="email"
        type="email"
        v-model="form.email"
        maxlength="50"
        required
      />
    </div>

    <div class="row">
      <label for="password"
        >密碼<span v-if="!inputCheck.password" class="note ml-5"
          >*密碼長度需介於 4 和 12 之間</span
        ></label
      >
      <input
        id="password"
        name="password"
        type="password"
        v-model="form.password"
        required
        maxLength="12"
      />
    </div>
    <div class="row">
      <label for="passwordCheck"
        >密碼確認<span v-if="!inputCheck.checkPassword" class="note ml-3"
          >*密碼長度需介於 4 和 12 之間</span
        ></label
      >
      <input
        id="passwordCheck"
        name="passwordCheck"
        type="password"
        v-model="form.checkPassword"
        maxLength="12"
        required
      />
    </div>

    <template v-if="isSignUp">
      <div class="row mt-4">
        <button class="btn submit" type="submit" :disabled="isProcessing">
          {{ isProcessing ? "註冊中.." : "註冊" }}
        </button>
      </div>
      <div class="row">
        <button class="btn cancel" @click.stop.prevent="goBackToSignIn">
          取消
        </button>
      </div>
    </template>
    <template v-else>
      <div class="row">
        <button
          v-if="!isSaved"
          class="btn update"
          type="submit"
          :disabled="isProcessing"
        >
          {{ isProcessing ? "儲存中.." : "儲存" }}
        </button>
        <button v-else class="btn update" disabled>已儲存</button>
      </div>
    </template>
  </form>
</template>

<script>
import { Toast } from "../utils/helpers";
import authorizationAPI from "../apis/authorization";
import usersAPI from "../apis/users";
import { mapState } from "vuex";

export default {
  name: "AccountEditForm",
  props: {
    isSignUp: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.fetchCurrentUser(this.currentUser);
  },
  data() {
    return {
      form: {
        name: "",
        account: "",
        email: "",
        password: "",
        checkPassword: "",
      },
      isProcessing: false,
      isSaved: true,
      userChanged: false,
      inputCheck: {
        account: true,
        name: true,
        email: true,
        password: true,
        checkPassword: true,
      },
    };
  },
  methods: {
    fetchCurrentUser(newVal) {
      const { name, email, account } = newVal;
      this.form = {
        ...this.form,
        name,
        email,
        account,
      };
    },
    goBackToSignIn() {
      this.$router.push("/signin");
    },
    handleSubmit(e) {
      const formDataCheckResult = this.formDataCheck();
      if (!formDataCheckResult) {
        return (this.isProcessing = false);
      }
      if (this.isSignUp) {
        this.handleSignUpSubmit(e);
      } else {
        this.handleSaveSetting(e);
      }
    },
    formDataCheck() {
      let result = false;
      if (!this.form.account) {
        Toast.fire({
          icon: "info",
          title: "請填寫帳號！",
        });
        this.inputCheck.account = false;
        return result;
      }
      if (!this.form.name) {
        Toast.fire({
          icon: "info",
          title: "請填寫名稱！",
        });
        this.inputCheck.name = false;
        return result;
      }
      if (!this.form.email) {
        Toast.fire({
          icon: "info",
          title: "請填寫 Email！",
        });
        this.inputCheck.email = false;
        return result;
      }
      if (!this.form.password) {
        Toast.fire({
          icon: "info",
          title: "請填寫密碼！",
        });
        this.inputCheck.password = false;
        return result;
      }
      if (this.form.password.length > 12 || this.form.password.length < 4) {
        Toast.fire({
          icon: "info",
          title: "密碼長度不得小於 4 或超過 12！",
        });
        this.inputCheck.password = false;
        return result;
      }
      if (!this.form.checkPassword) {
        Toast.fire({
          icon: "info",
          title: "請填寫密碼確認！",
        });
        this.inputCheck.checkPassword = false;
        return result;
      }
      if (this.form.password !== this.form.checkPassword) {
        Toast.fire({
          icon: "error",
          title: "密碼不相符！",
        });
        return result;
      }
      console.log("Data check passed");
      return (result = true);
    },
    async handleSignUpSubmit() {
      try {
        this.isProcessing = true;
        const formData = this.form;
        // call api to post formData
        const { data } = await authorizationAPI.signUp(formData);

        if (data.status !== "success") {
          throw new Error(data);
        }

        Toast.fire({
          icon: "success",
          title: "註冊成功！",
        });

        // 轉址
        this.$router.push("signin");
      } catch (error) {
        console.log(error);
        let message = "無法註冊，請稍後再試！";
        if (error.response.status === 409) {
          message = "該 Email 已被註冊，請選擇其他 Email！";
        }
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: message,
        });
      }
    },
    async handleSaveSetting() {
      const formDataCheckResult = this.formDataCheck();
      if (!formDataCheckResult) {
        return;
      }
      try {
        this.isProcessing = true;
        const userId = this.currentUser.id;
        const formData = {
          ...this.form,
          page: "setting",
        };

        const { data } = await usersAPI.putUser(userId, formData);

        console.log(data);

        if (data.status !== "success") {
          throw new Error(data.message);
        }

        Toast.fire({
          icon: "success",
          title: "資料修改成功！",
        });

        this.isProcessing = false;
        this.isSaved = true;
        this.userChanged = true;
        this.form.password = "";
        this.form.checkPassword = "";
      } catch (error) {
        console.log(error);
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法變更使用者資訊，請稍候再試！",
        });
      }
    },
  },
  watch: {
    currentUser(newVal) {
      this.fetchCurrentUser(newVal);
    },
    form: {
      handler: function () {
        if (!this.userChanged) {
          // true
          return (this.userChanged = true);
        }
        this.isSaved = false;
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  margin: 20px 0 0 15px;
  width: 642px;
}
.row {
  width: 642px;
  margin: 10px 0;
}
.row label {
  position: relative;
  padding-left: 11px;
  color: #657786;
  font-weight: 700;
  display: block;
  width: 100%;
}
.row input {
  padding-left: 11px;
  font-weight: 500;
  font-size: 19px;
  background-color: #f5f8fa;
  width: 100%;
  border: none;
  border-bottom: 2px solid #657786;
}

.note {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 15px;
  color: #ff6600;
}

.btn {
  width: 100%;
  border-radius: 50px;
  height: 50px;
}
button.submit,
button.update {
  background-color: #ff6600;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}
button.cancel {
  color: #0099ff;
  text-decoration: underline;
  font-size: 18px;
  font-weight: 700;
}
.row:last-child {
  position: relative;
  height: 50px;
}
button.update {
  position: absolute;
  right: 0;
  width: 122px;
  font-size: 18px;
}
</style>
