<template>
  <v-row no-gutters>
    <v-col class="pa-1">
      <v-card class="mt-3 mb-3">
        <v-card-title class="title"
          >최신 글
          <div class="more">
            <v-btn
              prepend-icon="mdi-magnify"
              rounded="xl"
              elevation="0"
              @click="util.go('adminLatestPost')"
              >더 보기
              <v-tooltip activator="parent"
                >클릭하시면 최신 글들을 모아 둔 관리 화면으로 이동합니다.</v-tooltip
              >
            </v-btn>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-list density="compact">
          <v-list-item
            v-for="(post, index) in dashboard.posts"
            :key="index"
            @click="util.go(util.routerName(post.type as BoardType, 'view'), post.id, post.uid)"
            :prepend-avatar="
              post.writer.profile.length < 1
                ? `${TSBOARD.PREFIX}/no-profile.svg`
                : post.writer.profile
            "
          >
            <v-list-item-title>{{ post.content }}</v-list-item-title>
            <v-tooltip activator="parent">게시글을 확인하러 갑니다.</v-tooltip>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 mb-3">
        <v-card-title class="title"
          >최신 댓글
          <div class="more">
            <v-btn
              prepend-icon="mdi-magnify"
              rounded="xl"
              elevation="0"
              @click="util.go('adminLatestComment')"
              >더 보기</v-btn
            >
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-list density="compact">
          <v-list-item
            v-for="(comment, index) in dashboard.comments"
            :key="index"
            @click="
              util.go(util.routerName(comment.type as BoardType, 'view'), comment.id, comment.uid)
            "
            :prepend-avatar="
              comment.writer.profile.length < 1
                ? `${TSBOARD.PREFIX}/no-profile.svg`
                : comment.writer.profile
            "
          >
            <v-list-item-title>{{ comment.content }}</v-list-item-title>
            <v-tooltip activator="parent">댓글을 확인하러 갑니다.</v-tooltip>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col class="pa-1">
      <v-card class="mt-3 mb-3">
        <v-card-title class="title"
          >최근 신고
          <div class="more">
            <v-btn
              prepend-icon="mdi-magnify"
              rounded="xl"
              elevation="0"
              @click="util.go('adminReport')"
              >더 보기</v-btn
            >
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-list density="compact">
          <v-list-item
            v-for="(report, index) in dashboard.reports"
            :key="index"
            @click="util.go('adminReportView', '', report.uid)"
            :prepend-avatar="
              report.writer.profile.length < 1
                ? `${TSBOARD.PREFIX}/no-profile.svg`
                : report.writer.profile
            "
          >
            <v-list-item-title>{{ report.content }}</v-list-item-title>
            <v-tooltip activator="parent">신고 내역을 확인하러 갑니다.</v-tooltip>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useAdminDashboardStore } from "../../../store/admin/dashboard/general"
import { useUtilStore } from "../../../store/util"
import { TSBOARD } from "../../../../tsboard.config"
import { BoardType } from "../../../interface/board"

const dashboard = useAdminDashboardStore()
const util = useUtilStore()
</script>

<style scoped>
.more {
  position: absolute;
  top: 6px;
  right: 5px;
}

.title {
  border-top: #607d8b 2px solid;
}
</style>
