const prisma = require("../lib/prisma");
const {
  subDays,
  format,
  startOfDay,
  endOfDay,
  parseISO,
  isValid,
  isWithinInterval,
} = require("date-fns");

class AnalyticsService {
  async getAttendanceTrend(organization_id, dateRange) {
    let { start, end } = dateRange;

    const today = new Date();

    const safeStart =
      start && isValid(new Date(start))
        ? startOfDay(parseISO(start))
        : startOfDay(subDays(today, 30));

    const safeEnd =
      end && isValid(new Date(end)) ? endOfDay(parseISO(end)) : endOfDay(today);

    const events = await prisma.event.findMany({
      where: {
        organization_id,
        created_at: {
          gte: safeStart,
          lte: safeEnd,
        },
      },
      select: { id: true },
    });

    const eventIds = events.map((e) => e.id);
    if (!eventIds.length) return [];

    const attendances = await prisma.attendance.findMany({
      where: {
        event_id: { in: eventIds },
        created_at: {
          gte: safeStart,
          lte: safeEnd,
        },
      },
      select: { created_at: true },
    });

    const counts = {};
    for (let attendance of attendances) {
      const day = format(attendance.created_at, "yyyy-MM-dd");
      counts[day] = (counts[day] || 0) + 1;
    }

    // Only return dates that had attendance
    const trend = Object.entries(counts).map(([date, count]) => ({
      date,
      count,
    }));

    return trend;
  }

  async getFirstTimerStats(organization_id, dateRange) {
    const { start_date, end_date } = dateRange;

    const startDate = isValid(parseISO(start_date))
      ? startOfDay(parseISO(start_date))
      : null;
    const endDate = isValid(parseISO(end_date))
      ? endOfDay(parseISO(end_date))
      : null;

    if (!startDate || !endDate) {
      throw new Error("Invalid or missing date range");
    }

    // Fetch first-timer attendance count grouped by date
    const result = await prisma.attendance.groupBy({
      by: ["event_id"],
      _count: {
        id: true,
      },
      where: {
        is_first_timer: true,
        created_at: {
          gte: startDate,
          lte: endDate,
        },
        event: {
          organization_id,
        },
      },
    });

    // Fetch event details to attach date and title
    const eventIds = result.map((r) => r.event_id);

    const events = await prisma.event.findMany({
      where: {
        id: { in: eventIds },
      },
      select: {
        id: true,
        title: true,
        expires_at: true,
      },
    });

    const trend = result.map((entry) => {
      const event = events.find((e) => e.id === entry.event_id);
      return {
        event_id: entry.event_id,
        event_title: event?.title || "Unknown Event",
        date: event?.expires_at || null,
        first_timer_count: entry._count.id,
      };
    });

    const total = trend.reduce((sum, e) => sum + e.first_timer_count, 0);

    return {
      total_first_timers: total,
      trend,
    };
  }

  async getInactiveMembers(organization_id, timeframe) {
    // Resolve timeframe to a start date
    let daysAgo;
    switch (timeframe) {
      case "2w":
        daysAgo = 14;
        break;
      case "1m":
        daysAgo = 30;
        break;
      case "3m":
        daysAgo = 90;
        break;
      case "6m":
        daysAgo = 180;
        break;
      case "1y":
        daysAgo = 365;
        break;
      default:
        // If a custom date is passed (e.g., "2025-04-01"), parse it
        try {
          const parsedDate = parseISO(timeframe);
          if (isNaN(parsedDate)) throw new Error();
          daysAgo = Math.floor(
            (Date.now() - parsedDate.getTime()) / (1000 * 60 * 60 * 24)
          );
        } catch {
          throw new Error("Invalid timeframe format");
        }
    }

    const startDate = subDays(new Date(), daysAgo);

    // Find all members who have NOT attended any events since startDate
    const inactiveMembers = await prisma.member.findMany({
      where: {
        organization_id,
        attendances: {
          none: {
            event: {
              expires_at: {
                gte: startDate,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return inactiveMembers;
  }

  async getIndividualMemberProfile(member_id) {
    const member = await prisma.member.findUnique({
      where: { id: member_id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        created_at: true,
      },
    });

    if (!member) return null;

    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        OR: [
          { email: member.email || undefined },
          { phone: member.phone || undefined },
          { name: member.name },
        ],
      },
      select: {
        id: true,
        event_id: true,
        name: true,
        phone: true,
        email: true,
        gender: true,
        is_first_timer: true,
        created_at: true,
        event: {
          select: {
            id: true,
            title: true,
            created_at: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      member,
      attendance_history: attendanceRecords,
    };
  }

  async getGenderDistribution(organization_id) {
    const genders = await prisma.member.groupBy({
      by: ["gender"],
      where: {
        organization_id,
        gender: {
          in: ["male", "female"],
        },
      },
      _count: true,
    });

    const distribution = {
      male: 0,
      female: 0,
    };

    for (const entry of genders) {
      if (entry.gender === "male") {
        distribution.male = entry._count;
      } else if (entry.gender === "female") {
        distribution.female = entry._count;
      }
    }

    return distribution;
  }

  async getEventAttendanceBreakdown(organization_id) {
    // Fetch all events for the organization with their attendance count
    const events = await prisma.event.findMany({
      where: { organization_id },
      select: {
        id: true,
        title: true,
        created_at: true,
        attendances: {
          select: {
            id: true, // we just need the count
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    // Map to return attendance count per event
    const data = events.map((event) => ({
      event_id: event.id,
      title: event.title,
      date: event.date,
      attendance_count: event.attendances.length,
    }));

    return data;
  }

  async getUniqueVisitorsVsMembers(organization_id, dateRange) {
    const { start_date, end_date } = dateRange;

    const startDate = startOfDay(new Date(start_date));
    const endDate = endOfDay(new Date(end_date));

    // Fetch all event IDs for the org within the date range
    const events = await prisma.event.findMany({
      where: {
        organization_id,
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { id: true },
    });

    const eventIds = events.map((event) => event.id);

    // Run groupBy only if events exist
    const [uniqueVisitors, totalMembers] = await Promise.all([
      eventIds.length > 0
        ? prisma.attendance.groupBy({
            by: ["member_id"],
            where: {
              event_id: {
                in: eventIds,
              },
            },
          })
        : [],

      prisma.member.count({
        where: { organization_id },
      }),
    ]);

    return {
      unique_visitors: uniqueVisitors.length,
      total_members: totalMembers,
    };
  }

  async getRetentionStats(organization_id, dateRange) {
    const { start_date, end_date } = dateRange;

    const startDate = startOfDay(new Date(start_date));
    const endDate = endOfDay(new Date(end_date));

    // Step 1: Get all attendance records for the date range
    const attendances = await prisma.attendance.findMany({
      where: {
        event: {
          is: {
            organization_id,
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      select: {
        member_id: true,
        created_at: true,
      },
    });

    // Step 2: Get unique member IDs who attended during the range
    const attendedMemberIds = [
      ...new Set(attendances.map((a) => a.member_id)),
    ].filter(Boolean);

    if (attendedMemberIds.length === 0) {
      return {
        new: 0,
        returning: 0,
        retained: 0,
      };
    }

    // Step 3: For each attended member, check their first-ever attendance
    const firstAttendances = await prisma.attendance.findMany({
      where: {
        member_id: {
          in: attendedMemberIds,
        },
      },
      orderBy: {
        created_at: "asc",
      },
      select: {
        member_id: true,
        created_at: true,
      },
    });

    const firstAttendanceMap = new Map();
    for (const record of firstAttendances) {
      if (!firstAttendanceMap.has(record.member_id)) {
        firstAttendanceMap.set(record.member_id, record.created_at);
      }
    }

    let newCount = 0;
    let returningCount = 0;
    let retainedCount = 0;

    for (const member_id of attendedMemberIds) {
      const firstDate = firstAttendanceMap.get(member_id);
      if (!firstDate) continue;

      if (isWithinInterval(firstDate, { start: startDate, end: endDate })) {
        newCount++;
      } else {
        returningCount++;
      }

      const hasPreviousAttendance = await prisma.attendance.findFirst({
        where: {
          member_id: "e239028f-9122-4d19-9ef5-ea07c3c7db70",
          event: {
            is: {
              organization_id: "bf9e2fc3-6a00-4a79-818e-a9b66e5ef0dd",
              created_at: {
                lt: new Date("2025-07-02T23:00:00.000Z"),
              },
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (hasPreviousAttendance) {
        retainedCount++;
      }
    }

    return {
      new: newCount,
      returning: returningCount,
      retained: retainedCount,
    };
  }

  async getAllMembersByOrganization(organization_id) {
    return await prisma.member.findMany({
      where: { organization_id },
      orderBy: { created_at: "desc" },
    });
  }
}

module.exports = new AnalyticsService();
