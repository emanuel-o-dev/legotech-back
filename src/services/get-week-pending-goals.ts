import dayjs from "dayjs";
import { db } from "../db";
import { orders, users } from "../db/schema";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";

export default async function getWeekPendingGoals() {
  const ordersReq = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      address: users.address,
    })
    .from(users);
  return {
    ordersReq,
  };
}
