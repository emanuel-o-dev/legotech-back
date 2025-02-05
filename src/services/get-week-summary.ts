import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import dayjs from "dayjs";

export async function getWeekSummary() {
  const firstDayOfWeek = dayjs().startOf("week").toDate();
  const lastdayOfWeek = dayjs().endOf("week").toDate();
}
