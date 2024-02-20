/**
 * server/database/board/common
 *
 * 게시판 관련 함수들 중 공용으로 사용하는 함수들 모음
 */

import {
  CheckUserPermissionParams,
  SUPER_ADMIN,
  UpdateUserPointParams,
} from "../../../src/interface/board"
import { insert, select, table, update } from "../common"
import { AddNoticeParams } from "./const"

// 알림 정보 추가하기
export async function addNotice(param: AddNoticeParams): Promise<void> {
  const [exist] = await select(
    `SELECT uid FROM ${table}notice WHERE 
    to_uid = ? AND from_uid = ? AND type = ? AND post_uid = ? AND comment_uid = ? LIMIT 1`,
    [param.toUid, param.fromUid, param.type, param.postUid, param.commentUid],
  )
  if (exist) {
    return
  }

  insert(
    `INSERT INTO ${table}notice (to_uid, from_uid, type, post_uid, comment_uid, checked, timestamp) 
  VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [param.toUid, param.fromUid, param.type, param.postUid, param.commentUid, 0, Date.now()],
  )
}

// 사용자의 권한 확인하기 (권한 소유: 작성자, 게시판 관리자, 그룹 관리자, 최고 관리자)
export async function checkUserPermission(param: CheckUserPermissionParams): Promise<boolean> {
  if (param.userUid === SUPER_ADMIN) {
    return true
  }

  const [target] = await select(
    `SELECT user_uid FROM ${table}${param.targetTable} 
  WHERE uid = ? LIMIT 1`,
    [param.targetUid],
  )
  if (target && param.userUid === target.user_uid) {
    return true
  }

  const [board] = await select(
    `SELECT group_uid, admin_uid FROM ${table}board WHERE uid = ? LIMIT 1`,
    [param.boardUid],
  )
  if (board && param.userUid === board.admin_uid) {
    return true
  }

  const [group] = await select(`SELECT admin_uid FROM ${table}group WHERE uid = ? LIMIT 1`, [
    board.group_uid,
  ])
  if (group && param.userUid === group.admin_uid) {
    return true
  }
  return false
}

// 포인트 업데이트하기, 포인트 부족 시 false
export async function updateUserPoint(param: UpdateUserPointParams): Promise<boolean> {
  const [board] = await select(
    `SELECT point_${param.action} AS point FROM ${table}board WHERE uid = ? LIMIT 1`,
    [param.boardUid],
  )
  if (!board) {
    return false
  }

  const [user] = await select(`SELECT point FROM ${table}user WHERE uid = ? LIMIT 1`, [
    param.userUid,
  ])
  if (!user) {
    return false
  }

  if (board.point < 0 && user.point < Math.abs(board.point)) {
    return false
  }

  const newPoint = user.point + board.point
  update(`UPDATE ${table}user SET point = ? WHERE uid = ? LIMIT 1`, [newPoint, param.userUid])

  return true
}
