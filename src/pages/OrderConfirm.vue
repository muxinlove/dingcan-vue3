<template>
  <div id="oc_main">
    <div class="oc_addr_box">
      <div class="oc_addr" @click="routeLink('/addrManage')">
        <div class="oc_addr_left">
          <div v-show="orderAddress.address">
            <p>
              <span class="oc_userName">{{ orderAddress.contactor }}</span
              ><span class="oc_tel">{{ orderAddress.phone }}</span>
            </p>
            <p class="oc_userAddr">{{ orderAddress.address }}</p>
          </div>
          <p class="oc_userAddr" v-show="!orderAddress.address">无默认地址</p>
        </div>
        <div class="oc_addr_right"></div>
      </div>
    </div>
    <div class="oc_sendTime">
      <p class="fl">送餐时间:</p>
      <div class="fl oc_time">
        <select id="oc_time" v-model="order.arrive_time">
          <option value="">未选择</option>
          <option v-for="time in times" :key="time.value" :value="time.value">
            {{ time.text }}
          </option>
        </select>
      </div>
      <p class="fl oc_estimate">预计1小时后送达</p>
    </div>
    <div class="oc_label">订单明细</div>
    <div class="oc_orderDetail">
      <div class="oc_food" v-for="meal in cart.meals" :key="meal._id">
        <dl>
          <dt class="fl">
            <img :src="meal.picture" />
          </dt>
          <dd class="fl">
            <p class="oc_foodName fl">{{ meal.mealName }}</p>
            <p class="oc_foodPric fr">{{ meal.price * meal.count }}元</p>
            <p class="oc_foodNum fr">X{{ meal.count }}</p>
          </dd>
        </dl>
      </div>

      <div class="oc_remarks">
        <p>备注</p>
        <textarea class="oc_remark" v-model="order.remark"></textarea>
      </div>
    </div>
    <div class="oc_label">费用小计</div>
    <div class="oc_cost">
      <ul>
        <li>
          <span class="fl">配送费用</span>
          <span class="fr oc_delivery">{{ formatPrice(cart.songcanfei) }}</span>
          <!-- <span class="fr oc_delivery">{{cart.songcanfei| currency :'¥'}}</span> -->
        </li>
        <li>
          <span class="fl">费用合计</span>
          <span class="fr oc_total">{{ formatPrice(cart.totalPrice) }}</span>
          <!-- <span class="fr oc_total">{{cart.totalPrice | currency :'¥'}}</span> -->
        </li>
      </ul>
    </div>
    <div class="oc_btn_div">
      <button class="oc_btn oc_ybtn btn" href="javascript:" @click="submit()">
        微信支付
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import storageUtil from "../utils/storageUtil";
import http from "@/http/index";
import api from "@/api/index";
import { ElMessage } from "element-plus";

export default {
  setup() {
    const router = useRouter();
    let user = null;
    function routeLink(path) {
      router.push(path);
    }

    // 地址
    const orderAddress = reactive({
      contactor: "",
      phone: "",
      address: "",
    });

    // 订单
    const order = reactive({
      remark: "",
    });

    const times = reactive([]);

    const cart = reactive({
      meals: [],
      songcanfei: "",
      totalPrice: "",
      totalCount: "",
    });

    async function submit() {
      if (!order.arrive_time) {
        ElMessage({
          message: "请选择送餐时间",
          type: "warning",
        });
        return;
      }
      var obj_detail = {
        rstId: cart.rstId,
        money: cart.totalPrice + cart.songcanfei,
        meals: cart.meals,
      };

      var params = {
        user_id: user._id,
        contactor: orderAddress.contactor,
        address: orderAddress.address,
        phone: orderAddress.phone,
        doorplate: orderAddress.doorplate,
        total_money: cart.totalPrice,
        peisongfei: cart.songcanfei,
        remark: order.remark,
        arrive_time: order.arrive_time,
        detail: JSON.stringify(obj_detail),
      };
      console.log("params", params);

      const result = await http.post(api.addOrder, params);
      if (!result.data.code) {
        ElMessage({
          message: "下单成功",
          type: "success",
        });

        storageUtil.session.removeItem(storageUtil.KEYS.CART);
        storageUtil.session.removeItem(storageUtil.KEYS.ORDER_ADDR);
        setTimeout(() => {
          router.push(`/orderDetail?id=${result.data.data._id}`);
        }, 1000);
      }
    }

    onMounted(() => {
      //检查用户是否登录过
      user = storageUtil.local.getItem(storageUtil.KEYS.USER);
      if (user == null) {
        alert("请先登录");
        router.push("/login");
        return;
      }

      // 初始化地址
      initAddr(user);

      // 初始化时间
      initTimes();

      // 读取购物车数据
      initCart();
    });

    async function initAddr(user) {
      const cacheAddress = storageUtil.session.getItem(
        storageUtil.KEYS.ORDER_ADDR
      );
      if (cacheAddress) {
        for (const key in cacheAddress) {
          orderAddress[key] = cacheAddress[key];
        }
      } else {
        const defaultAddress = await http.get(api.getDefaultAddress, {
          params: { userId: user._id },
        });
        if (!defaultAddress.data.code) {
          for (const key in defaultAddress.data.data) {
            orderAddress[key] = defaultAddress.data.data[key];
          }
        }
      }
    }

    function initCart() {
      const cacheCart = storageUtil.session.getItem(storageUtil.KEYS.CART);
      const { meals, totalPrice, totalCount, songcanfei, rstId } = cacheCart;
      cart.meals = meals;
      cart.totalPrice = totalPrice;
      cart.totalCount = totalCount;
      cart.songcanfei = songcanfei;
      cart.rstId = rstId;
    }

    /*
     手动拼日期时间
    */
    function initTimes() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      //添加第一个
      times.push({
        value: year + "/" + month + "/" + day + " " + (hour + 1) + ":" + minute,
        text: "立即配送",
      });

      //添加后面的多个
      let startTime = date.getTime();
      const endTime = new Date(
        year + "/" + month + "/" + day + " 22:00"
      ).getTime();
      const intervalTime = 15; //单位是min
      while (startTime <= endTime) {
        //更新startTime
        startTime += intervalTime * 60 * 1000;
        //如果超过了结束循环
        if (startTime > endTime) {
          break;
        }

        minute += intervalTime;
        if (minute >= 60) {
          hour++;
          minute -= 60;
        }
        times.push({
          value:
            year + "-" + month + "-" + day + " " + (hour + 1) + ":" + minute,
          text: hour + ":" + minute,
        });
      }
    }

    // 价格文本的单位处理
    function formatPrice(price) {
      return `${price}元`;
    }

    return {
      routeLink,
      orderAddress,
      order,
      times,
      cart,
      submit,
      formatPrice,
    };
  },
};
</script>

<style lang="scss">
@import url("../style/index.scss");
body {
  padding-top: 0;
}

#oc_main {
  width: 100%;
  height: 100%;
}

.oc_addr_box {
  width: 97%;
  background-color: #fff;
  margin: 0 auto;
  padding: 2% 10px;
  /*margin-top: 5px;*/
  border-bottom: 1px solid #f0f0f0;
}
.oc_addr {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.oc_addr .oc_addr_left {
}
.oc_addr .oc_addr_right {
  width: 0.6rem;
  height: 1.06rem;
  background: url(../assets/om_left.png) no-repeat;
  background-size: 100%;
  display: block;
  flex-shrink: 0;
}

.oc_addr p {
  font-weight: bold;
}

.oc_userName {
  font-size: 1rem;
}

.oc_tel {
  padding-left: 1.5rem;
}

.oc_tel,
.oc_userAddr {
  font-size: 0.88rem;
  color: #646464;
}

.oc_userAddr {
  margin-top: 0.3rem;
}

.oc_addr p:nth-child(1) {
  line-height: 1.5rem;
}

.oc_orderDetail {
  width: 97%;
  background-color: #fff;
  margin: 0 auto;
}

.oc_label {
  margin-left: 4%;
  margin-top: 0.625rem;
  width: 4.38rem;
  background-color: #fff;
  height: 1.88rem;
  line-height: 1.88rem;
  text-align: center;
  font-size: 0.88rem;
  color: #969696;
  border-bottom: 1px solid #f0f0f0;
}

.oc_food {
  overflow: hidden;
  padding: 10px 8px;
}

.oc_food dt {
  width: 4.38rem;
  height: 4rem;
  margin-right: 10px;
  padding: 0.31rem 0;
}

.oc_food dt img {
  border: 1px solid #d9d9d9;
  width: 100%;
  height: 100%;
}

.oc_food dl {
  overflow: hidden;
  border-bottom: 1px solid #f0f0f0;
}

.oc_food dl dd {
  /*height: 50px;
			line-height: 50px;*/
  margin-top: 6%;
  width: 70%;
}

.oc_food dl dd p {
  display: table-cell;
  vertical-align: middle;
}

.oc_food dl dd p:nth-child(1) {
  width: 62%;
}

.oc_food dl dd p:nth-child(3) {
  text-align: right;
}

.oc_cost {
  width: 97%;
  background-color: #fff;
  margin: 0 auto;
  padding: 0 10px;
  margin-bottom: 4rem;
}

.oc_tar {
  text-align: right;
}

.oc_cost ul li {
  width: 100%;
  line-height: 2rem;
  overflow: hidden;
  border-bottom: 1px dashed #c8c8c8;
  font-size: 0.88rem;
}

.oc_cost ul li:last-child {
  border: none;
  padding-bottom: 10px;
}

.oc_btn {
  width: 92%;
  height: 2.81rem;
  line-height: 2.81rem;
  text-align: center;
  /*margin: 20px auto;*/
  border: none;
  display: block;
  font-size: 1.3rem;
  margin: 0.2rem auto;
}

.oc_nbtn {
  background: #b7b7b7;
  color: #fff;
}

.oc_ybtn {
  background: #1eb428;
  color: #fff;
}

.oc_btn_div {
  width: 100%;
  height: 3.3rem;
  line-height: 3.3rem;
  background: #fff;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #f0f0f0;
}

.oc_sendTime {
  width: 97%;
  background-color: #fff;
  margin: 0 auto;
  overflow: hidden;
  padding: 0.625rem 10px;
}

.oc_time {
  text-align: left;
  width: 7rem;
  height: 1.88rem;
  line-height: 1.88rem;
  text-align: center;
  margin-left: 4%;
  font-size: 0.75rem;
  color: #999999;
}

#oc_time {
  background: rgba(0, 0, 0, 0);
  border: 0;
  border-radius: 0;
  height: 1.88rem;
  width: 100%;
  background: url(../assets/select.jpg) no-repeat;
  background-size: 100%;
}

.oc_estimate {
  color: #c8c8c8;
  font-size: 0.69rem;
}

.oc_sendTime p {
  padding-top: 0.5rem;
  margin-left: 2px;
}

.oc_next {
  width: 3.43rem;
  border: 1px solid #dcdcdc;
  height: 1.88rem;
  background: url(../assets/oc_next.jpg) no-repeat;
  background-size: 100%;
}

.oc_dpn {
  display: none;
}

.oc_foodNum {
  margin-right: 5%;
}

.oc_remarks {
  padding: 10px 5px;
  width: 97%;
  margin: 0 auto;
}

.oc_remarks p {
  color: #c8c8c8;
}

.oc_remarks textarea {
  width: 98%;
  height: 3rem;
  margin-top: 5px;
  border: 2px solid #dcdcdc;
  border-radius: 0;
  overflow: auto;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

.oc_shadow {
  width: 100%;
  height: 100%;
  background: rgba(1, 1, 1, 0.5);
  position: absolute;
}

.oc_cost_coupon {
  color: #eb3c3c;
}

.toChooseCoupon span {
  float: left;
}

.toChooseCoupon i {
  width: 0.6rem;
  height: 1.06rem;
  background: url(../img/om_left.png) no-repeat;
  background-size: 100%;
  display: inline;
  float: right;
  margin-top: 0.47rem;
  margin-left: 0.47rem;
}
.load_div {
  position: absolute;
  top: 40%;
  left: 50%;
}
@media only screen and (min-width: 320px) and (max-width: 480px) {
  html {
    font-size: 17px;
  }
}
</style>
