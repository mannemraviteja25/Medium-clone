import z from "zod";

export const signupInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    name: z.string()
})
export const signinInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
})
export const createBlog = z.object({
  title: z.string(),
  content: z.string(),
})
export const updateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number(),
  })

export type signupInput = z.infer<typeof signupInput>
export type signinInput = z.infer<typeof signinInput>
export type createBlog = z.infer<typeof createBlog>
export type updateBlogInput = z.infer<typeof updateBlogInput>