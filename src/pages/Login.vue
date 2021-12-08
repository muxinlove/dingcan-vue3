<template>
  <el-form ref="form" :model="user" :rules="rules">
    <el-form-item label="手机号" prop="phone" class="lg_form lg_form1">
      <el-input
        class="lg_phone"
        v-model="user.phone"
        placeholder="请填写手机号"
      ></el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="code" class="lg_form lg_form2">
      <el-input
        class="lg_checkCode"
        v-model="user.code"
        placeholder="请输入短信验证码"
      ></el-input>
      <button
        class="lg_btn btn"
        @click.stop="startTime"
        :disabled="timing"
        type="button"
      >
        {{ btnText }}
      </button>
    </el-form-item>
  </el-form>
  <button class="lp_loginBtn btn" @click="login()">登录</button>
</template>

<script>
import { reactive, ref, toRefs } from "vue";
import api from "../api/index";
import storageUtil from "../utils/storageUtil";
import { useRouter } from "vue-router";

const validatePhone = (rule, value, callback) => {
  const reg = /^1[0-9]{10}$/;
  if (!reg.test(value)) {
    callback("手机号格式错误");
  } else {
    callback();
  }
};

const validateCode = (rule, value, callback) => {
  const reg = /^[0-9]{6}$/;
  if (!reg.test(value)) {
    callback("必须为6位数字");
  } else {
    callback();
  }
};

export default {
  setup() {
    const router = useRouter();
    // 初始化数据
    const btnText = ref("获取验证码");
    // 是否正在计时
    let timing = ref(false);

    const user = reactive({
      phone: "16621182114",
      code: "",
    });

    const rules = reactive({
      phone: [
        {
          required: true,
          message: "手机号必填",
        },
        {
          validator: validatePhone,
          trigger: "change",
        },
      ],
      code: [
        {
          required: true,
          message: "验证码必填",
        },
        {
          validator: validateCode,
          trigger: "change",
        },
      ],
    });

    // 事件
    function startTime() {
      if (timing.value) return;
      // 检查手机是否合法 不合法 则提示
      this.$refs.form.validateField("phone", (msg) => {
        if (msg) return;
        timing.value = true;
        let time = 108;
        btnText.value = `${time}s重新获取`;
        let stop = setInterval(function () {
          time--;
          //不断改变btnText
          btnText.value = `${time}s重新获取`;
          //当计时完成，停止计时，更新btnText
          if (time === 0) {
            //更新btnText
            btnText.value = "获取验证码";
            //重置状态
            timing.value = false;
            //停止计时器
            clearInterval(stop);
          }
        }, 1000);

        // 请求验证码
        this.$http.get(api.sendCode, {
          params: {
            phone: user.phone,
          },
        });
      });
    }

    // 登陆
    function login() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          // 提交表单
          const result = await this.$http.post(api.login, {
            phone: user.phone,
            code: user.code,
          });
          const { data } = result;
          if (data.code == 0) {
            const userInfo = data.data;
            this.$message({
              message: userInfo.phone + "登陆成功",
              type: "success",
            });
            // userInfo存储到localStorage中
            storageUtil.local.setItem(storageUtil.KEYS.USER, userInfo);
            //跳转到home
            setTimeout(function () {
              router.push("/");
            }, 1000);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
    return toRefs({
      btnText,
      timing,
      login,
      startTime,
      user,
      rules,
    });
  },
};
</script>

<style lang="scss">
@import url("@/style/index.scss");
.lg_header {
  width: 100%;
  background: #000;
  text-align: center;
  height: 2.81rem;
  line-height: 2.81rem;
  font-size: 1.06rem;
  color: #fff;
  margin-bottom: 1rem;
}

.lg_form {
  width: 100%;
  /*height: 3.5rem;*/
  line-height: 3.5rem;
  background: #fff;
  font-size: 1rem;
  color: #000;
  vertical-align: middle;
  padding: 0 4%;
}

.lg_form input {
  height: 2.5rem;
  border: none;
  width: 40%;
}

.lg_form button {
  width: 6rem;
  height: 2rem;

  border: 1px solid #000;
  font-size: 0.75rem;
  background: none;
}

.lg_form1 {
  border-bottom: 1px solid #f0f0f0;
}

.lg_form1 input {
  margin-left: 1rem;
}

.lg_form2 input {
  margin-left: 1rem;
}

.lp_loginBtn {
  width: 92%;
  height: 2.75rem;
  background-color: #ff2a2a;
  text-align: center;
  font-size: 1.1rem;
  color: #fff;
  margin: 0 auto;
  display: block;
  border: none;
  margin-top: 1rem;
}

.code_disable {
  border: #282828 2px solid;
}

.code_enable {
  border: #ccc 2px solid;
}
.el-form-item {
  margin-bottom: 0;
  height: 50px;
}
.lg_phone,
.lg_checkCode {
  .el-input__inner {
    border: none;
  }
}
.lg_checkCode {
  width: 180px;
  .el-input__inner {
    width: 100%;
  }
}
</style>
