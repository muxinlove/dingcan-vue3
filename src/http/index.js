import axios from "axios";
import { setInterceptors } from "./interceptors";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:3000",
  timeout: "5000",
  headers: { "Content-Type": "application/json;charset=UTF-8" },
});
setInterceptors(axiosInstance);

axiosInstance.jsonp = jsonp;

function jsonp(url) {
  return new Promise((resolve, reject) => {
    // 这里的 "jsonCallBack" ，和调用的 jsonp 的 url 中的 callback 值相对应（见粗体字）

    window.jsonCallBack = (result) => {
      resolve(result);
    };

    const JSONP = document.createElement("script");
    JSONP.type = "text/javascript";
    JSONP.src = url;
    document.getElementsByTagName("head")[0].appendChild(JSONP);
    setTimeout(() => {
      document.getElementsByTagName("head")[0].removeChild(JSONP);
    }, 500);
  });
}

export default axiosInstance;
