<template>
  <nav class="nav_com">
    <div class="nv_main">描述</div>
  </nav>
  <section class="section_com">
    <div class="st_com">
      <textarea
        class="fb_val"
        placeholder="请尽情说出你的不愉快，我们一定改进"
        v-model="feedback.content"
      ></textarea>
    </div>
  </section>
  <footer class="footer_com">
    <button class="fb_btn btn" @click="addFeedback()">提交</button>
  </footer>
</template>

<script>
import { onMounted, reactive } from "vue";
import storageUtil from "@/utils/storageUtil";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import $http from "@/http/index";
import api from "@/api/index";

export default {
  setup() {
    onMounted(() => {
      const router = useRouter();
      const user = storageUtil.local.getItem(storageUtil.KEYS.USER);
      if (!user) {
        router.push("/login");
        return;
      }
      feedback.user_id = user._id;
      feedback.phone = user.phone;
    });
    const feedback = reactive({
      content: "",
      user_id: "",
      phone: "",
    });

    async function addFeedback() {
      const result = await $http.post(api.addFeedback, feedback);
      const { code } = result.data;
      if (code == 0) {
        ElMessage({
          message: "吐槽成功",
          type: "success",
          showClose: true,
        });
      }
    }
    return {
      feedback,
      addFeedback,
    };
  },
};
</script>

<style lang="scss">
@import url("../style/index.scss");
body {
  margin: 0 auto;
}

.nv_main {
  font-size: 1rem;
  padding-left: 5%;
  padding: 1rem 5%;
}

.st_com {
  width: 98%;
  margin: 0 auto;
}

textarea {
  width: 99%;
  height: 12rem;
  border: none;
  padding: 1rem 0 0 1%;
  resize: none;
}

button {
  width: 92%;
  height: 3rem;
  line-height: 3rem;
  color: #fff;
  border: none;
  display: block;
  text-align: center;
  margin: 1rem auto;
  background: #ff2a2a;
  font-size: 1.3rem;
}
</style>
