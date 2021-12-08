<template>
  <div class="lp_search" id="locDiv">
    <div class="table w100">
      <div class="cell" style="width: 1.5rem"><i></i></div>
      <div class="cell">
        <input
          type="text"
          id="search_addr"
          placeholder="请输入所在写字楼/小区/学校等"
          v-model="searchText"
          @change="search()"
        />
      </div>
      <div class="cell tr" v-show="showSearch" @click="cancelSearch()">
        <a href="javascript:" id="cancel" class="btn">取消</a>
      </div>
    </div>
  </div>

  <div class="lp_searchAddrList" v-show="showSearch">
    <ul id="lp_searchAddrListData">
      <li
        class="addrItem"
        v-for="(searchAddr, index) in searchAddrs.sourceData"
        :key="index"
        @click="toHome(searchAddr)"
      >
        {{ searchAddr.name }}
      </li>
    </ul>
  </div>

  <div class="addr-wrap" id="info" v-show="!showSearch">
    <p class="p-label">当前位置</p>
    <div class="addr cur-addr table w100">
      <div class="cell addrItem" @click="toHome(currentAddr)">
        {{ currentAddr.name }}
      </div>
      <div class="lp_position cell tr" @click="relocation()">
        <a id="doPos" href="javascript:"
          ><i :class="{ posing: isPosing }"></i>重新定位</a
        >
      </div>
    </div>
    <p class="p-label">附近地址</p>
    <div class="addr">
      <ul>
        <li
          class="addrItem"
          v-for="(aroundAddr, index) in aroundAddrs.sourceData"
          :key="index"
          @click="toHome(aroundAddr)"
        >
          {{ aroundAddr.address }}
        </li>
        <li style="position: relative">
          <a
            style="display: block; width: 100%; height: 100%"
            @click="routeLink('/chooseCoordinate')"
          >
            更多地址
            <span
              class="fr nav-left"
              style="position: absolute; right: 0; top: 50%; margin-top: -5px"
            ></span>
          </a>
        </li>
      </ul>
    </div>
    <p class="p-label">收货地址</p>
    <div class="addr">
      <ul>
        <li
          class="addrItem"
          v-for="(addr, index) in addrs.sourceData"
          :key="index"
          @click="toHome(addr)"
        >
          <p class="user">{{ addr.contactor }}</p>
          <p class="user-addr">{{ addr.address }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import storageUtil from "../utils/storageUtil";
import http from "@/http/index";
import api from "@/api/index";
import { useRouter } from "vue-router";
import mapService from "../services/map.service";

export default {
  setup() {
    const router = useRouter();
    const searchText = ref("");
    const showSearch = ref(false);
    const isPosing = ref(false);
    const searchAddrs = reactive({
      sourceData: [],
    });
    const aroundAddrs = reactive({
      sourceData: [],
    });
    const addrs = reactive({
      sourceData: [],
    });
    const currentAddr = reactive({});

    onMounted(() => {
      // 获取收货地址
      fetchAddress();

      // 读取session的当前地址
      var cacheCurrentAddr = storageUtil.session.getItem(
        storageUtil.KEYS.CURRENT_ADDR
      );
      for (const key in cacheCurrentAddr) {
        currentAddr[key] = cacheCurrentAddr[key];
      }

      //保存到session中
      storageUtil.session.setItem(storageUtil.KEYS.LOC_ADDR, currentAddr);
    });

    async function fetchAddress() {
      const user = storageUtil.local.getItem(storageUtil.KEYS.USER);
      if (user && user._id) {
        const result = await http.get(api.getAddrsByUserId, {
          params: { userId: user._id },
        });
        addrs.sourceData = result.data.data;
      } else {
        router.push("/login");
        return false;
      }
    }

    function search() {
      const text = searchText.value.trim();
      if (text) {
        showSearch.value = true;
        getAddrsByText(text);
      }
    }
    async function getAddrsByText(text) {
      const result = await mapService.getAddrsByText(text);
      searchAddrs.sourceData = result;
    }
    function cancelSearch() {
      searchText.value = "";
      showSearch.value = false;
      searchAddrs.sourceData = [];
    }
    function toHome(address) {
      const addr = {
        name: address.name || address.address,
        lat: address.lat || address.location.lat,
        lng: address.lng || address.location.lng,
      };
      //保存searchAddr
      storageUtil.session.setItem(storageUtil.KEYS.CURRENT_ADDR, addr);
      router.push("/home");
    }
    function relocation() {
      // 状态取反
      isPosing.value = true;
      // 定位获取位置 && 获取附近地址
      mapService.loadMapAPI("locDiv", "initMap");
      window.initMap = async function () {
        let result = await mapService.getCurrentAddr();
        for (const key in result) {
          currentAddr[key] = result[key];
        }
        //保存到session中
        storageUtil.session.setItem(storageUtil.KEYS.CURRENT_ADDR, result);

        result = await mapService.getAroundAddrs(currentAddr);
        aroundAddrs.sourceData = result;
        isPosing.value = false;
      };
    }
    function routeLink(path) {
      router.push(path);
    }
    return {
      searchText,
      showSearch,
      search,
      searchAddrs,
      addrs,
      isPosing,
      currentAddr,
      cancelSearch,
      toHome,
      relocation,
      aroundAddrs,
      routeLink,
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
body {
  padding: 0;
}

.lp_position i {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  background: url(../assets/lp_position.png) no-repeat;
  background-size: 100% auto;
  vertical-align: middle;
  margin-right: 3px;
}

.lp_position a {
  display: block;
}

.lp_search {
  background: #fff;
  padding: 0.625rem;
}

.lp_search a.btn {
  color: #fff;
  background: #ccc;
  padding: 0.3rem 0.625rem;
}

.lp_search i {
  display: inline-block;
  height: 1rem;
  width: 1rem;
  background: url(../assets/lp_search.png) no-repeat;
  background-size: 100%;
  vertical-align: middle;
}

.lp_search p {
  display: table-cell;
  vertical-align: middle;
  width: 91%;
  padding-left: 1rem;
}

.lp_search_right {
  width: 93%;
}

.lp_search input {
  height: 1.5rem;
  width: 100%;
  border: none;
  font-size: 0.875rem;
}

.lp_searchAddrList {
  margin: 0.625rem auto;
  padding: 0 0.625rem;
  z-index: 2;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.lp_dpn {
  display: none;
}

#lp_addrList {
  margin-top: 30px;
}

.addr-wrap {
  padding: 0.625rem 0;
  color: #444;
}
.addr-wrap .addr {
  background: #fff;
  margin: 0.3rem 0 0.625rem 0;
  padding: 0 0.625rem;
  line-height: 1.5rem;
}
.addr-wrap .cur-addr {
  padding: 0.5rem 0.625rem;
}
.p-label {
  padding: 0 0.625rem;
  color: #969696;
}
.addr-wrap li,
#lp_searchAddrListData li {
  padding: 0.625rem 0;
  border-bottom: 1px solid #efefef;
}
.addr-wrap li:last-child {
  border-bottom: 0;
}
.addr-wrap p.user {
  font-weight: bold;
}
.addr-wrap p.user-addr {
  color: #969696;
}

/*旋转动画*/
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

/*正在定位中样式(旋转动画)*/
.posing {
  overflow: hidden;
  -webkit-animation-name: rotate;
  -webkit-animation-duration: 0.1s;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;
}
</style>
