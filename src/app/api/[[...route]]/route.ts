import {Hono} from 'hono'
import {handle} from 'hono/vercel'

import auth from '@/features/auth/server/route'
const app = new Hono().basePath("/api");

const routes = app
    .route("/auth", auth)


// ⚠️ 모든 HTTP 메서드 내보내기 (POST 요청 처리용)
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)

// 🔥 RPC 타입 - 클라이언트에서 타입 안전하게 API 호출 가능
export type AppType = typeof routes






