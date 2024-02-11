/**
 * server/routers/auth/resetpassword
 *
 * 비밀번호 초기화 처리
 */

import { Elysia, t } from "elysia"
import {
  isValidEmail,
  askResetPassword,
  sendResetPassword,
  changePassword,
} from "../../database/auth/resetpassword"

export const resetPassword = new Elysia()
  .post(
    "/resetpassword",
    async ({ body: { email } }) => {
      if ((await isValidEmail(email)) === false) {
        return {
          success: false,
          error: `Invalid email address.`,
        }
      }
      if (process.env.GMAIL_OAUTH_USER === "") {
        await askResetPassword(email)
        return {
          success: true,
          sendmail: false,
        }
      }
      await sendResetPassword(email)
      return {
        success: true,
        sendmail: true,
      }
    },
    {
      body: t.Object({
        email: t.String(),
      }),
    },
  )
  .post(
    "/changepassword",
    async ({ body: { target, code, password } }) => {
      if (target < 1 || code.length !== 6 || password.length !== 64) {
        return {
          success: false,
          error: `Invalid parameters.`,
        }
      }
      const result = await changePassword({
        target,
        code,
        password,
      })
      if (result === false) {
        return {
          success: false,
          error: `Unable to change password.`,
        }
      }
      return {
        success: true,
      }
    },
    {
      body: t.Object({
        target: t.Number(),
        code: t.String(),
        password: t.String(),
      }),
    },
  )
