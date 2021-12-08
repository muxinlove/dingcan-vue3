<template>
  <div class="cc_main" id="cc_main">
    <!--搜索框-->
    <div class="cc_input">
      <input type="text" v-model="searchName" placeholder="请输入地址" />
      <span class="cc_btn" @click="search()">搜索</span>
    </div>
    <div class="cc_main_map">
      <div class="cc_map" id="cc_map">
        <img src="../assets/map.png" style="width: 100%; height: 100%" />
      </div>
      <div class="cc_icon">
        <img src="../assets/position_icon2.png" />
      </div>
    </div>

    <div class="cc_maplist">
      <ul id="cc_searchAddrListData">
        <li
          class="lp_searchLi"
          v-for="(addr, index) in mapAddrs.sourceData"
          :key="index"
          @click="selectAddr(addr)"
        >
          <p class="fl">
            <em></em>
          </p>
          <p class="fl address">
            <a>{{ addr.address }}</a>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import router from "../router/router.js";
import mapService from "../services/map.service.js";
import storageUtil from "../utils/storageUtil";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const searchName = ref("");
    const mapAddrs = reactive({
      sourceData: [],
    });

    let map = null;
    let locAddr = null;

    onMounted(() => {
      // 需要获取dom
      // jsonp形式 引用百度地图app
      mapService.loadMapAPI("cc_main", "init");
    });

    // 添加全局函数
    window.init = async function () {
      map = new BMap.Map("cc_map"); // 创建Map实例

      let lng = "116.404";
      let lat = "39.915";
      /*从session中读取的跳转之前的地址*/
      const inputAddr = storageUtil.session.getItem(
        storageUtil.KEYS.INPUT_ADDR
      );
      locAddr = storageUtil.session.getItem(storageUtil.KEYS.LOC_ADDR);
      const addr = inputAddr || locAddr;

      if (addr) {
        lng = addr.lng;
        lat = addr.lat;
        const point = new BMap.Point(lng, lat); // 创建点坐标
        map.centerAndZoom(point, 15);
        showList();
      } else {
        // 浏览器定位
        const currentAddr = await mapService.getCurrentAddr();
        const point = new BMap.Point(currentAddr.lng, currentAddr.lat); // 创建点坐标
        map.centerAndZoom(point, 15);
        showList();
      }

      map.setCurrentCity("上海");

      // 监听事件
      // 拖拽结束
      map.addEventListener("dragend", () => {
        showList();
      });
      // 缩放结束
      map.addEventListener("zoomend", () => {
        showList();
      });
    };

    // 解绑
    onUnmounted(() => {
      map.removeEventListener("dragend");
      map.removeEventListener("zoomed");
    });

    async function showList() {
      // 获取中心点
      const cPoint = map.getCenter();
      try {
        const result = await mapService.getAroundAddrs(cPoint);
        mapAddrs.sourceData = result;
      } catch (error) {
        console.log("error", error);
      }
    }

    async function search() {
      const name = searchName.value && searchName.value.trim();
      if (name) {
        const point = await mapService.getPointByAddr(name);
        map.centerAndZoom(point, 15);
        showList();
      }
    }
    function selectAddr(addr) {
      if (locAddr) {
        addr.name = addr.address;
        storageUtil.session.setItem(storageUtil.KEYS.CURRENT_ADDR, addr);
        //跳转
        router.push("/home");
        return;
      }
      // 將选择的地址添加到session中
      storageUtil.session.setItem(storageUtil.KEYS.MAP_ADDR, addr);
      const { id } = route.query;
      router.push(`/addNewAddr?id=${id || 0}`);
    }

    return {
      searchName,
      search,
      selectAddr,
      mapAddrs,
    };
  },
};
</script>

<style lang="scss">
@import url("../style/index.scss");
.cc_main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cc_input {
  width: 97%;
  margin: 10px auto;
  background: #fff;
  height: 2.81rem;
  line-height: 2.81rem;
  padding-left: 10px;
  display: flex;
  align-items: center;
  flex-shrink: 1;
}

.cc_search {
  height: 2.81rem;
  line-height: 2.81rem;
  margin: 10px 0;
}

.cc_search em {
  width: 1.38rem;
  height: 1.38rem;
  margin: 2px 0;
  display: inline-block;
  background: url(../assets/lp_search.png) no-repeat;
  background-size: 100%;
}

.cc_input input {
  height: 2rem;
  border: none;
  margin-left: 10px;
  flex-grow: 1;
}

.cc_btn {
  display: inline-block;
  background: #eb3c3c;
  color: #fff;
  width: 19%;
  text-align: center;
  font-size: 1.06rem;
  flex-shrink: 1;
}

.cc_map {
  width: 100%;
  height: 15.19rem;
  background: #fff;
  overflow: hidden;
}

.cc_maplist {
  width: 97%;
  margin: 10px auto;
  background: #fff;
  flex-grow: 1;
  overflow-y: auto;
}

.cc_maplist li {
  overflow: hidden;
}

.cc_maplist li p:nth-child(1) {
  width: 20%;
  border-right: 1px solid #f0f0f0;
}

.cc_maplist li p:nth-child(2) {
  padding-left: 10px;
}

.cc_maplist li p {
  /*display: table-cell;
            vertical-align: middle;*/
  text-align: center;
}
.cc_maplist .address {
  width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.cc_maplist li p em {
  width: 0.625rem;
  height: 1rem;
  display: inline-block;
  background: url(../assets/ana_search.png) no-repeat;
  background-size: 100%;
}

.cc_maplist li {
  line-height: 2.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.cc_main_map {
  position: relative;
  flex-shrink: 0;
}

.cc_icon {
  width: 1.83rem; /*2.69rem*/
  height: 3rem; /*3.625rem*/
  position: absolute;
  top: 24%;
  left: 50%;
  margin-left: -1.23rem;
}

.cc_icon img {
  width: 100%;
}
</style>
