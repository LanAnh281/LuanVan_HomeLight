<script>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

//alert
import { warning, success, load } from "../../assets/js/common.alert";
import { checkMail } from "../../assets/js/checkInput.common";
//service
import resetPasswordService from "../../service/resetPassword.service";
import mailService from "../../service/mail.service";
export default {
  components: {},
  setup() {
    const data = reactive({
      item: {
        email: "",
      },
      error: {
        email: "",
      },
      flag: true,
    });
    const router = useRouter();

    const resetPassword = async () => {
      try {
        for (const key in data.item) {
          if (data.item[key] == "") {
            data.error[key] = "Chưa nhập thông tin.";
            data.flag = true;
          }
        }
        if (!data.flag) {
          const document = await resetPasswordService.create(data.item);
          if (document.status == "fail") {
            warning("Cảnh báo", "Bạn đã cung cấp sai email đăng nhập");
            return;
          }
          load("Đang gửi mail");
          //send mail title, content, mail

          const mail = await mailService.sendMail({
            mail: data.item.email,
            title: "Khôi phục lại mật khẩu",
            content: `<html>
              <p>Kính chào quý khách,</p>
              <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. 
                  Bạn hãy <a href="http://localhost:3001/resetPassword?reset=${document.message["_id"]}"> click vào đây</a>
                  để đặt lại mật khẩu.
              </p> 
              <p>Lưu ý đường link thay đổi mật khẩu chỉ có giá trị trong 3 phút.</p>
              <p>Xin cảm ơn</p>
          </html>`,
          });
          success("Thành công", "Bạn hãy kiểm tra email để tạo mật khẩu mới.");
          data.item.email = "";
        }
      } catch (error) {
        console.log(error);
      }
    };
    return {
      data,
      resetPassword,
      checkMail,
    };
  },
};
</script>
<template>
  <div class="login container-fluid">
    <div class="row justify-content-around align-items-center vh-100">
      <div class="card shadow col-4">
        <div class="row justify-content-center">
          <!-- <router-link :to="{ name: 'user' }" class="col-3">
            <img
              src="../../assets/image/logo.PNG"
              style="width: 100%; height: 100%"
            />
          </router-link> -->
          <h4 class="text-center mt-3 ml-3 col-12 title">Khôi phục mật khẩu</h4>
        </div>
        <form @submit.prevent="resetPassword" class="container mt-3">
          <div class="form-group row">
            <label for="inputEmail" class="col-sm-3 col-form-label p-0"
              >Nhập email :</label
            >
            <div class="col-sm-9">
              <input
                type="text"
                class="form-control"
                id="inputEmail"
                @blur="
                  () => {
                    let isCheck = checkMail(data.item.email);
                    if (isCheck) {
                      data.error.email = 'Sai định dạng email';
                      data.flag = true;
                    }
                  }
                "
                @input="
                  data.error.email = '';
                  data.flag = false;
                "
                v-model="data.item.email"
              />
              <div v-if="data.error.email" class="invalid-error">
                {{ data.error.email }}
              </div>
            </div>
          </div>

          <div
            class="form-group row justify-content-around"
            style="margin-top: 26px"
          >
            <button type="submit" class="btn btn-login col-sm-3 mx-2">
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style></style>
