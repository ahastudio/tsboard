/**
 * store/admin/board/general
 *
 * 게시판 관리자 페이지에서 일반 부분에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import { AdminBoardConfig, AdminPairItem } from "../../../interface/admin"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../auth"
import { GENERAL } from "../../../messages/store/admin/board/general"

export const useAdminBoardGeneralStore = defineStore("adminBoardGeneral", () => {
  const route = useRoute()
  const server = edenTreaty<App>(process.env.API!)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const confirmRemoveCategoryDialog = ref<boolean>(false)
  const board = ref<AdminBoardConfig>({
    uid: 1,
    id: "",
    type: "board",
    group: "default",
    name: "",
    info: GENERAL.UNKNOWN_INFO,
    row: 0,
    width: 0,
    category: [{ uid: 1, name: "기본" }],
  })
  const boardAddCategory = ref<string>("")
  const boardRemoveCategory = ref<AdminPairItem>({ uid: 0, name: "" })
  const groups = ref<AdminPairItem[]>([{ uid: 1, name: "unknown" }])

  // 게시판 일반 설정 불러오기
  async function loadGeneralConfig(): Promise<void> {
    const response = await server.api.admin.board.general.load.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: route.params.id as string,
      },
    })
    if (response.data === null) {
      admin.error(GENERAL.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${GENERAL.UNABLE_LOAD_CONFIG} (${response.data.error})`)
      return
    }
    if (response.data.result.config.uid < 1) {
      admin.error(GENERAL.UNKNOWN_INFO)
      return
    }
    if (response.data.result.updateAccessToken !== "") {
      auth.updateUserToken(response.data.result.updateAccessToken!)
    }
    board.value = response.data.result.config

    admin.success(GENERAL.LOADED_CONFIG)
  }

  // 그룹 변경하기
  async function changeGroup(group: AdminPairItem): Promise<void> {
    // do something with board.value.uid
    board.value.group = group.name
    admin.success(
      `${board.value.id} ${GENERAL.CHANGED_GROUP1} ${group.name} ${GENERAL.CHANGED_GROUP2}`,
    )
  }

  // 카테고리 추가하기
  async function addCategory(): Promise<void> {
    const name = boardAddCategory.value.trim()
    if (name.length < 2) {
      admin.error(GENERAL.TOO_SHORT_CATEGORY)
      return
    }
    // do something with board.value.uid
    board.value.category.push({ uid: 10, name })
    admin.success(`${name} ${GENERAL.ADDED_CATEGORY}`)
  }

  // 카테고리 삭제 전 확인하기
  function confirmRemoveCategory(uid: number, name: string): void {
    if (board.value.category.length < 2) {
      admin.error(GENERAL.REMOVE_LAST_CATEGORY)
      return
    }
    boardRemoveCategory.value.uid = uid
    boardRemoveCategory.value.name = name
    confirmRemoveCategoryDialog.value = true
  }

  // 카테고리 삭제하기
  async function removeCategory(): Promise<void> {
    if (board.value.category.length < 2) {
      admin.error(GENERAL.REMOVE_LAST_CATEGORY)
      return
    }
    // do something with board.value.uid
    board.value.category = board.value.category.filter((cat: AdminPairItem) => {
      return cat.uid !== boardRemoveCategory.value.uid
    })
    admin.success(GENERAL.REMOVED_CATEGORY)
  }

  // 게시판 이름 변경하기
  async function changeName(): Promise<void> {
    const name = board.value.name.trim()
    if (name.length < 2) {
      admin.error(GENERAL.TOO_SHORT_CATEGORY)
      return
    }
    // do something with board.value.uid
    admin.success(`${GENERAL.CHANGED_NAME1} ${name} ${GENERAL.CHANGED_NAME2}`)
  }

  // 게시판 설명 변경하기
  async function changeInfo(): Promise<void> {
    const info = board.value.info.trim()
    if (info.length < 2) {
      admin.error(GENERAL.TOO_SHORT_NAME)
      return
    }
    // do something with board.value.uid
    admin.success(GENERAL.UPDATED_INFO)
  }

  // 게시판 타입 변경하기
  async function changeType(): Promise<void> {
    // do something with board.value.type
    admin.success(`${GENERAL.CHANGED_TYPE1} ${board.value.type} ${GENERAL.CHANGED_TYPE2}`)
  }

  // 한 페이지에 표시할 게시글 개수 변경하기
  async function changeRows(): Promise<void> {
    const rows = board.value.row
    if (rows < 1 || rows > 100) {
      admin.error(GENERAL.ROWS_LIMITATION)
      board.value.row = 20
      return
    }
    // do something with board.value.uid
    admin.success(`${rows} ${GENERAL.UPDATED_ROWS}`)
  }

  // 게시판 최대 너비 지정하기
  async function changeWidth(): Promise<void> {
    const width = board.value.width
    if (width < 300 || width > 3000) {
      admin.error(GENERAL.WIDTH_LIMITATION)
      board.value.width = 1000
      return
    }
    // do something with board.value.width
    admin.success(`${GENERAL.CHANGED_WIDTH1} ${width} ${GENERAL.CHANGED_WIDTH2}`)
  }

  return {
    board,
    boardAddCategory,
    boardRemoveCategory,
    confirmRemoveCategoryDialog,
    groups,
    loadGeneralConfig,
    changeGroup,
    changeName,
    changeInfo,
    changeType,
    changeRows,
    changeWidth,
    addCategory,
    confirmRemoveCategory,
    removeCategory,
  }
})
