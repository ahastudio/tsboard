/**
 * interface/gallery/index.ts
 *
 * 갤러리에서 사용되는 각종 인터페이스 모음
 */

export interface Position {
  x: number
  y: number
}

export interface Writer {
  uid: number
  name: string
  profile: string
}

export type GridItem = {
  uid: number
  writer: Writer
  files: string[]
  like: number
  liked: boolean
  reply: number
}

export type Photo = GridItem & {
  title: string
  content: string
  hit: number
  submitted: number
}
