<template>
  <v-card elevation="0" rounded="0">
    <v-list>
      <v-list-item class="mb-2">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="general.board.id"
              variant="outlined"
              density="compact"
              readonly
              hide-details
              prepend-inner-icon="mdi-identifier"
              append-icon="mdi-link-variant"
              @click:append="util.go(util.routerName(general.board.type), general.board.id)"
            >
            </v-text-field>
          </v-col>
          <v-col class="mt-2"> 게시판 아이디는 생성 후 변경이 불가능 합니다. </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="general.boardGroupName"
              readonly
              variant="outlined"
              density="compact"
              hide-details
              append-inner-icon="mdi-chevron-down"
            >
              <v-menu activator="parent" open-on-hover>
                <v-list>
                  <v-list-item
                    v-for="(group, index) in general.board.groups"
                    :key="index"
                    @click="general.changeGroup(group)"
                  >
                    {{ group.name }}
                    <v-tooltip activator="parent">
                      {{ group.name }} 그룹 소속으로 변경합니다.
                    </v-tooltip>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-text-field>
          </v-col>
          <v-col class="mt-2">
            게시판은 하나의 그룹에만 소속됩니다. 그룹 관리자도 이 게시판의 관리자입니다.
          </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="general.board.name"
              variant="outlined"
              density="compact"
              hide-details
              append-inner-icon="mdi-content-save"
              @click:append-inner="general.updateName"
            >
              <v-tooltip activator="parent">
                이름 작성 후 우측의 <v-icon>mdi-content-save</v-icon> 아이콘을 클릭하시면
                저장됩니다.
              </v-tooltip>
            </v-text-field>
          </v-col>
          <v-col class="mt-2">
            게시판 이름입니다. 이 게시판을 대표할만한 이름으로 작성해 보세요.
          </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="general.board.info"
              variant="outlined"
              density="compact"
              hide-details
              append-inner-icon="mdi-content-save"
              @click:append-inner="general.updateInfo"
            >
              <v-tooltip activator="parent">
                설명 작성 후 우측의 <v-icon>mdi-content-save</v-icon> 아이콘을 클릭하시면
                저장됩니다.
              </v-tooltip>
            </v-text-field>
          </v-col>
          <v-col class="mt-2"> 게시판 설명을 작성해 보세요. </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <v-row>
          <v-col cols="4">
            <v-btn-toggle v-model="general.board.type" mandatory>
              <v-btn
                :value="BOARD_TYPE.BOARD"
                prepend-icon="mdi-table-large"
                @click="general.changeType"
                color="primary"
                >게시판
                <v-tooltip activator="parent">일반적인 게시판 형식으로 사용합니다.</v-tooltip>
              </v-btn>
              <v-btn
                :value="BOARD_TYPE.GALLERY"
                prepend-icon="mdi-view-gallery-outline"
                @click="general.changeType"
                color="primary"
                >갤러리
                <v-tooltip activator="parent"
                  >업로드 된 사진들이 미리 보여지고, 별도의 이미지 뷰어를 사용하는 갤러리 형식으로
                  사용합니다.</v-tooltip
                >
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col class="mt-2">
            게시판 형태를 일반적인 게시판 형식 혹은 갤러리 형식으로 지정할 수 있습니다.</v-col
          >
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="general.boardRows"
              variant="outlined"
              density="compact"
              hide-details
              append-inner-icon="mdi-content-save"
              @click:append-inner="general.updateRows"
            >
              <v-tooltip activator="parent">
                게시글 숫자 입력 후 우측의 <v-icon>mdi-content-save</v-icon> 아이콘을 클릭하시면
                저장됩니다.
              </v-tooltip>
            </v-text-field>
          </v-col>
          <v-col class="mt-2">
            한 페이지에 몇 개의 게시글을 보여줄지 지정합니다. 공지글을 포함한 갯수입니다.
          </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-2">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="general.boardWidth"
              variant="outlined"
              density="compact"
              hide-details
              append-inner-icon="mdi-content-save"
              @click:append-inner="general.updateWidth"
            >
              <v-tooltip activator="parent">
                게시판의 최대 너비를 입력하고 우측의
                <v-icon>mdi-content-save</v-icon> 아이콘을 클릭하시면 저장됩니다.
              </v-tooltip>
            </v-text-field>
          </v-col>
          <v-col class="mt-2"> 게시판의 최대 너비를 지정합니다. </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="mt-2 mb-1">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="general.boardAddCategory"
              variant="outlined"
              density="compact"
              append-inner-icon="mdi-tag-plus"
              @click:append-inner="general.addCategory"
              hide-details
            >
              <v-menu activator="parent" open-on-hover>
                <v-list>
                  <v-list-item
                    v-for="(category, index) in general.board.categories"
                    :key="index"
                    @click=""
                  >
                    <v-list-item-title>
                      {{ category.name }}
                    </v-list-item-title>
                    <template v-slot:append>
                      <v-btn
                        icon
                        elevation="0"
                        @click="general.confirmRemoveCategory(category.uid, category.name)"
                      >
                        <v-icon>mdi-trash-can</v-icon>
                        <v-tooltip activator="parent">
                          이 카테고리를 삭제하고 기본 카테고리와 병합합니다. (글은 삭제되지
                          않습니다)
                        </v-tooltip>
                      </v-btn>
                    </template>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-tooltip activator="parent" location="top">
                기본 카테고리는 삭제가 불가능하며, 비활성화를 위해선 체크박스 해제가 필요합니다.
              </v-tooltip>
            </v-text-field>
          </v-col>
          <v-col>
            <v-checkbox
              v-model="general.boardUseCategory"
              label="카테고리 사용하기"
              @click="general.useCategory"
              class="pa-0 checkbox"
              hide-details
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useAdminStore } from "../../../store/admin/common"
import { useAuthStore } from "../../../store/user/auth"
import { useUtilStore } from "../../../store/util"
import { useAdminBoardGeneralStore } from "../../../store/admin/board/general"
import { BOARD_TYPE } from "../../../../server/database/board/const"

const admin = useAdminStore()
const util = useUtilStore()
const auth = useAuthStore()
const general = useAdminBoardGeneralStore()

onMounted(() => {
  if (auth.user.uid !== 1) {
    admin.error(`그룹 관리자 이상만 사용 가능합니다.`, 10_000)
    return
  }
  general.loadGeneralConfig()
})
</script>

<style scoped>
.checkbox {
  margin-top: -8px;
}
</style>
