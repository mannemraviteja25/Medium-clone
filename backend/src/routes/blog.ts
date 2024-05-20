import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from "hono/jwt";
import { createBlog, updateBlogInput } from "@ravitejam25/common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
  Variables: {
    userId: string
  }
}>();

blogRouter.use("/*", async (c, next) => {
  const token = c.req.header("authorization") || "";
  try{
    const user = await verify(token, c.env.JWT_SECRET);
  if (user) {
    c.set("userId", user.id);
    await next();
  } else {
    c.json({
      message: "you are not logged in!!"
    })
  }
  }catch(e){
    c.status(403);
    return c.text("you are not logged in!!")
  }});


blogRouter.post('/', async (c) => {
  const body = await c.req.json();
  const {success} = createBlog.safeParse(body)
  if(!success) {
    c.status(400);
    return c.json({
      message: "Invalid input"
    })
  }
  const authorId = c.get("userId")
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: Number(authorId)
    }
  })
  return c.json({ id: blog.id })
})


blogRouter.put('/:id', async (c) => {
  const body = await c.req.json();
  const {success} = updateBlogInput.safeParse(body)
  if(!success) {
    c.status(400);
    return c.json({
      message: "Invalid input"
    })
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const blog = await prisma.blog.update({
    where: {
      id: Number(c.req.param('id'))
    },
    data: {
      title: body.title,
      content: body.content
    }
  })
  return c.json({ id: blog.id })
})

// todo add pagination
blogRouter.get('/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const blogs = await prisma.blog.findMany()

  return c.json({blogs})
})


blogRouter.get('/:id', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(c.req.param('id'))
      }
    })
    return c.json(blog)
  }
  catch (e) {
    c.status(411)
    return c.json({ message: "Error while fetching the blog post" })
  }
})


