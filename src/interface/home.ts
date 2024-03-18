/**
 * interface/home
 *
 * 홈 화면에서 필요한 인터페이스들 정의
 */

import { NoticeType } from "../../server/database/board/const"
import { UserBasicInfo } from "./user"

export type Notification = {
  uid: number
  fromUser: UserBasicInfo
  type: NoticeType
  id: string
  postUid: number
  checked: boolean
  timestamp: number
}

export type BoardItem = {
  id: string
  name: string
  info: string
}

export type GroupItem = {
  group: string
  boards: BoardItem[]
}
