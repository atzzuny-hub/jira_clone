import z from "zod";

export const loginSchema = z.object({
    email: z.email("유효한 이메일을 입력해주세요"),
    password: z.string().min(8, '비밀번호는 8자리 이상 입력해주세요.'),
})

export const registerSchema = z.object({
    name: z.string().min(1, '이름을 입력해주세요'),
    email: z.email("유효한 이메일을 입력해주세요"),
    password: z.string().min(8, '비밀번호는 8자리 이상 입력해주세요.'),
})