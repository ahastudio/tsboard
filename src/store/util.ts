/**
 * store/util
 *
 * 여러 곳에서 자주 사용되는 함수들 모음
 */

import { ref } from "vue"
import { useRouter } from "vue-router"
import { defineStore } from "pinia"
import { BOARD_TYPE, READ_POST_KEY } from "../../server/database/board/const"
import { BoardType } from "../interface/board"

export const useUtilStore = defineStore("util", () => {
  const router = useRouter()
  const snackbar = ref<boolean>(false)
  const snackbarTimeout = ref<number>(3000)
  const snackbarText = ref<string>("")
  const alertbar = ref<boolean>(false)
  const alertType = ref<"success" | "error" | "info">("error")
  const alertText = ref<string>("")
  const alertTimeout = ref<number>(3000)
  const filters = {
    basic: /[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gim,
    nospace: /[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/ ]/gim,
    email: /^([0-9a-z_\.-]+)@([0-9a-z_-]+)(\.[a-z]+){1,2}$/,
    password: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
    url: /(http(s)?:\/\/)(www\.)?[-a-zA-Z0-9@:%._\+\/~#=]{2,256}\.(jpg|jpeg|png|gif)?\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/,
    youtube: /(https:\/\/)(www\.)?(youtu(be)?)\.(be|com)?\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/,
  }

  // 스낵 메시지 보여주기
  function snack(message: string, timeout: number = 3000): void {
    snackbarText.value = message
    snackbarTimeout.value = timeout
    snackbar.value = true
  }

  // 상단 알림 메시지 보여주기
  function alert(
    message: string,
    type: "success" | "error" | "info" = "error",
    timeout: number = 5000,
  ): void {
    alertText.value = message
    alertType.value = type
    alertbar.value = true
    alertTimeout.value = timeout
  }

  // 성공 메시지 축약형
  function success(message: string, timeout: number = 5000): void {
    alert(message, "success", timeout)
  }

  // 에러 메시지 축약형
  function error(message: string, timeout: number = 5000): void {
    alert(message, "error", timeout)
  }

  // 정보 메시지 축약형
  function info(message: string, timeout: number = 5000): void {
    alert(message, "info", timeout)
  }

  // 페이지 이동하기
  function go(name: string, id: string = "", no: number = 0): void {
    if (id.length < 1) {
      if (no < 1) {
        router.push({ name })
        return
      }
      router.push({ name, params: { no } })
      return
    }
    if (no < 1) {
      router.push({ name, params: { id } })
      return
    }
    router.push({ name, params: { id, no } })
  }

  // 외부 페이지를 새창으로 열기
  function open(url: string): void {
    window.open(url, "_blank")
  }

  // 페이지 뒤로가기
  function back(): void {
    router.back()
  }

  // 디바운스 함수
  function debounce<T extends (...args: any[]) => any>(func: T, delay: number = 300) {
    let timeout: any = null
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      const context = this as ThisParameterType<T>
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, delay)
    }
  }

  // 밀리세컨드 숫자를 날짜 형식으로 보여주기
  function date(milliseconds: number, showYmd: boolean = true, showHms: boolean = false): string {
    const time = new Date(milliseconds)
    let result = ""
    if (showYmd) {
      const year = time.getFullYear().toString().slice(2)
      const month = String(time.getMonth() + 1).padStart(2, "0")
      const day = String(time.getDate()).padStart(2, "0")
      result = `${year}/${month}/${day}`
    }
    if (showHms) {
      const hour = String(time.getHours()).padStart(2, "0")
      const minute = String(time.getMinutes()).padStart(2, "0")
      const second = String(time.getSeconds()).padStart(2, "0")
      result += ` ${hour}:${minute}:${second}`
    }
    return result
  }

  // HTML unescape HTML 처리 (<--> Bun.escapeHTML)
  function unescape(text: string): string {
    let result = text.replaceAll("&quot;", '"')
    result = result.replaceAll("&amp;", "&")
    result = result.replaceAll("&#x27;", "'")
    result = result.replaceAll("&lt;", "<")
    result = result.replaceAll("&gt;", ">")
    return result
  }

  // 큰 숫자는 K, M 단위를 뒤에 붙여서 표현
  function num(big: number): string {
    if (big > 999999) {
      return (big / 1000000).toFixed(1) + "M"
    } else if (big > 999) {
      return (big / 1000).toFixed(1) + "K"
    } else {
      return big.toString()
    }
  }

  // 선택된 파일들의 배열 반환
  function attachments(event: MouseEvent): File[] {
    let result: File[] = []
    const targets = (event?.target as HTMLInputElement).files
    if (targets) {
      const arr = Array.from(targets)
      for (const f of arr) {
        result.push(f)
      }
    }
    return result
  }

  // 게시글을 이미 읽었는지 확인하기
  function isAlreadyRead(postUid: number): boolean {
    const readPosts = window.localStorage.getItem(READ_POST_KEY)
    if (readPosts) {
      const postUids = JSON.parse(readPosts) as number[]
      return postUids.includes(postUid)
    }
    return false
  }

  // 게시글 읽음으로 체크하기
  function markAsRead(postUid: number): void {
    const readPosts = window.localStorage.getItem(READ_POST_KEY)
    let postUids: number[] = []
    if (readPosts) {
      postUids = JSON.parse(readPosts) as number[]
    }
    postUids.push(postUid)
    window.localStorage.setItem(READ_POST_KEY, JSON.stringify(postUids))
  }

  // 게시판 형태에 따른 라우터 이름 반환
  function routerName(type: BoardType, action: "list" | "view" = "list"): string {
    switch (type) {
      case BOARD_TYPE.GALLERY:
        if (action === "list") return "galleryList"
        else return "galleryOpen"
      case BOARD_TYPE.BLOG:
        if (action === "list") return "blogList"
        else return "blogView"
      case BOARD_TYPE.SHOP:
        if (action === "list") return "shopList"
        else return "shopView"
      default:
        if (action === "list") return "boardList"
        else return "boardView"
    }
  }

  return {
    snackbar,
    snackbarTimeout,
    snackbarText,
    alertbar,
    alertType,
    alertText,
    alertTimeout,
    filters,
    snack,
    success,
    error,
    info,
    go,
    open,
    back,
    debounce,
    date,
    unescape,
    num,
    attachments,
    isAlreadyRead,
    markAsRead,
    routerName,
  }
})
