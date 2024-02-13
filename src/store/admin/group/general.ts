/**
 * store/admin/group/general
 *
 * 게시판 그룹 관리자 페이지에서 일반 부분에 필요한 상태 및 함수들
 */

import { ref } from "vue"
import { useRoute } from "vue-router"
import { defineStore } from "pinia"
import { edenTreaty } from "@elysiajs/eden"
import type { App } from "../../../../server/index"
import {
  AdminPair,
  AdminGroupList,
  AdminGroupConfig,
  AdminUserInfo,
} from "../../../interface/admin"
import { useAdminStore } from "../common"
import { useAuthStore } from "../../../store/auth"
import { useUtilStore } from "../../util"
import { GENERAL } from "../../../messages/store/admin/group/general"

export const useAdminGroupGeneralStore = defineStore("adminGroupGeneral", () => {
  const route = useRoute()
  const server = edenTreaty<App>(process.env.API!)
  const admin = useAdminStore()
  const auth = useAuthStore()
  const util = useUtilStore()
  const group = ref<AdminGroupConfig>({
    uid: 0,
    id: "",
    count: 0,
    manager: {
      uid: 0,
      name: "",
      profile: "",
    },
  })
  const removeBoardTarget = ref<AdminPair>({
    uid: 0,
    name: "",
  })
  const confirmRemoveBoardDialog = ref<boolean>(false)
  const boards = ref<AdminGroupList[]>([])
  const existBoardIds = ref<AdminPair[]>([])
  const suggestions = ref<AdminUserInfo[]>([])
  const newGroupManager = ref<string>("")
  const newBoardId = ref<string>("")

  // 지정된 그룹의 설정값 불러오기
  async function loadGeneralConfig(): Promise<void> {
    const response = await server.api.admin.group.general.load.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: route.params.id as string,
      },
    })
    if (!response.data) {
      admin.error(GENERAL.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${GENERAL.UNABLE_LOAD_GROUP_INFO} (${response.data.error})`)
      return
    }
    if (!response.data.result) {
      admin.error(GENERAL.UNKNOWN_INFO)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken!)
    group.value = response.data.result.config as AdminGroupConfig
    boards.value = response.data.result.boards as AdminGroupList[]
    admin.success(GENERAL.LOADED_CONFIG)
  }

  // 회원 아이디를 입력할 때마다 하단에 검색해서 보여주기
  async function _updateGroupManagerSuggestion(): Promise<void> {
    if (newGroupManager.value.length < 2) {
      return
    }
    const response = await server.api.admin.group.general.candidates.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        name: newGroupManager.value,
        limit: 5,
      },
    })
    if (!response.data) {
      admin.error(GENERAL.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      return
    }
    if (response.data.result.candidates.length < 1) {
      suggestions.value = [{ uid: 0, name: GENERAL.EMPTY_CANDIDATES, profile: "" }]
      return
    }
    suggestions.value = response.data.result.candidates as AdminUserInfo[]
  }
  const updateGroupManagerSuggestion = util.debounce(_updateGroupManagerSuggestion, 250)

  // 새 게시판 생성을 위해 아이디를 입력할 때 기존 게시판 아이디를 보여주기
  async function _updateExistBoardIds(): Promise<void> {
    if (newBoardId.value.length < 2) {
      return
    }
    const response = await server.api.admin.group.general.boardids.get({
      $headers: {
        authorization: auth.user.token,
      },
      $query: {
        id: newBoardId.value,
        limit: 5,
      },
    })
    if (!response.data) {
      admin.error(GENERAL.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      return
    }
    if (response.data.result.ids.length < 1) {
      existBoardIds.value = [{ uid: 0, name: GENERAL.NO_DUPLICATE_ID }]
      return
    }
    existBoardIds.value = response.data.result.ids as AdminPair[]
  }
  const updateExistBoardIds = util.debounce(_updateExistBoardIds, 250)

  // 새 게시판 생성하기
  async function createNewBoard(): Promise<void> {
    const newId = newBoardId.value.trim()
    if (newId.length < 2) {
      admin.error(GENERAL.TOO_SHORT_BOARD_ID)
      return
    }
    if (/^[a-z0-9_]{2,}$/.test(newId) === false) {
      admin.error(GENERAL.INVALID_BOARD_ID)
      newBoardId.value = ""
      return
    }
    const response = await server.api.admin.group.general.createboard.post({
      $headers: {
        authorization: auth.user.token,
      },
      groupUid: group.value.uid,
      newId,
    })
    if (!response.data) {
      admin.error(GENERAL.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${GENERAL.FAILED_CREATE_BOARD} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken!)

    boards.value.push({
      uid: response.data.result.uid as number,
      id: newId,
      name: response.data.result.name as string,
      info: response.data.result.info as string,
      manager: {
        uid: response.data.result.manager.uid as number,
        name: response.data.result.manager.name as string,
        profile: "",
      },
      total: {
        post: 0,
        comment: 0,
        file: 0,
        image: 0,
      },
    })
    admin.success(`[${newId}] ${GENERAL.ADDED_NEW_BOARD}`)
    newBoardId.value = ""
  }

  // 선택한 회원을 그룹 관리자로 지정하기
  async function updateGroupManager(user: AdminPair): Promise<void> {
    const response = await server.api.admin.group.general.changeadmin.patch({
      $headers: {
        authorization: auth.user.token,
      },
      groupUid: group.value.uid,
      userUid: user.uid,
    })
    if (!response.data) {
      admin.error(GENERAL.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${GENERAL.UNABLE_CHANGE_ADMIN} (${response.data.error})`)
      return
    }
    auth.updateUserToken(response.data.result.newAccessToken!)

    group.value.manager.uid = user.uid
    group.value.manager.name = user.name
    admin.success(`[${user.name}] ${GENERAL.CHANGED_GROUP_ADMIN}`)
  }

  // 게시판을 정말로 삭제할건지 확인하는 창 띄우기
  function confirmRemoveBoard(uid: number, id: string): void {
    removeBoardTarget.value.uid = uid
    removeBoardTarget.value.name = id
    confirmRemoveBoardDialog.value = true
  }

  // 게시판을 삭삭제하지 않고 그대로 닫기
  function closeRemoveBoardDialog(): void {
    removeBoardTarget.value.uid = 0
    removeBoardTarget.value.name = ""
    confirmRemoveBoardDialog.value = false
  }

  // 게시판을 정말로 삭제할 때 처리
  async function removeBoard(): Promise<void> {
    if (removeBoardTarget.value.uid < 1 || removeBoardTarget.value.name.length < 1) {
      admin.error(GENERAL.INVALID_REMOVE_TARGET)
      return
    }

    const response = await server.api.admin.group.general.removeboard.delete({
      $headers: {
        authorization: auth.user.token,
      },
      boardUid: removeBoardTarget.value.uid,
    })
    if (!response.data) {
      admin.error(GENERAL.NO_RESPONSE)
      return
    }
    if (response.data.success === false) {
      admin.error(`${GENERAL.FAILED_REMOVE_BOARD} (${response.data.error})`)
      return
    }

    boards.value = boards.value.filter((board) => {
      return board.uid !== removeBoardTarget.value.uid
    })
    closeRemoveBoardDialog()
    admin.success(GENERAL.status_BOARD)
  }

  return {
    group,
    removeBoardTarget,
    confirmRemoveBoardDialog,
    boards,
    suggestions,
    newGroupManager,
    newBoardId,
    existBoardIds,
    loadGeneralConfig,
    updateGroupManagerSuggestion,
    updateExistBoardIds,
    createNewBoard,
    updateGroupManager,
    confirmRemoveBoard,
    closeRemoveBoardDialog,
    removeBoard,
  }
})
