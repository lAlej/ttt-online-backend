import { createContext } from "./server/context";
import { usersRouter } from "./server/routers/usersRouter";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

export const expressMiddleware = createExpressMiddleware({
  router: usersRouter,
  createContext,
});
