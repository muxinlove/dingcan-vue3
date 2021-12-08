<template>
  <div id="addr_main">
    <div id="addr_addrList">
      <div
        class="addr_addr addr_util"
        v-for="(addr, index) in addrs.sourceData"
        :key="index"
      >
        <div class="addr_addr_left fl" @click="toOrderConfirm(addr)">
          <div>
            <p class="addr_name">
              {{ addr.contactor }}<span class="addr_tel">{{ addr.phone }}</span>
            </p>
            <p class="addr_addr_left_addr">
              {{ addr.address }}
            </p>
          </div>
        </div>
        <div class="addr_addr_right fr">
          <div class="addr_edit" @click="toUpdateUI(addr)">
            <i></i>
          </div>
          <div class="addr_del" @click="toDelete(addr._id)">
            <i></i>
          </div>
        </div>
      </div>
    </div>
    <div class="addr_addBtn_div">
      <button class="btn addr_addBtn" @click="toAddUI()">新增收货地址</button>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import http from "@/http/index";
import api from "@/api/index";
import storageUtil from "../utils/storageUtil";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  setup() {
    const router = new useRouter();
    const addrs = reactive({
      sourceData: [],
    });

    onMounted(async () => {
      fetchAddressList();
    });

    async function fetchAddressList() {
      const user = storageUtil.local.getItem(storageUtil.KEYS.USER);
      const { data } = await http.get(api.getAddrsByUserId, {
        params: { userId: user._id },
      });
      addrs.sourceData = data.data;
    }

    function toOrderConfirm(addr) {
      //保存
      storageUtil.session.setItem(storageUtil.KEYS.ORDER_ADDR, addr);
      //跳转下单页面
      router.push("/orderConfirm");
    }
    function toUpdateUI(addr) {
      router.push(`/addNewAddr?id=${addr._id}`);
    }
    function toDelete(addrId) {
      ElMessageBox.confirm("你确认删除吗?")
        .then(async () => {
          const { data } = await http.delete(api.deleteAddrById, {
            params: { addrId },
          });
          if (data.code == 0) {
            ElMessage({
              message: "删除成功",
              type: "success",
            });
            fetchAddressList();
          }
        })
        .catch(() => {
          // catch error
        });
    }
    function toAddUI() {
      router.push("/addNewAddr?id=0");
    }
    return {
      addrs,
      toOrderConfirm,
      toUpdateUI,
      toDelete,
      toAddUI,
    };
  },
};
</script>

<style lang="scss">
@import url("../style/index.scss");

#addr_main {
  width: 100%;
  height: 100%;
}

.addr_util {
  padding: 0 0 0 15px;
}

.addr_title {
  background-color: #282828;
  height: 2.81rem;
  line-height: 2.81rem;
  text-align: center;
  color: #fff;
  font-size: 1.06rem;
  position: relative;
}

.addr_title span {
  font-size: 1.06rem;
  position: absolute;
  left: 0;
}

.addr_title span i {
  width: 0.44rem;
  height: 0.81rem;
  background: url(../assets/addr_prev.png) no-repeat;
  background-size: 100%;
  display: inline-block;
  margin-right: 10px;
}

.addr_addr {
  height: 5.81rem;
  background-color: #fff;
  overflow: hidden;
  margin-top: 5px;
}

.addr_addr .addr_addr_left {
  height: 5.81rem;
  width: 80%;
  /*232px*/
  position: relative;
}

.addr_addr .addr_addr_left div {
  position: absolute;
  top: 50%;
  margin-top: -23px;
}

.addr_name {
  font-size: 1rem;
  color: #333333;
  line-height: 1.44rem;
  font-weight: bold;
}

.addr_name span {
  padding-left: 20px;
  font-weight: normal;
}

.addr_name span,
.addr_addr_left_addr {
  font-size: 0.8rem;
  color: #999999;
  margin-top: 0.3rem;
}

.addr_addr_right {
  border-left: 1px solid #f0f0f0;
  width: 20%;
}

.addr_addr_right div {
  height: 2.94rem;
  width: 4.44rem;
  line-height: 2.94rem;
  text-align: center;
}

.addr_addr_right .addr_edit {
  border-bottom: 1px solid #f0f0f0;
}

.addr_addr_right i {
  display: inline-block;
}

.addr_addr_right .addr_edit i {
  width: 1rem;
  height: 1rem;
  background: url(../assets/addr_edit.png) no-repeat;
  background-size: 100%;
}

.addr_addr_right .addr_del i {
  width: 0.81rem;
  height: 1rem;
  background: url(../assets/addr_del.png) no-repeat;
  background-size: 100%;
}

#addr_addrList {
  /*overflow: hidden;*/
  margin-bottom: 3rem;
}

.addr_addBtn {
  width: 90%;
  height: 2.81rem;
  border: none;
  line-height: 2.81rem;
  text-align: center;
  font-size: 1.19rem;
  background: #eb3c3c;
  color: #fff;
  display: block;
  margin: 0.2rem auto;
}

.addr_addBtn_div {
  width: 100%;
  height: 3.3rem;
  line-height: 3.3rem;
  background: #fff;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #f0f0f0;
}

@media only screen and (min-width: 320px) and (max-width: 480px) {
  html {
    font-size: 17px;
  }
}
</style>
