<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="edit-user-modal"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <form action="" @submit.stop.prevent="saveSetting($event)">
          <div class="modal-header">
            <button
              type="button"
              class="start btn"
              data-dismiss="modal"
              aria-label="Close"
              @click="clearForm"
            >
              <img src="../../assets/image/close.svg" alt="" />
            </button>

            <p class="title">編輯個人資料</p>

            <button :disabled="isProcessing" class="btn saveBtn" type="submit">
              <p>{{ isProcessing ? "儲存中" : "儲存" }}</p>
            </button>
          </div>

          <div class="modal-body">
            <div class="coverImagePanel">
              <div class="coverImage">
                <img :src="form.cover | emptyImageFilter" alt="" />
              </div>
              <div class="coverImagePanel-btns">
                <div class="uploadPhoto">
                  <label for="coverInput">
                    <img src="../../assets/image/uploadPhoto.svg" alt="" />
                  </label>
                  <input
                    id="coverInput"
                    type="file"
                    name="cover"
                    accept=".png, .jpg, .jpeg"
                    class="photo-input-hidden"
                    @change="handleFileChange($event, 'cover')"
                  />
                </div>
                <div class="deletePhoto">
                  <img
                    @click="deleteCover"
                    src="../../assets/image/deletePhoto.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div class="avatarPanel">
              <div class="avatar">
                <img :src="form.avatar | emptyImageFilter" alt="" />
              </div>
              <div class="uploadPhoto">
                <label for="avatarInput">
                  <img src="../../assets/image/uploadPhoto.svg" alt="" />
                </label>
                <input
                  id="avatarInput"
                  type="file"
                  name="avatar"
                  accept=".png, .jpg, .jpeg"
                  class="photo-input-hidden"
                  @change="handleFileChange($event, 'avatar')"
                />
              </div>
            </div>
            <div class="inputForm">
              <div class="row">
                <label for="name">名稱</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  v-model="form.name"
                  maxlength="50"
                  required
                />
                <p class="textLength">
                  {{ form.name ? form.name.length : 0 }}/50
                </p>
              </div>
              <div class="row">
                <label for="name">自我介紹</label>
                <textarea
                  id="introduction"
                  name="introduction"
                  cols="80"
                  rows="4"
                  maxlength="160"
                  v-model="form.introduction"
                ></textarea>
                <p class="textLength">
                  {{ form.introduction ? form.introduction.length : 0 }}/160
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { emptyImageFilter } from "../../utils/mixins";
import { Toast } from "../../utils/helpers";
import usersAPI from "../../apis/users";
// jquery for closing modal
import $ from "jquery";

export default {
  name: "UserEditModal",
  mixins: [emptyImageFilter],
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        introduction: "",
        name: "",
        avatar: "",
        cover: "",
      },
      isProcessing: false,
    };
  },
  methods: {
    async saveSetting(e) {
      this.isProcessing = true;
      const result = this.formDataCheck(this.form);
      if (!result) {
        return;
      }
      try {
        const userId = this.userData.id;

        const form = e.target;
        const formData = new FormData(form);
        const { data } = await usersAPI.putUser(userId, formData);

        if (data.status !== "success") {
          throw new Error(data.message);
        }
        console.log(data);

        // inform userProfileCard
        console.log(this.form);
        this.$emit("afterSaveSetting", this.form);

        // clear form
        this.clearForm();

        // hide modal
        // $("#edit-user-modal").modal("hide");
        $("#edit-user-modal").hide();
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");

        Toast.fire({
          icon: "success",
          title: "儲存成功！",
        });

        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "無法儲存，請稍後再試！",
        });
      }
    },
    formDataCheck(form) {
      let result = false;
      if (form.name || form.name.length < 50) {
        result = true;
      }
      if (form.introduction.length < 160) {
        result = true;
      }
      return result;
    },
    handleFileChange(e, which) {
      const { files } = e.target;
      if (!files.length) {
        return;
      } else {
        const imageURL = window.URL.createObjectURL(files[0]);
        if (which === "cover") {
          this.form.cover = imageURL;
        } else {
          this.form.avatar = imageURL;
        }
      }
    },
    deleteCover() {
      this.form.cover = "";
    },
    clearForm() {
      this.form = this.userData;
      $("#edit-user-modal").hide();
      $(".modal-backdrop").remove();
    },
  },
  watch: {
    userData: {
      deep: true,
      handler: function (newVal) {
        console.log("newVal for userData");
        console.log(newVal);
        const { name, introduction, avatar, cover } = newVal;
        this.form = {
          name,
          introduction,
          avatar,
          cover,
        };
      },
    },
  },
};
</script>

<style scoped>
/* form {
  margin: 0;
  padding: 0;
}
/*  */
#edit-user-modal {
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
}

.modal-content {
  width: 600px;
}

.modal-header {
  padding: 0;
  height: 55px;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}

button.start {
  display: flex;
  align-items: center;
  justify-content: center;
}

p.title {
  font-size: 19px;
  font-weight: 700;
  height: 100%;
  padding: 0;
  margin: 0;
  line-height: 55px;
  margin-left: 44px;
}

.saveBtn {
  height: 30px;
  /* width: 64px; */
  padding: 0px 14px;
  border-radius: 100px;
  background: #ff6600;
  position: absolute;
  right: 15px;
}

.saveBtn p {
  height: 100%;
  margin: 0;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
}

.modal-body {
  padding: 0;
  height: 600px;
}

.coverImagePanel {
  height: 200px;
  position: relative;
}

.coverImage {
  width: 100%;
  height: 100%;
}

.coverImage img {
  width: 100%;
  height: 100%;
}

.coverImagePanel .coverImagePanel-btns {
  width: 56px;
  height: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.coverImagePanel-btns img {
  width: 100%;
  height: 100%;
  /* border: 1px solid #000; */
}

.coverImagePanel-btns .uploadPhoto {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 50%;
  left: -21%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.coverImagePanel-btns .deletePhoto {
  width: 15px;
  height: 15px;
  position: absolute;
  top: 50%;
  right: -15%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatarPanel .uploadPhoto img,
.coverImagePanel-btns .deletePhoto,
.coverImagePanel-btns label:hover {
  cursor: pointer;
}

/* avatarPanel */
.avatarPanel {
  position: absolute;
  width: 120px;
  height: 120px;
  top: 200px;
  left: 84px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #fff;
}

.avatarPanel .uploadPhoto {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.inputForm {
  width: 100%;
  height: 320px;
  margin-top: 80px;
  /* border: 1px solid #000; */
  padding: 0 15px;
}

.row {
  /* border: 1px solid #000; */
  width: 100%;
  margin: auto;
  margin-bottom: 20px;
}

.row label {
  font-weight: 500;
  font-size: 15px;
  color: #657786;
}

.row label {
  padding-left: 11px;
  color: #657786;
  font-weight: 700;
  display: block;
  width: 100%;
}

.row input,
.row textarea {
  width: 100%;
  font-weight: 500;
  font-size: 19px;
  padding: 10px;
  background-color: #f5f8fa;
  border-radius: 4px 4px 0 0;
  border: none;
  border-bottom: 2px solid #657786;
}

.row textarea {
  resize: none;
  /* outline: none; */
  border: none;
  border-bottom: 2px solid #657786;
}

.row .textLength {
  font-weight: 500;
  font-size: 15px;
  color: #657786;
  margin: 0;
  text-align: right;
  width: 100%;
}

.photo-input-hidden {
  display: none;
  border: 1px solid #000;
}
</style>