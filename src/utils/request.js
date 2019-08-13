import axios from "axios";
import { Message, Loading } from "element-ui";

let loadingInstance;
/**创建axios实例 */
const server = axios.create({
  withCredentials: true,
  timeout: 5000
});
server.interceptors.request.use(
  config => {
    loadingInstance = Loading.service({ fullscreen: true, lock: true });
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**拦截响应 */
server.interceptors.response.use(
  response => {
    /**关闭加载框 */
    loadingInstance && loadingInstance.close();
    let res = response.data;
    if (res.code === 500) {
      Message.warning("网络错误(T＿T)");
      return Promise.reject(res.message || "error");
    } else if (res.code === 200) {
      Message.success("请求成功");
      return res;
    }
  },
  error => {
    Message.warning("请求出错");
    loadingInstance && loadingInstance.close();
    return Promise.reject(error);
  }
);
export default server;
