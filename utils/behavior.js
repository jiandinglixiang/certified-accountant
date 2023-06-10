import { POST_BEHAVIOR } from "@/api"
import { BEHAVIOR_RECORDS } from "@/utils/consts"
import { findFormEndIndex } from "@/utils/func"
import { httpRequest } from "@/utils/http"
import dayjs from "dayjs"

const onceDayCache = (() => {
  const cache =
    uni.getStorageSync(BEHAVIOR_RECORDS)?.filter?.((item) => dayjs().isSame(item.expire, "day")) ||
    []
  // 过滤出过期的并更新
  uni.setStorageSync(BEHAVIOR_RECORDS, cache)
  return cache
})()

export function pushBehavior({
  action = "",
  replaceValue = "",
  onceDay = false,
  isCallback = false
}) {
  const callback = () => {
    const cacheKey = replaceValue + action
    if (onceDay) {
      const index = findFormEndIndex(onceDayCache, (item) => item.key === cacheKey)
      // 找到缓存 不执行
      if (index !== undefined) {
        if (dayjs().isSame(onceDayCache[index].expire, "day")) {
          console.log("不上报，每天一次", action)
          return
        }
        spliceOnceDayCache(index, 1) // 删除缓存并继续上报
      }
    }
    // action = "登录\t710\t用户登录 {AP名称} APP"
    const contents = action.split(/\t|\n/)
    if (replaceValue) {
      contents[2] = replaceBracketsContent(contents[2], replaceValue.split(","))
    }
    httpRequest(POST_BEHAVIOR, "POST", {
      behavior_id: contents[1],
      content: contents[2]
    })
      .then(() => {
        onceDay && spliceOnceDayCache(onceDayCache.length, 0, { key: cacheKey, expire: Date.now() })
        console.log("上报", contents)
      })
      .catch((err) => {
        console.error("上报失败", action, err)
      })
  }
  return isCallback ? callback : callback()
}

export function spliceOnceDayCache(start, deleteCount, ...add) {
  onceDayCache.splice(start, deleteCount, ...add)
  uni.setStorageSync(BEHAVIOR_RECORDS, onceDayCache)
  return onceDayCache
}

function replaceBracketsContent(str, replacements) {
  let index = 0
  return str.replace(/\{([^}]+)\}/g, (match, placeholder) => {
    if (index < replacements.length) {
      const replacement = replacements[index]
      index++
      return replacement
    }
    return match
  })
}
