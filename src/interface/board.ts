/**
 * interface/board/index.ts
 *
 * 게시판에서 사용되는 각종 인터페이스 모음
 */

export const BOARD_TYPE = {
  BOARD: 0,
  GALLERY: 1,
  BLOG: 2,
  SHOP: 3,
}

export const CONTENT_STATUS = {
  REMOVED: -1,
  NORMAL: 0,
  NOTICE: 1,
}

export type Pair = {
  uid: number
  name: string
}

export type Writer = Pair & {
  profile: string
}

export type BoardAccessPoint = {
  view: number
  write: number
  comment: number
  download: number
}

export type BoardAccessLevel = BoardAccessPoint & {
  list: number
}

export type BoardConfig = {
  uid: number
  admin: {
    group: number
    board: number
  }
  type: 0 | 1 | 2 | 3 /* BOARD_TYPE */
  name: string
  info: string
  row: number
  width: number
  useCategory: boolean
  category: Pair[]
  level: BoardAccessLevel
  point: BoardAccessPoint
}

type ContentCommon = {
  uid: number
  writer: Writer
  content: string
  like: number
  liked: boolean
  submitted: number
  modified: number
  status: -1 | 0 | 1 /* CONTENT_STATUS */
}

export type Post = ContentCommon & {
  category: Pair
  reply: number
  title: string
  hit: number
}

export type Comment = ContentCommon & {
  replyTarget: number
  postUid: number
}

export type VideoURL = {
  src: string
  width: number
  height: number
}

export type TableOption = {
  rows: number
  cols: number
  withHeaderRow: boolean
}
