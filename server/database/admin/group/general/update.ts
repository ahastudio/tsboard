/**
 * server/database/admin/group/general/update
 *
 * 그룹 관리에 필요한 함수들
 */

import { unlinkSync } from "node:fs"
import { table, update, select, remove } from "../../../common"

// 그룹 관리자 변경하기
export async function changeGroupAdmin(groupUid: number, userUid: number): Promise<boolean> {
  const [user] = await select(`SELECT blocked FROM ${table}user WHERE uid = ? LIMIT 1`, [userUid])
  if (!user) {
    return false
  }
  if ((user.blocked as number) !== 0) {
    return false
  }
  await update(`UPDATE ${table}group SET admin_uid = ? WHERE uid = ? LIMIT 1`, [userUid, groupUid])
  return true
}

// 주어진 게시글 번호에 속한 댓글들 삭제하기
async function removeComments(postUid: number): Promise<void> {
  const comments = await select(`SELECT uid FROM ${table}comment WHERE post_uid = ?`, [postUid])
  for (const comment of comments) {
    await remove(`DELETE FROM ${table}comment_like WHERE comment_uid = ?`, [comment.uid])
  }
  await remove(`DELETE FROM ${table}comment WHERE post_uid = ?`, [postUid])
}

// 주어진 게시글 번호에 속한 파일들 삭제하기
async function removeFiles(postUid: number): Promise<void> {
  const files = await select(`SELECT path FROM ${table}file WHERE post_uid = ?`, [postUid])
  for (const file of files) {
    const path = `.${file.path}`
    const filepath = Bun.file(path)
    if ((await filepath.exists()) === true) {
      unlinkSync(path)
    }
  }
  await remove(`DELETE FROM ${table}file WHERE post_uid = ?`, [postUid])
}

// 특정 게시판 삭제하기
export async function removeBoard(boardUid: number): Promise<boolean> {
  const [board] = await select(`SELECT id FROM ${table}board WHERE uid = ? LIMIT 1`, [boardUid])
  if (!board) {
    return false
  }

  const posts = await select(`SELECT uid FROM ${table}post WHERE board_uid = ?`, [boardUid])

  for (const post of posts) {
    await removeComments(post.uid)
    await remove(`DELETE FROM ${table}post_hashtag WHERE post_uid = ?`, [post.uid])
    await remove(`DELETE FROM ${table}post_like WHERE post_uid = ?`, [post.uid])
    await removeFiles(post.uid)
  }

  await remove(`DELETE FROM ${table}board_category WHERE board_uid = ?`, [boardUid])
  await remove(`DELETE FROM ${table}post WHERE board_uid = ?`, [boardUid])
  await remove(`DELETE FROM ${table}board WHERE uid = ? LIMIT 1`, [boardUid])

  return true
}