import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // 1. Verificar que el usuario esté autenticado
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Obtener los datos del proyecto del cuerpo de la solicitud
  const projectData = await request.json()

  // 3. Validación básica de los datos (puedes expandir esto)
  if (!projectData.name || !projectData.technologies) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // 4. Insertar en la base de datos
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
  } catch (e) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
