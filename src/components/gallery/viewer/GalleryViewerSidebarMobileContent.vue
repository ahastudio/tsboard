<template>
  <v-list :bg-color="viewer.mobileColor">
    <gallery-viewer-sidebar-content></gallery-viewer-sidebar-content>
    <gallery-viewer-sidebar-tag></gallery-viewer-sidebar-tag>
    <v-divider></v-divider>

    <gallery-viewer-sidebar-date-writer></gallery-viewer-sidebar-date-writer>
    <gallery-viewer-sidebar-comment></gallery-viewer-sidebar-comment>
    <board-view-comment-write-button></board-view-comment-write-button>
  </v-list>
</template>

<script setup lang="ts">
import { useViewerStore } from "../../../store/board/gallery/viewer"
import GalleryViewerSidebarTag from "./sidebar/GalleryViewerSidebarTag.vue"
import GalleryViewerSidebarDateWriter from "./sidebar/GalleryViewerSidebarDateWriter.vue"
import GalleryViewerSidebarComment from "./sidebar/GalleryViewerSidebarComment.vue"
import BoardViewCommentWriteButton from "../../board/comment/BoardViewCommentWriteButton.vue"
import GalleryViewerSidebarContent from "./sidebar/GalleryViewerSidebarContent.vue"

const viewer = useViewerStore()
</script>
