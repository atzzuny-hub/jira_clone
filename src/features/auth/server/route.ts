import { Hono } from 'hono';
import {zValidator} from '@hono/zod-validator'
import { loginSchema } from '../schemas';

const app = new Hono()

    // 로그인 API
    .post("/login", zValidator("json", loginSchema),
    async (c) => {

        // 실제로 매개변수를 얻는 방법(좀더 확실하게???)
        const {email, password} = c.req.valid("json");
        console.log({email, password});

        
        // return c.json({success : 'ok'}) 
        return c.json({email, password})
    })

export default app;