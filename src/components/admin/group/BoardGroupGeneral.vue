<template>
  <v-card elevation="0">
    <v-list>
      <v-list-item class="mb-2">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="general.newGroupManager"
              variant="outlined"
              density="compact"
              hide-details
              @keyup="general.updateGroupManagerSuggestion"
              append-inner-icon="mdi-chevron-down"
            >
              <v-menu activator="parent" open-on-hover>
                <v-list>
                  <v-list-item
                    v-for="(user, index) in general.suggestions"
                    :key="index"
                    :prepend-avatar="user.profile || `${TSBOARD.PREFIX}/no-profile.svg`"
                    @click="general.updateGroupManager(user)"
                  >
                    {{ user.name }}
                    <v-tooltip activator="parent" location="right">
                      이 회원을 {{ general.group.id }} 그룹의 관리자로 지정합니다.
                    </v-tooltip>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-tooltip activator="parent"
                >회원명으로 검색하시면 되며, 검색하시는 동안 마우스를 계속 올려두세요!</v-tooltip
              >
            </v-text-field>
          </v-col>
          <v-col class="mt-1">
            <v-chip
              color="blue-grey"
              :prepend-avatar="general.group.manager.profile || `${TSBOARD.PREFIX}/no-profile.svg`"
              variant="tonal"
              >{{ general.group.manager.name }}
              <v-tooltip activator="parent"
                >현재 {{ general.group.id }} 그룹 관리자입니다.</v-tooltip
              >
            </v-chip>
          </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="general.newBoardId"
              variant="outlined"
              density="compact"
              hide-details
              append-inner-icon="mdi-plus-circle-outline"
              @keyup="general.updateExistBoardIds"
              @click:append-inner="general.createNewBoard"
            >
              <v-menu activator="parent">
                <v-list>
                  <v-list-item v-for="(board, index) in general.existBoardIds" :key="index">
                    {{ board.name }}
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-tooltip activator="parent"
                >게시판 ID를 입력하시는 동안 마우스를 계속 올려두세요!</v-tooltip
              >
            </v-text-field>
          </v-col>
          <v-col class="mt-2">
            {{ general.group.id }} 그룹에 {{ general.newBoardId }} 게시판을 생성합니다.
          </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-subheader
        >{{ general.group.id }} 그룹 소속 게시판 목록 (총
        {{ general.boards.length }} 개)</v-list-subheader
      >
      <v-list-item v-for="(board, index) in general.boards" :key="index" density="compact">
        <template v-slot:prepend>
          <v-chip
            prepend-icon="mdi-identifier"
            variant="outlined"
            color="blue-grey"
            @click="util.go(util.routerName(board.type), board.id)"
          >
            {{ board.id }}
            <v-tooltip activator="parent"
              >클릭하시면 [{{ board.name }}] 게시판으로 이동합니다.</v-tooltip
            >
          </v-chip>
        </template>

        <v-chip variant="tonal" color="blue-grey" class="ml-2"
          ><strong>{{ board.name }}</strong>
          <v-divider vertical class="ml-2 mr-2"></v-divider>
          {{ board.info }}
          <v-divider vertical class="ml-2 mr-2"></v-divider>
          <strong class="mr-2">{{ board.total.post }}</strong> posts
          <v-divider vertical class="ml-2 mr-2"></v-divider>
          <strong class="mr-2">{{ board.total.comment }}</strong> comments
          <v-divider vertical class="ml-2 mr-2"></v-divider>
          <strong class="mr-2">{{ board.total.file }}</strong> files
          <v-divider vertical class="ml-2 mr-2"></v-divider>
          <strong class="mr-2">{{ board.total.image }}</strong> images
        </v-chip>

        <template v-slot:append>
          <v-btn icon @click="util.go('adminBoardManager', board.id)" elevation="0" class="mt-1"
            ><v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent"> 클릭하시면 게시판 설정을 수정하러 이동합니다 </v-tooltip>
          </v-btn>
          <v-btn
            icon
            @click="general.confirmRemoveBoard(board.uid, board.id)"
            elevation="0"
            class="mt-1"
            ><v-icon>mdi-trash-can</v-icon>
            <v-tooltip activator="parent"> 클릭하시면 이 게시판을 삭제합니다 </v-tooltip>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
  <confirm-remove-board-dialog></confirm-remove-board-dialog>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useAdminStore } from "../../../store/admin/common"
import { useAuthStore } from "../../../store/user/auth"
import { useAdminGroupGeneralStore } from "../../../store/admin/group/general"
import { useUtilStore } from "../../../store/util"
import ConfirmRemoveBoardDialog from "./ConfirmRemoveBoardDialog.vue"
import { TSBOARD } from "../../../../tsboard.config"

const admin = useAdminStore()
const auth = useAuthStore()
const general = useAdminGroupGeneralStore()
const util = useUtilStore()

onMounted(() => {
  if (auth.user.uid !== 1) {
    admin.error(`그룹 관리자 이상만 사용 가능합니다.`, 10_000)
    return
  }
  general.loadGeneralConfig()
})
</script>
