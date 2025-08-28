import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  // 1. Verify that the user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Await params to get the parameters
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