import qs from "qs";
import { ElMessage } from "element-plus";

function doError(error) {
  if (error.response) {
    return error.response;
  }
}

export function setInterceptors(ins) {
  const requestInterceptor = ins.interceptors.request.use(
    (config) => {
      // get传参序列化
      if (config.method === "get") {
        config.paramsSerializer = (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        };
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const responseInterceptor = ins.interceptors.response.use(
    (response) => {
      if (response.data.code && response.data.msg) {
        if (!response.config.noMessage) {
          ElMessage({
            message: response.data.msg,
            type: "error",
            showClose: "true",
          });
        }
      }
      return Promise.resolve(response);
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        return Promise.resolve(doError(error));
      }
      return Promise.reject(doError(error));
    }
  );
  return {
    requestInterceptor,
    responseInterceptor,
  };
}
