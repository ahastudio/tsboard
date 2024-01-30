/**
 * server/routers/admin/group/general/load
 *
 * 특정 그룹에 대한 관리화면 불러오기 처리
 */

import { Elysia, t } from "elysia"
import { jwt } from "@elysiajs/jwt"
import { fail, success, updateAccessToken } from "../../../../util/tools"
import {
  getGroupBoards,
  getGroupConfig,
  getGroupAdminCandidates,
  getExistBoardIds,
} from "../../../../database/admin/group/general/load"

const defaultTypeCheck = {
  headers: t.Object({
    authorization: t.String(),
  }),
  cookie: t.Cookie({
    refresh: t.String(),
  }),
}

export const load = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_KEY!,
    }),
  )
  .get(
    "/load",
    async ({ jwt, cookie: { refresh }, headers, query: { id } }) => {
      const config = await getGroupConfig(id)
      if (config.uid < 1) {
        return fail(`Invalid group ID.`)
      }
      const boards = await getGroupBoards(config.uid)

      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      return success({
        newAccessToken,
        config,
        boards,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        id: t.String(),
      }),
    },
  )
  .get(
    "/candidates",
    async ({ jwt, cookie: { refresh }, headers, query: { name, limit } }) => {
      if (name.length < 2) {
        return fail(`name is too short.`)
      }
      if (limit < 1) {
        return fail(`Invalid a limit.`)
      }
      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      const candidates = await getGroupAdminCandidates(name, limit)

      return success({
        candidates,
        newAccessToken,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        name: t.String(),
        limit: t.Numeric(),
      }),
    },
  )
  .get(
    "/boardids",
    async ({ jwt, cookie: { refresh }, headers, query: { id, limit } }) => {
      if (id.length < 2) {
        return fail(`ID is too short.`)
      }
      const newAccessToken = await updateAccessToken(jwt, headers.authorization, refresh.value)
      const ids = await getExistBoardIds(id, limit)

      return success({
        newAccessToken,
        ids,
      })
    },
    {
      ...defaultTypeCheck,
      query: t.Object({
        id: t.String(),
        limit: t.Numeric(),
      }),
    },
  )