import { deepMergeObjects } from "@/utils/func"
import { USER_TOKEN_DATA } from "@/utils/consts"

const typeOfMethod = ["GET", "POST"]
export const ErrorCodes = ["100000"]

export const config = {
  baseUrl: "https://apigateway.pxo.cn/ztApp",
  header: {
    token: uni.getStorageSync(USER_TOKEN_DATA)?.token ?? "",
    appid: "10"
  }
}

export function httpRequest(path = "", method = "GET", data = {}, newConfigs = {}) {
  // #ifdef H5
  if (!typeOfMethod.includes(method)) {
    new Error("Method not enabled")
  }
  // #endif
  return new Promise((resolve, reject) => {
    uni.request({
      ...deepMergeObjects(config, newConfigs),
      url: `${config.baseUrl}${path}`,
      method,
      data,
      success: resolve,
      fail: reject
    })
  })
    .then((res) => {
      return res.data
    })
    .then((res) => {
      if (ErrorCodes.includes(res.code)) {
        console.error(res)
        return Promise.reject(res)
      }
      return res
    })
}
