/**
 * store/board
 *
 * 게시판 동작과 관련한 상태 및 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../server/index"
import { useAuthStore } from "../user/auth"
import { useUtilStore } from "../util"
import { BoardConfig, Pair, Post } from "../../interface/board"
import { LIST } from "../../messages/store/board/list"
import { TYPE_MATCH, INIT_CONFIG } from "./const"

export const useBoardListStore = defineStore("boardList", () => {
  const server = edenTreaty<App>(process.env.API!)
  const route = useRoute()
  const auth = useAuthStore()
  const util = useUtilStore()
  const id = ref<string>(route.params.id as string)
  const config = ref<BoardConfig>(INIT_CONFIG)
  const posts = ref<Post[]>([])
  const categories = ref<Pair[]>([])
  const page = ref<number>(1)
  const pageLength = ref<number>(1)

  async function loadPostList(): Promise<void> {
    if (id.value.length < 2) {
      util.snack(LIST.NO_BOARD_ID)
      return
    }
    const response = await server.api.board.list.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: id.value,
        page: page.value,
      },
    })
    if (!response.data) {
      util.snack(LIST.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      config.value = JSON.parse(response.data.error) as BoardConfig
      util.snack(`${LIST.FAILED_LOAD_LIST}`)
      return
    }
    if (!response.data.result) {
      util.snack(LIST.FAILED_LOAD_LIST)
      return
    }
    config.value = response.data.result.config as BoardConfig

    if (route.path.includes(TYPE_MATCH[config.value.type].path) === false) {
      util.go(TYPE_MATCH[config.value.type].name)
      return
    }

    posts.value = response.data.result.posts as Post[]
    pageLength.value = Math.ceil((response.data.result.total as number) / config.value.row)
  }

  return {
    id,
    config,
    posts,
    page,
    pageLength,
    categories,
    loadPostList,
  }
})