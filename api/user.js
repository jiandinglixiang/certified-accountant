export const GET_USER_INFO = "/user/rest/v1/getUserInfo"

// 更新信息
export const POST_UPDATE_LOGIN_USER_INFO = "/user/rest/v1/updateLoginUserInfo"

// 获取OSS上传参数
export const GET_OSS_POST_PARAMS = "/oss/rest/v1/getPostPolicy"

// 分页查询 - 当前登录用户流水
export const GET_USER_ACCOUNT_GOLD_LOG = "/accountGoldLog/rest/v1/pageForLoginUserReal"

// 获取版本(可不需token)
export const GET_USER_CLIENT_VERSION = "/client/version"

export const POST_PHONE_SMS = `/client/smssend`

export const POST_PHONE_AND_SMS_LOGIN = `/client/smslogin`
