import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // 1. Verify that the user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Get the project data from the request body
  const projectData = await request.json()

  // 3. Basic data validation (you can expand this)
  if (!projectData.name || !projectData.technologies) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // 4. Insert into the database
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          name: projectData.name,
          description: projectData.description,
          repo_url: projectData.repo_url,
          live_url: projectData.live_url,
          technologies: projectData.technologies,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error.message)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Project already featured' }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
