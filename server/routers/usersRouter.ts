import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import bcrypt from "bcrypt";

export const usersRouter = router({
  loginUser: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }: any) => {
      const user = await ctx.prisma.user.findFirst({
        where: { username: input.username },
        select: { id: true, username: true, password: true },
      });

      if (!user) {
        return { typeError: "username-not-found" };
      }

      const validPassword = await bcrypt.compare(input.password, user.password);

      if (!validPassword) {
        return { typeError: "invalid-password" };
      }

      return { sucess: "success", user: user.username };
    }),
  registerUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const alreadyExists = await ctx.prisma.user.findFirst({
        where: { username: input.username },
      });
      const uniqueEmail = await ctx.prisma.user.findFirst({
        where: { email: input.email },
      });

      if (alreadyExists) {
        return { typeError: "user-exists" };
      }

      if (uniqueEmail) {
        return { typeError: "email-exists" };
      }

      let userData = input;
      const hashedPassword = await bcrypt.hash(input.password, 10);

      userData.password = hashedPassword;

      const newUser = await ctx.prisma.user.create({
        data: userData,
      });

      return { sucess: "success", user: newUser.username };
    }),
});
