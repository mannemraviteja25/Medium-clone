import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { signinInput, signupInput } from "@ravitejam25/common";


export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }>()

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const {success} = signupInput.safeParse(body)
    if(!success) {
      c.status(400);
      return c.json({
        message: "Invalid input"
      })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    try {
      const user = await prisma.user.create({
        data: {
          username: body.username,
          password: body.password,
          name: body.name
        }
      })
      const jwt = await sign({
        id: user.id,
      }, c.env.JWT_SECRET)
      return c.text(`Hello ${body.username} welcome to Medium!  Your token is ${jwt}`)
    }
    catch (e) {
      return c.text('User with this username already exists')
    }
  })
  
  userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const {success} = signinInput.safeParse(body)
    if(!success) {
      c.status(400);
      return c.json({
        message: "Invalid input"
      })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: body.username,
          password: body.password,
        }
      })
      if (!user) {
        c.status(403);
        return c.text('User with this username does not exist')
      }
      const jwt = await sign({
        id: user.id,
      }, c.env.JWT_SECRET)
      return c.text(`Hello ${body.username} congratulations you are signed!! your token is ${jwt}`)
    }
    catch (e) {
      return c.text('Incorrect credentials!!')
    }  
  })
  