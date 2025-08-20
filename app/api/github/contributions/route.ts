import { NextResponse } from 'next/server'

interface ContributionDay {
  contributionCount: number;
  date: string;
  weekday: number;
}

interface Week {
  contributionDays: ContributionDay[];
}

export async function GET() {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME

    if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
      return NextResponse.json(
        { error: 'GitHub credentials not configured' },
        { status: 500 }
      )
    }

    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  weekday
                }
              }
            }
          }
        }
      }
    `

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username: GITHUB_USERNAME }
      }),
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      console.error('GitHub API response not OK:', response.status, response.statusText)
      throw new Error(`GitHub GraphQL API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors)
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar
    
    const allContributions: { date: string; count: number; level: number; weekday: number }[] = []
    let totalDays = 0
    let daysWithContributions = 0
    
    calendar.weeks.forEach((week: Week) => {
      
      week.contributionDays.forEach((day: ContributionDay) => {
        totalDays++
        if (day.contributionCount > 0) {
          daysWithContributions++
        }
        
        allContributions.push({
          date: day.date,
          count: day.contributionCount,
          level: getContributionLevel(day.contributionCount),
          weekday: day.weekday
        })
      })
    })

    const contributionsMap = new Map()
    allContributions.forEach(contrib => {
      if (contrib.count > 0) {
        contributionsMap.set(contrib.date, contrib.count)
      }
    })

    return NextResponse.json({
      totalContributions: calendar.totalContributions,
      contributions: allContributions,
      debug: {
        totalDays,
        daysWithContributions,
        weeksCount: calendar.weeks.length,
        firstDate: allContributions[0]?.date,
        lastDate: allContributions[allContributions.length - 1]?.date,
        sampleContributions: Array.from(contributionsMap.entries()).slice(0, 5)
      }
    })

  } catch (error) {
    console.error('Error fetching GitHub contributions:', error)
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { error: 'Failed to fetch contributions', details: errorMessage },
      { status: 500 }
    )
  }
}

function getContributionLevel(count: number): number {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}
