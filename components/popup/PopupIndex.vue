<template>
  <!--#ifdef H5-->
  <uni-popup class="max-index" ref="popup" type="center" :is-mask-click="false">
    <privacy-auth-popup
      v-if="popupKey === PRIVACY_AUTH_POPUP"
      :popup-data="params"
      @action="handleAction"
    />
    <agree-auth-popup
      v-else-if="popupKey === AGREE_AUTH_POPUP"
      :popup-data="params"
      @action="handleAction"
    />
    <login-tips-popup
      v-else-if="popupKey === LOGIN_TIPS_POPUP"
      :popup-data="params"
      @action="handleAction"
    />
    <home-ad-popup
      v-else-if="popupKey === HOME_AD_POPUP"
      :popup-data="params"
      @action="handleAction"
    />
  </uni-popup>
  <!--#endif-->
</template>
<script setup>
import { deepMergeObjects } from "@/utils/func"
// 根据环境接收 并emits出事件
// 接收popupKey
import { onUnmounted, ref } from "vue"
import {
  AGREE_AUTH_POPUP,
  HOME_AD_POPUP,
  LOGIN_TIPS_POPUP,
  PRIVACY_AUTH_POPUP
} from "./popupKeyMap"
import PrivacyAuthPopup from "./PrivacyAuthPopup.vue"
import AgreeAuthPopup from "@/components/popup/AgreeAuthPopup.vue"
import LoginTipsPopup from "@/components/popup/LoginTipsPopup.vue"
import HomeAdPopup from "@/components/popup/HomeAdPopup.vue"

const props = defineProps({
  params: Object,
  popupKey: String,
  autoClose: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(["action"])
const popup = ref()
const openParams = ref({ ...props.params })

onUnmounted(() => {
  uni.$off(props.popupKey)
})

function handleAction(...actionParams) {
  if (props.autoClose && actionParams[0] === "close") {
    close()
  }
  openParams.value?.handleClick?.(...actionParams) || emits("action", ...actionParams)
}
function open({ handleClick, ...args } = {}) {
  if (args) {
    args = deepMergeObjects(args, openParams.value)
    openParams.value = { ...args, handleClick }
  }
  // #ifndef H5
  uni.$on(props.popupKey, handleAction)
  uni.navigateTo({
    url:
      `/pages/popup/index?popupKey=${props.popupKey}&` +
      (args ? encodeURIComponent(JSON.stringify(args)) : "")
  })
  // #endif
  // #ifdef H5
  popup.value.open()
  // #endif
}
function close() {
  // #ifndef H5
  uni.navigateBack()
  // #endif
  // #ifdef H5
  popup.value.close()
  // #endif
}
defineExpose({
  open,
  close
})
</script>
<style lang="scss" scoped>
.max-index {
  z-index: 10000000;
}
</style>