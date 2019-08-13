import request from "../utils/request";

/**获取验证码接口 */
export function getVerifiCationData(data) {
  return request({
    url: "https://easy-mock.com/mock/5b2385e3debe3c5977248a16/wscn/captcha",
    data,
    method: "GET"
  });
}

/**提交数据 */
export function submit(data) {
  return request({
    url: "https://easy-mock.com/mock/5b2385e3debe3c5977248a16/wscn/submit",
    data,
    method: "POST"
  });
}
