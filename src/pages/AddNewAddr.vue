<template>
  <div id="ana_main">
    <p class="ana_linkman">联系人信息</p>
    <div class="ana_fillin">
      <ul>
        <li>
          <p class="fl">姓 名：</p>
          <p class="fr">
            <input
              type="text"
              maxlength="20"
              name="contactor"
              placeholder="请填写收货人的姓名"
              v-model="address.contactor"
            />
          </p>
        </li>
        <li>
          <p class="fl">性 别：</p>
          <p class="fr ana_sex">
            <span class="ana_man" @click="setSex(1)">
              <i data-sex="1" :class="{ chooseBg: address.sex == 1 }"></i>男士
            </span>
            <span class="ana_girl" @click="setSex(2)">
              <i data-sex="2" :class="{ chooseBg: address.sex == 2 }"></i>女士
            </span>
          </p>
        </li>
        <li>
          <p class="fl">手 机：</p>
          <p class="fr">
            <input
              type="text"
              name="mobilephone"
              placeholder="请填写收货人的手机号"
              v-model="address.phone"
            />
          </p>
        </li>
      </ul>
    </div>

    <p class="ana_addr">地址信息</p>
    <div class="ana_addrDetail">
      <ul>
        <li>
          <div class="fl">学校\大厦\写字楼:</div>
          <div class="fr">
            <i></i>
            <input
              type="text"
              name="address"
              class="ana_searchAddr"
              placeholder="点击选择地址"
              @click="toAddrMap()"
              v-model="address.address"
            />
          </div>
        </li>
        <li>
          <div class="fl">详细地址:</div>
          <div class="fr">
            <input
              type="text"
              class="ana_detailAddr"
              name="doorplate"
              placeholder="请填写门牌号"
              v-model="address.doorplate"
            />
          </div>
        </li>
      </ul>
    </div>
    <button class="ana_btn btn" @click="save()">保存</button>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import storageUtil from "../utils/storageUtil";
import { useRoute, useRouter } from "vue-router";
import http from "@/http/index";
import api from "@/api/index";
import { ElMessage } from "element-plus";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const address = reactive({
      contactor: "",
      sex: "",
      phone: "",
      address: "",
      doorplate: "",
      userId: "",
    });
    onMounted(() => {
      const { id } = route.query;
      if (id !== "0") {
        document.title = "更新地址";
        // 获取地址
        fetchAddress(id);
      } else {
        document.title = "新增地址";
        /*读取local中的user*/
        const user = storageUtil.local.getItem(storageUtil.KEYS.USER);
        address.userId = user._id;
      }

      //读取session的当前地址
      const inputAddr = storageUtil.session.getItem(
        storageUtil.KEYS.INPUT_ADDR
      );
      if (inputAddr) {
        for (const key in inputAddr) {
          address[key] = inputAddr[key];
        }
        storageUtil.session.removeItem(storageUtil.KEYS.INPUT_ADDR);
      }

      // 读取session中的地图地址信息
      const mapAddr = storageUtil.session.getItem(storageUtil.KEYS.MAP_ADDR);
      if (mapAddr) {
        address.address = mapAddr.address;
        address.lat = mapAddr.lat;
        address.lng = mapAddr.lng;
        address.cityId = mapAddr.cityId;

        storageUtil.session.removeItem(storageUtil.KEYS.MAP_ADDR);
      }
    });

    function setSex(sex) {
      address.sex = sex;
    }

    function toAddrMap() {
      //保存当前地址
      storageUtil.session.setItem(storageUtil.KEYS.INPUT_ADDR, address);
      router.push(`/chooseCoordinate?id=${route.query.id || 0}`);
    }

    async function save() {
      const { id } = route.query;
      if (id !== "0") {
        const { data } = await http.put(api.updateAddr, address);
        if (data.code == 0) {
          ElMessage({
            message: "更新成功",
            type: "success",
          });
          setTimeout(() => {
            router.push("addrManage");
          }, 1000);
        }
      } else {
        const { data } = await http.post(api.addAddr, address);
        if (data.code == 0) {
          ElMessage({
            message: "新增成功",
            type: "success",
          });
          setTimeout(() => {
            router.push("addrManage");
          }, 1000);
        }
      }
    }

    async function fetchAddress(id) {
      const { data } = await http.get(api.getAddrByAddrId, {
        params: { addrId: id },
      });
      for (const key in data.data) {
        address[key] = data.data[key];
      }
    }

    return {
      address,
      setSex,
      toAddrMap,
      save,
    };
  },
};
</script>

<style lang="scss">
@import url("../style/index.scss");
#ana_main {
  width: 100%;
  height: 100%;
}

.ana_linkman,
.ana_addr {
  font-size: 0.88rem;
  margin: 10px 0 5px 15px;
  color: #969696;
}

.ana_fillin {
  background-color: #fff;
  width: 100%;
  overflow: hidden;
}

.ana_fillin ul li {
  line-height: 2.81rem;
  width: 100%;
  overflow: hidden;
  height: 2.81rem;
}

.ana_fillin ul li p {
  /*display: table-cell;*/
}

.ana_fillin ul li:nth-child(2) {
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.ana_fillin ul li p:nth-child(1) {
  width: 19%;
  text-align: center;
  border-right: 1px solid #f0f0f0;
  height: 2.81rem;
  font-size: 0.88rem;
}

.ana_fillin ul li input {
  height: 2.81rem;
  width: 100%;
  border: none;
  font-size: 0.85rem;
  padding-left: 5px;
}

.ana_fillin ul li p:nth-child(2) {
  width: 80%;
  font-size: 0.88rem;
}

.ana_fillin ul li p i {
  width: 0.81rem;
  height: 0.81rem;
  border: 1px solid #c8c8c8;
  display: inline-block;
  margin: -2px 5px;
}

.chooseBg {
  background: url(../assets/ca_choose.jpg) no-repeat;
  background-size: 100%;
}

.ana_man {
  margin-right: 15px;
}

.ana_addrDetail {
  background: #fff;
  overflow: hidden;
  width: 100%;
}

.ana_addrDetail li {
  overflow: hidden;
  line-height: 2.81rem;
  font-size: 0.88rem;
  width: 100%;
  height: 2.81rem;
}

.ana_addrDetail li:nth-child(1) {
  border-bottom: 1px solid #f0f0f0;
}

.ana_addrDetail li div:nth-child(1) {
  width: 45%;
  border-right: 1px solid #f0f0f0;
  text-align: right;
  padding-right: 5%;
  font-size: 0.88rem;
}

.ana_addrDetail li div:nth-child(2) {
  width: 55%;
}

.ana_addrDetail i {
  width: 0.625rem;
  height: 1rem;
  float: left;
  display: inline-block;
  background: url(../assets/ana_search.png) no-repeat;
  background-size: 100%;
  margin: 0.9rem 0.4rem;
}

.ana_addrDetail input {
  height: 2.81rem;
  border: none;
  width: 70%;
  font-size: 0.85rem;
}

.ana_detailAddr {
  margin-left: 10px;
}

.ana_btn {
  width: 92%;
  height: 2.81rem;
  background: #eb3c3c;
  margin: 0 auto;
  display: block;
  text-align: center;
  color: #fff;
  font-size: 1rem;
  border: none;
  margin-top: 20px;
}
</style>
