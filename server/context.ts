import { prisma } from "./prismaConfig";

export const createContext = ({ req, res }: any) => {
  return {
    req,
    res,
    prisma,
  };
};
type Context = ReturnType<typeof createContext>;
