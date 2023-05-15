import { PRIVACY_URL, USER_AGREEMENT_URL } from "@/utils/consts"
import { config } from "@/utils/http"
import { APP_ID } from "@/config"
import { funcToPromise } from "@/utils/func"

const loginCallBackUrl = `${config.baseUrl}/client/onekeyloginuniapp`

export default async function openUniverify(successDeal, otherLogin) {
  let loginRes
  try {
    const { provider } = await funcToPromise(uni.getProvider, { service: "oauth" })
    if (!provider?.includes("univerify")) {
      throw new Error("no provider")
    }
    console.log(provider)

    await funcToPromise(uni.preLogin, { provider: "univerify" })
    loginRes = await funcToPromise(uni.login, {
      provider: "univerify",
      univerifyStyle: {
        fullScreen: true,
        icon: {
          path: "static/logo.png" // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
        },
        closeIcon: {
          path: "static/logo.png" // 自定义关闭按钮，仅支持本地图片。 HBuilderX3.3.7+版本支持
        },
        authButton: {
          normalColor: "#00A3FF", // 授权按钮正常状态背景颜色 默认值：#3479f5
          highlightColor: "#00A3FF", // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
          textColor: "#ffffff" // 授权按钮文字颜色 默认值：#ffffff
        },
        otherLoginButton: {
          visible: true, // 是否显示其他登录按钮，默认值：true
          normalColor: "#e1f5fe", // 其他登录按钮正常状态背景颜色 默认值：透明
          highlightColor: "#e1f5fe", // 其他登录按钮按下状态背景颜色 默认值：透明
          textColor: "#00A3FF", // 其他登录按钮文字颜色 默认值：#656565
          title: "其他手机号/账号登录", // 其他登录方式按钮文字 默认值：“其他登录方式”
          borderRadius: "24px" // 其他登录按钮圆角 默认值："24px" （按钮高度的一半）
        },
        privacyTerms: {
          defaultCheckBoxState: false, // 条款勾选框初始状态 默认值： true
          uncheckedImage: "static/logo.png", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)
          checkedImage: "static/logo.png", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)
          textColor: "#999999", // 文字颜色 默认值：#BBBBBB
          termsColor: "#00A3FF", //  协议文字颜色 默认值： #5496E3
          prefix: "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”
          suffix: "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”
          privacyItems: [
            // 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效
            {
              url: USER_AGREEMENT_URL, // 点击跳转的协议详情页面
              title: "用户协议" // 协议名称
            },
            {
              url: PRIVACY_URL,
              title: "隐私政策"
            }
          ]
        }
      }
    })
  } catch (err) {
    console.log(err)
    otherLogin && otherLogin()
    uni.closeAuthView()
    return
  }

  try {
    const {
      authResult: { access_token, openid }
    } = loginRes
    const res = await uniCloud.callFunction({
      name: "univerify",
      data: {
        url: loginCallBackUrl,
        access_token,
        openid,
        appid: APP_ID
      }
    })
    console.log(res)
    if (!res.result?.data?.data) {
      // 获取手机号失败，请使用其他方式登录。
      throw new Error("获取手机号失败，请使用其他方式登录")
    }
    successDeal && successDeal(res.result.data.data)
  } catch (err) {
    console.log(err)
    otherLogin && otherLogin()
    uni.closeAuthView()
  }
}
