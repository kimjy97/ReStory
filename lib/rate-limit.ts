import dbConnect from "@/lib/mongodb"
import RequestLog from "@/models/RequestLog"

export interface RateLimitResult {
  allowed: boolean
  error?: string
  errorType?: string
  limit?: number
  remaining?: number
  resetTime?: Date
}

/**
 * Validates request counts for the calling IP address against strict,
 * low-budget limits (Max 3 requests/hour, Max 10 requests/24 hours).
 * Returns rate limiting structures including exact reset time.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  try {
    await dbConnect()

    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // 1. Hourly check: Max 3 requests per hour
    const hourlyCount = await RequestLog.countDocuments({
      ip,
      timestamp: { $gte: oneHourAgo }
    })

    if (hourlyCount >= 3) {
      // Find oldest record in the 1-hour window to calculate precise cooldown reset
      const oldestHourly = await RequestLog.findOne(
        { ip, timestamp: { $gte: oneHourAgo } },
        {},
        { sort: { timestamp: 1 } }
      )
      const resetTime = oldestHourly
        ? new Date(oldestHourly.timestamp.getTime() + 60 * 60 * 1000)
        : new Date(now.getTime() + 60 * 60 * 1000)

      return {
        allowed: false,
        errorType: "RATE_LIMIT_HOUR_EXCEEDED",
        error: "단시간 내에 너무 많은 복원 요청이 있었습니다. 사진 한 장씩 세심하게 복원하고 있으니 잠시 후 다시 시도해 주세요.",
        limit: 3,
        remaining: 0,
        resetTime
      }
    }

    // 2. Daily check: Max 10 requests per 24 hours
    const dailyCount = await RequestLog.countDocuments({
      ip,
      timestamp: { $gte: twentyFourHoursAgo }
    })

    if (dailyCount >= 10) {
      // Find oldest record in the 24-hour window to calculate precise cooldown reset
      const oldestDaily = await RequestLog.findOne(
        { ip, timestamp: { $gte: twentyFourHoursAgo } },
        {},
        { sort: { timestamp: 1 } }
      )
      const resetTime = oldestDaily
        ? new Date(oldestDaily.timestamp.getTime() + 24 * 60 * 60 * 1000)
        : new Date(now.getTime() + 24 * 60 * 60 * 1000)

      return {
        allowed: false,
        errorType: "RATE_LIMIT_DAY_EXCEEDED",
        error: "오늘 사용하실 수 있는 하루 최대 복원 횟수(10회)를 초과했습니다. 소중한 서버 자원을 보호하기 위한 조치이오니 내일 다시 이용해 주시기 바랍니다.",
        limit: 10,
        remaining: 0,
        resetTime
      }
    }

    // Log the request if allowed
    await RequestLog.create({ ip, timestamp: now })

    return {
      allowed: true,
      limit: 10,
      remaining: Math.max(0, 10 - (dailyCount + 1))
    }
  } catch (error) {
    // If DB connection fails, fail open but log it, or fail shut.
    // For low-budget safety, we log it and let it pass so the service doesn't crash entirely.
    console.error("Rate limit check error:", error)
    return {
      allowed: true,
      limit: 10,
      remaining: 1
    }
  }
}
