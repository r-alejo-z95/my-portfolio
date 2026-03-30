import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

function isValidUrl(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projectData = await request.json()

  if (!projectData.name || !projectData.technologies) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  for (const field of ['repo_url', 'live_url', 'image_url'] as const) {
    if (projectData[field] && !isValidUrl(projectData[field])) {
      return NextResponse.json({ error: `Invalid URL for ${field}` }, { status: 400 })
    }
  }

  try {
    const { data: maxData } = await supabase
      .from('projects')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const nextSortOrder = maxData?.sort_order != null ? maxData.sort_order + 1 : 1

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        name: projectData.name,
        description: projectData.description ?? null,
        repo_url: projectData.repo_url ?? null,
        live_url: projectData.live_url ?? null,
        image_url: projectData.image_url ?? null,
        technologies: projectData.technologies,
        sort_order: nextSortOrder,
      }])
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
