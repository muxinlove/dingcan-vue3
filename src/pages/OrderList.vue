<template>
  <div id="om_main">
    <div
      class="om_orderDetails bgw"
      v-for="(order, index) in orders.sourceData"
      :key="index"
    >
      <div class="om_orderDetails_top">
        <p class="fl om_orderNum">
          订单号：<span class="om_orderDetails_top_orderNum">{{
            order._id
          }}</span>
        </p>
        <p class="fr red om_orderState">
          状态：
          <span class="om_orderDetails_top_orderState">
            <span class="om_cR" v-show="order.state == 0">待支付</span>
            <span class="om_cG" v-show="order.state == 1">待接单</span>
            <span class="om_cG" v-show="order.state == 3">已完成</span>
            <span class="om_cR" v-show="order.state == 4">店铺拒单</span>
            <span class="om_cG" v-show="order.state == 5">已接单</span>
            <span class="om_cO" v-show="order.state == 6">已退单</span>
            <span class="om_cO" v-show="order.state == 7">已取消</span>
            <span class="om_cG" v-show="order.state == 9">退单中</span>
            <span class="om_cR" v-show="order.state == 10">退单失败</span>
          </span>
        </p>
      </div>
      <div
        class="om_orderDetails_mid"
        v-for="(meal, mealIndex) in order.detail.meals"
        :key="mealIndex"
      >
        <div class="om_orderDetails_mid_left fl">
          <img :src="meal.picture" />
        </div>
        <div class="om_orderDetails_mid_right fl">
          <ul>
            <li class="om_orderDetails_mid_right_name">
              {{ meal.mealName }}
            </li>
            <li class="om_orderDetails_mid_right_Num">
              X<span class="om_foodNum">{{ meal.count }}</span>
            </li>
            <li class="om_orderDetails_mid_right_pric">
              <span class="om_foodPirc">{{ meal.price }}</span
              >元
            </li>
          </ul>
        </div>
      </div>
      <div class="om_orderDetails_botm">
        <ul>
          <li>
            <p class="fl">配送地址：{{ order.address }}</p>
            <p class="fr">配送费用：{{ order.peisongfei }}元</p>
          </li>
          <li>
            <p class="fl">送餐时间：{{ order.arrive_time }}</p>
            <p class="fr om_cR">优惠减免：0元</p>
          </li>
          <li>
            <p class="fl">下单时间：10:00</p>
            <p class="fr">实付：{{ order.detail.money }}元</p>
          </li>
        </ul>
      </div>
      <div class="om_orderDetails_btn">
        <div class="om_orderDetails_btn_left fl">
          <a href="javascript:;" @click="onValidHandle"
            ><img src="../assets/om_tel.png"
          /></a>
        </div>
        <div class="om_orderDetails_btn_right fr">
          <button class="btn om_cancelOrder fl" @click="onValidHandle">
            取消
          </button>
          <button class="btn om_checkStatic fr" @click="toDetail(order._id)">
            查看状态
          </button>
          <button
            class="btn om_pay fr"
            onClick="alert('功能未开放')"
            v-show="order.state == 0"
          >
            立即支付
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import storageUtil from "../utils/storageUtil";
import http from "@/http/index";
import api from "@/api/index";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const orders = reactive({
      sourceData: [],
    });
    function toDetail(orderId) {
      router.push(`/orderDetail?id=${orderId}`);
    }
    onMounted(async () => {
      var user = storageUtil.local.getItem(storageUtil.KEYS.USER);
      const data = await http.get(api.getOrdersByUserId, {
        params: { id: user._id },
      });
      orders.sourceData = data.data.data;
    });
    function onValidHandle() {
      alert("功能未开放");
    }
    return {
      orders,
      toDetail,
      onValidHandle,
    };
  },
};
</script>

<style lang="scss">
@import url("../style/index.scss");
* {
  margin: 0;
  padding: 0;
}

.bgw {
  background-color: #fff;
}

#om_main {
  width: 100%;
  height: 100%;
}

#om_main .om_orderDetails {
  width: 97%;
  margin: 10px auto;
  background-color: #ffffff;
}

.red {
  color: #eb3c3c;
}

#om_main .om_orderNum {
  font-size: 0.6rem;
}
.om_orderDetails_top_orderState {
  font-size: 0.6rem;
}

#om_main .om_orderDetails_top {
  overflow: hidden;
  line-height: 2.56rem;
  padding-right: 10px;
  padding-left: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 11px;
}

#om_main .om_orderState {
  font-size: 0.88rem;
}

#om_main .om_orderDetails_mid {
  padding-right: 10px;
  padding-left: 16px;
  overflow: hidden;
  font-size: 0.88rem;
}

#om_main .om_orderDetails_mid_left {
  width: 18.6%;
  height: 3.5rem;
  margin-bottom: 15px;
  margin-right: 10px;
}

#om_main .om_orderDetails_mid_left img {
  width: 100%;
  display: inline-block;
  border: 1px solid #f0f0f0;
}

#om_main .om_orderDetails_mid_right {
  overflow: hidden;
  margin-top: 6px;
  width: 77%;
}

#om_main .om_orderDetails_mid_right ul {
  width: 100%;
  font-size: 0.96rem;
}

#om_main .om_orderDetails_mid_right ul li {
  float: left;
  display: table-cell;
}

#om_main .om_orderDetails_mid_right_name {
  width: 63%;
}

#om_main .om_orderDetails_mid_right_Num {
  width: 19%;
  text-align: center;
}

#om_main .om_orderDetails_mid_right_pric {
  float: right !important;
}

#om_main .om_orderDetails_botm {
  padding-right: 10px;
  padding-left: 16px;
  overflow: hidden;
}

#om_main .om_orderDetails_botm ul li {
  overflow: hidden;
  font-size: 0.88rem;
  margin-bottom: 19px;
}

#om_main .om_orderDetails_btn {
  overflow: hidden;
  /*padding-right: 10px;
			padding-left: 16px;*/
  border-top: 1px solid #f0f0f0;
  margin-top: 7.5px;
  padding: 10px 10px 16px;
}

#om_main .om_orderDetails_btn img {
  width: 2.25rem;
  height: 2.25rem;
}

#om_main .om_orderDetails_btn_right {
  overflow: hidden;
}

#om_main .om_orderDetails_btn_right button {
  width: 6.88rem;
  height: 2.5rem;
  border: 1px solid #c8c8c8;
  line-height: 2.5rem;
  text-align: center;
}

#om_main .om_orderDetails_btn_left {
  width: 15%;
}

#om_main .om_orderDetails_btn_right {
  overflow: hidden;
  /*margin-top: -10px;*/
  width: 85%;
}

#om_main .om_orderDetails_btn_right .om_cancelOrder {
  background-color: #ffffff;
  border-radius: 50%;
  width: 2.3rem;
  height: 2.3rem;
  border-color: #646464;
  color: #000;
}

#om_main .om_orderDetails_btn_right .om_checkStatic {
  background-color: #14a050;
  border: none;
  color: #fff;
  border-radius: 2px;
}

.om_pay,
.om_again {
  background: #df393d;
  border: none !important;
  color: #fff;
  font-size: 0.96rem;
  border-radius: 2px;
}

.om_dpb {
  display: inline-block;
}

.om_dpn {
  display: none;
}
.om_cR {
  color: #eb3c3c;
}
.om_cG {
  color: #14a050;
}
.om_cO {
  color: #969696;
}
.load_div {
  position: absolute;
  top: 40%;
  left: 50%;
}
</style>
