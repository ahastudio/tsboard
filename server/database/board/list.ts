/**
 * server/database/board/list
 *
 * 게시판 목록보기에 필요한 함수들
 */

import { RowDataPacket } from "mysql2"
import {
  BoardConfig,
  CONTENT_STATUS,
  Pair,
  Post,
  PostParams,
  PostRelatedParams,
} from "../../../src/interface/board"
import { table, select } from "../common"
import { BOARD_CONFIG, PAGING_DIRECTION, POST_RELATED, PostRelated } from "./const"

// 게시판 기본 설정 가져오기
export async function getBoardConfig(id: string): Promise<BoardConfig> {
  let result: BoardConfig = BOARD_CONFIG
  const [board] = await select(`SELECT uid, group_uid, admin_uid, type, name, 
    info, row, width, use_category, 
  level_list, level_view, level_write, level_comment, level_download, 
  point_view, point_write, point_comment, point_download
  FROM ${table}board WHERE id = '${id}' LIMIT 1`)
  if (!board) {
    return result
  }

  const categories = await select(
    `SELECT uid, name FROM ${table}board_category WHERE board_uid = ?`,
    [board.uid],
  )
  let category: Pair[] = []
  for (const cat of categories) {
    category.push({ uid: cat.uid, name: cat.name })
  }

  const [group] = await select(`SELECT admin_uid FROM ${table}group WHERE uid = ? LIMIT 1`, [
    board.group_uid,
  ])

  result = {
    uid: board.uid,
    admin: {
      group: group.admin_uid,
      board: board.admin_uid,
    },
    type: board.type,
    name: board.name,
    info: board.info,
    row: board.row,
    width: board.width,
    useCategory: board.use_category,
    category,
    level: {
      list: board.level_list,
      view: board.level_view,
      write: board.level_write,
      comment: board.level_comment,
      download: board.level_download,
    },
    point: {
      view: board.point_view,
      write: board.point_write,
      comment: board.point_comment,
      download: board.point_download,
    },
  }

  return result
}

// 유효한 최대 uid 값 반환하기
export async function getMaxPostUid(boardUid: number): Promise<number> {
  const [post] = await select(
    `SELECT MAX(uid) AS max_uid FROM ${table}post WHERE board_uid = ? AND status != ?`,
    [boardUid, CONTENT_STATUS.REMOVED],
  )
  if (!post) {
    return 0
  }
  return post.max_uid
}

// 총 게시글 개수 반환하기
export async function getTotalPostCount(boardUid: number): Promise<number> {
  const [total] = await select(
    `SELECT COUNT(*) AS count FROM ${table}post WHERE board_uid = ? AND status != ?`,
    [boardUid, CONTENT_STATUS.REMOVED],
  )
  if (!total) {
    return 0
  }
  return total.count
}

// 게시글에 연관된 정보 가져오기
export async function getPostRelated(param: PostRelatedParams): Promise<PostRelated> {
  let result: PostRelated = POST_RELATED
  const [user] = await select(
    `SELECT name, profile, signature FROM ${table}user WHERE uid = ? LIMIT 1`,
    [param.user.writerUid],
  )
  if (!user) {
    return result
  }
  result.writer = {
    uid: param.user.writerUid,
    name: user.name,
    profile: user.profile,
    signature: user.signature,
  }

  const [like] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}post_like WHERE post_uid = ? AND liked = ?`,
    [param.uid, 1],
  )
  if (like) {
    result.like = like.total_count
  }

  const [isLiked] = await select(
    `SELECT liked FROM ${table}post_like WHERE post_uid = ? AND user_uid = ? AND liked = ? LIMIT 1`,
    [param.uid, param.user.viewerUid, 1],
  )
  if (isLiked) {
    result.liked = true
  } else {
    result.liked = false
  }

  const [category] = await select(
    `SELECT uid, name FROM ${table}board_category WHERE uid = ? LIMIT 1`,
    [param.categoryUid],
  )
  if (category) {
    result.category = {
      uid: category.uid,
      name: category.name,
    }
  }

  const [reply] = await select(
    `SELECT COUNT(*) AS total_count FROM ${table}comment WHERE post_uid = ?`,
    [param.uid],
  )
  if (reply) {
    result.reply = reply.total_count
  }
  return result
}

// (검색된) 포스트들 결과로 정리하여 반환하기
async function makePostResult(posts: RowDataPacket[], accessUserUid: number): Promise<Post[]> {
  let result: Post[] = []
  for (const post of posts) {
    const info = await getPostRelated({
      uid: post.uid,
      user: {
        writerUid: post.user_uid,
        viewerUid: accessUserUid,
      },
      categoryUid: post.category_uid,
    })

    result.push({
      uid: post.uid,
      writer: info.writer,
      content: post.content,
      like: info.like,
      liked: info.liked,
      submitted: post.submitted,
      modified: post.modified,
      status: post.status,
      category: info.category,
      reply: info.reply,
      title: post.title,
      hit: post.hit,
    })
  }
  return result
}

// 공지글 가져오기
async function getNotices(boardUid: number, accessUserUid: number): Promise<Post[]> {
  let result: Post[] = []
  const notices = await select(
    `SELECT uid, user_uid, category_uid, title, content, submitted, modified, hit, status 
    FROM ${table}post WHERE board_uid = ? AND status = ?`,
    [boardUid, CONTENT_STATUS.NOTICE],
  )
  result.push(...(await makePostResult(notices, accessUserUid)))
  return result
}

// 글 목록 가져오기
export async function getPosts(param: PostParams): Promise<Post[]> {
  let result: Post[] = []
  const notices = await getNotices(param.boardUid, param.accessUserUid)
  result.push(...notices)

  let direction = ">"
  let ordering = "ASC"
  if (param.pagingDirection === PAGING_DIRECTION.NEXT) {
    direction = "<"
    ordering = "DESC"
  }

  const posts = await select(
    `SELECT uid, user_uid, category_uid, title, content, submitted, modified, hit, status 
    FROM ${table}post WHERE board_uid = ? AND status = ? AND uid ${direction} ? ORDER BY uid ${ordering} LIMIT ?`,
    [param.boardUid, CONTENT_STATUS.NORMAL, param.sinceUid, param.bunch],
  )

  const normals = await makePostResult(posts, param.accessUserUid)
  result.push(...normals)
  return result
}

// 레벨 제한이 있을 시 회원의 레벨 가져오기
export async function getUserLevel(userUid: number): Promise<number> {
  let level = 0
  const [user] = await select(`SELECT level FROM ${table}user WHERE uid = ? LIMIT 1`, [userUid])
  if (user) {
    level = user.level
  }
  return level
}
