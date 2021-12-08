import $http from "@/http/index";
/*
 * 与地图相关的mapService模块
 */
export default {
  loadMapAPI,
  getAroundAddrs,
  getPointByAddr,
  getCurrentAddr,
  getAddrsByText,
};

/**
 * 引入地图api
 * @param {显示地图的容器id} containerId
 * @param {回调函数} callback
 */
function loadMapAPI(containerId, callback) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src =
    "http://api.map.baidu.com/api?v=2.0&ak=P4dTDRZEnFpdkvariAHELPnmHHRLk4sc&callback=" +
    callback;
  document.getElementById(containerId).appendChild(script);
}

/**
 * 获取坐标点附近的地址列表
 * @param {坐标} point
 */
function getAroundAddrs(point) {
  return new Promise(async (resolve, reject) => {
    //根据cPoint得到附近的多个地址的列表
    const url =
      "http://api.map.baidu.com/geocoder/v2/?ak=P4dTDRZEnFpdkvariAHELPnmHHRLk4sc&callback=jsonCallBack&location=" +
      point.lat +
      "," +
      point.lng +
      "&output=json&pois=1";
    try {
      const data = await $http.jsonp(url);
      const result = data.result;
      const cityId = result.cityCode;
      const mapAddrs = [];
      result.pois.forEach(function (item) {
        const address = item.name;
        const lat = item.point.y;
        const lng = item.point.x;
        mapAddrs.push({ address, lat, lng, cityId });
      });
      resolve(mapAddrs);
    } catch (error) {
      alert("请求地图地址失败");
    }
  });
}

/*
 * 根据地址名称得到对应的坐标点
 * 正解析
 * */
function getPointByAddr(name) {
  return new Promise((resolve, reject) => {
    // 创建地址解析器实例
    const myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      name,
      function (point) {
        if (point) {
          resolve(point);
        }
      },
      "上海市"
    );
  });
}

/*
 * 得到当前的坐标
 * 逆解析
 * */
function getCurrentAddr() {
  return new Promise((resolve, reject) => {
    const geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(
      function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          const point = r.point;

          const geoc = new BMap.Geocoder();
          geoc.getLocation(point, function (rs) {
            const addComp = rs.addressComponents;
            const name =
              addComp.city +
              addComp.district +
              addComp.street +
              addComp.streetNumber;
            resolve({
              name: name,
              lng: point.lng,
              lat: point.lat,
            });
          });
        } else {
          alert("获取定位失败");
        }
      },
      { enableHighAccuracy: true }
    );
  });
}

/*
通过关键词搜索附近地址
 */
function getAddrsByText(text) {
  return new Promise(async (resolve, reject) => {
    const url =
      "http://api.map.baidu.com/place/v2/search?q=" +
      text +
      "&region=上海&output=json&" +
      "ak=P4dTDRZEnFpdkvariAHELPnmHHRLk4sc&callback=jsonCallBack";
    try {
      const data = await $http.jsonp(url);
      resolve(data.results);
    } catch (error) {
      alert("搜索地址失败");
    }
  });
}
