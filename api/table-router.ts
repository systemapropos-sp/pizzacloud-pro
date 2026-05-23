import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { TABLES } from "./mock-data";

export const tableRouter = createRouter({
  list: publicQuery.query(async () => {
    return [...TABLES];
  }),
  updateStatus: publicQuery
    .input(z.object({ id: z.number(), status: z.enum(["available", "occupied", "reserved", "cleaning"]) }))
    .mutation(async ({ input }) => {
      const table = TABLES.find(t => t.id === input.id);
      if (table) table.status = input.status;
      return { success: true };
    }),
});
