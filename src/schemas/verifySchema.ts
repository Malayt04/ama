import {z} from "zod"

export const verifySchema = z.object({
    code: z.string().length(6, "Verification code be must of 6 digits")
})