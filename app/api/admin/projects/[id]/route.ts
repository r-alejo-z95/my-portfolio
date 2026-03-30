import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

function isValidUrl(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: projectId } = await params

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
  }

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .match({ id: projectId })

    if (error) {
      console.error('Supabase error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Project removed successfully' }, { status: 200 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: projectId } = await params

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
  }

  const body = await request.json()

  for (const field of ['repo_url', 'live_url', 'image_url'] as const) {
    if (body[field] && !isValidUrl(body[field])) {
      return NextResponse.json({ error: `Invalid URL for ${field}` }, { status: 400 })
    }
  }

  const allowedFields = ['name', 'description', 'repo_url', 'live_url', 'image_url', 'technologies']
  const updateData: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updateData[field] = body[field]
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
