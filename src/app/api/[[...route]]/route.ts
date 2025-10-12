import {Hono} from 'hono'
import {handle} from 'hono/vercel'

import auth from '@/features/auth/server/route'
import workspaces from '@/features/workspaces/server/route'

const app = new Hono().basePath("/api");

const routes = app
    .route("/auth", auth)
    .route("/workspaces", workspaces)



// ⚠️ 모든 HTTP 메서드 내보내기 (POST 요청 처리용)
export const GET = handle(routes)
export const POST = handle(routes)
export const PATCH = handle(routes)
export const DELETE = handle(routes)  // ✅ DELETE 메서드 추가

// 🔥 RPC 타입 - 클라이언트에서 타입 안전하게 API 호출 가능
export type AppType = typeof routes






