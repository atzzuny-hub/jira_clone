import {Hono} from 'hono'
import {handle} from 'hono/vercel'

const app = new Hono().basePath("/api");

// 기본 라우트
app.get('/hello', (c) => {
    return c.json({ hello: "world" })
})

// 동적 라우트
app.get('/project/:projectId', (c) => {
    const projectId = c.req.param('projectId')
    return c.json({ 
        project: projectId,
        message: `프로젝트 ${projectId} 정보`
    })
})

export const GET = handle(app)