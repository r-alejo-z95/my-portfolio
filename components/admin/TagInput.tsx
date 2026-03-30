'use client'
import { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  label?: string
}

export default function TagInput({ value, onChange, placeholder = 'Add tag...', label }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const tag = input.trim()
    if (tag && !value.includes(tag)) {
      onChange([...value, tag])
    }
    setInput('')
  }

  const removeTag = (tag: string) => {
    onChange(value.filter(t => t !== tag))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-mono text-gray-300">{label}</label>}
      <div className={cn(
        'w-full bg-gray-800 border border-gray-700 p-3 font-mono',
        'focus-within:border-green-400 transition-colors min-h-[48px]',
        'flex flex-wrap gap-2 items-center'
      )}>
        {value.map(tag => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-gray-700 text-green-400 text-xs px-2 py-1 border border-gray-600"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-400 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 bg-transparent text-white outline-none text-sm placeholder:text-gray-500 min-w-[120px]"
        />
      </div>
      <p className="text-gray-500 text-xs font-mono">Press Enter or comma to add a tag</p>
    </div>
  )
}
