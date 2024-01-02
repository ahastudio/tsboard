/**
 * server/routers/auth.ts
 *
 * 사용자 로그인 및 인증 관련 처리
 */
import { Elysia } from "elysia"
import { signIn } from "./auth/signin"
import { signUp } from "./auth/signup"
import { logout } from "./auth/logout"
import { resetPassword } from "./auth/resetpassword"

export const auth = new Elysia().group("/auth", (app) => {
  return app.use(signIn).use(signUp).use(logout).use(resetPassword)
})
