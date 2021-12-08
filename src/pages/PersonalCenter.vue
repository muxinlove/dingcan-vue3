<template>
  <div class="pc_main">
    <div class="pc_banner">
      <img src="../assets/pc_banner.png" />
      <p class="pc_mobielPhoe">您好，{{ user.phone }}</p>
    </div>
    <div class="pc_list">
      <ul>
        <li class="pc_orderList">
          <i class="pc_myorder"></i>
          <a @click="routeLink('orderList')"><span>我的订单</span></a>
        </li>
        <li class="pc_addr">
          <i></i>
          <a @click="routeLink('addrManage')"><span>地址管理</span></a>
        </li>
        <li class="pc_feedBack">
          <i class="pc_opinion"></i>
          <a @click="routeLink('feedback')"><span>意见反馈</span></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import storageUtil from "../utils/storageUtil";
export default {
  setup() {
    const router = useRouter();

    function routeLink(path) {
      router.push(path);
    }

    const cacheUser = storageUtil.local.getItem(storageUtil.KEYS.USER);
    const user = reactive(cacheUser || {});

    return {
      user,
      routeLink,
    };
  },
};
</script>

<style lang="scss">
@import url("@/style/index.scss");

#pc_main {
  width: 100%;
  height: 100%;
}

.pc_banner {
  width: 100%;
  position: relative;
  font-size: 0.86rem;
  color: #fff;
  text-align: center;
}

.pc_banner p {
  position: absolute;
  bottom: 20px;
  left: 35%;
}

.pc_list {
  width: 97%;
  margin: 0 auto;
  background-color: #fff;
}

.pc_list li {
  line-height: 55px;
  border-bottom: 1px solid #f0f0f0;
}

.pc_list li span {
  font-size: 1rem;
}

.pc_list ul li i {
  margin: -4px 5px;
  width: 1.13rem;
  display: inline-block;
  background-size: 100%;
}

.pc_addr i {
  background: url("../assets/pc_icon.png") no-repeat;
  background-position: 0 -2.94rem;
  height: 1.38rem;
}

.pc_myorder {
  background: url("../assets/pc_icon.png") no-repeat;
  background-position: 0 0.125rem;
  height: 1.38rem;
}

.pc_opinion {
  background: url("../assets/pc_icon.png") no-repeat;
  background-position: 0 -5.94rem;
  height: 1.38rem;
}

.pc_coupon {
  background: url(../assets/pc_icon.png) no-repeat;
  background-position: 0 -9rem;
  height: 1.38rem;
}
</style>
