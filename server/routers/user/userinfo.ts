/**
 * server/routers/user/userinfo
 *
 * 회원 기본 정보 열람하기, 비회원도 가능
 */

import { Elysia, t } from "elysia"
import { fail, success } from "../../util/tools"
import { USER_OPEN_INFO } from "../../database/user/const"
import { getUserOpenInfo } from "../../database/user/userinfo"

export const userInfo = new Elysia().get(
  "/loaduserinfo",
  async ({ query: { userUid } }) => {
    let response = USER_OPEN_INFO
    if (userUid < 1) {
      return fail(`Invalid user uid.`, response)
    }
    response = await getUserOpenInfo(userUid)
    return success(response)
  },
  {
    query: t.Object({
      userUid: t.Numeric(),
    }),
  },
)
