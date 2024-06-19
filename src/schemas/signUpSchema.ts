import {z} from 'zod'

export const usernameValidation = z
.string()
.min(2, "Username must be at least 2 characters")
.max(20," Username can be of maximum 20 characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Please enter valid email"}),
    password: z.string().min(8,"Please enter a vaild password")
})