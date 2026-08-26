import { z } from 'zod'

export const loginFormSchema = z.object({
    email: z.email("Insira um email válido."),
    password: z.string().trim().min(1)
})

export type LoginFormData = z.infer<typeof loginFormSchema>
