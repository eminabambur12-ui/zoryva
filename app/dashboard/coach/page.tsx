'use client'

import { useEffect, useRef, useState } from 'react'

type Category = 'personal' | 'business' | 'investing' | 'tax'

const QUICK_PROMPTS: Record<Category, string[]> = {
  personal: [
    'What\'s my safe spending amount today?',
    'How can I save $500 more this month?',
    'Where am I overspending?',
    'What\'s my current savings rate?',
    'How do I build a 6-month emergency fund?',
    'Help me make a debt payoff plan',
  ],
  business: [
    'What\'s my most profitable product or service?',
    'What\'s my net profit margin?',
    'How should I price my next offer?',
    'When can I afford to hire someone?',
    'Where am I leaking profit?',
    'Forecast my revenue for next quarter',
  ],
  investing: [
    'I have $5,000 — what should I do with it?',
    'Should I max out my IRA or invest first?',
    'What\'s the best investment strategy for my goals?',
    'How do I build a diversified portfolio?',
    'Should I invest or pay off debt first?',
    'When can I retire at this savings rate?',
  ],
  tax: [
    'What business expenses can I deduct?',
    'How much should I set aside for taxes?',
    'Should I set up an S-Corp?',
    'Am I missing any tax deductions?',
    'How do I reduce my tax bill this year?',
    'What retirement accounts minimize taxes?',
  ],
}

const CATEGORY_LABELS: Record<Category, { label: string; icon: string }> = {
  personal: { label: 'Personal', icon: '💰' },
  business: { label: 'Business', icon: '📦' },
  investing: { label: 'Investing', icon: '📈' },
  tax: { label: 'Tax', icon: '🧾' },
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export default function ZaraChatPage() {
  const [category, setCategory] = useState<Category>('personal')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load history
  useEffect(() => {
    fetch('/api/ai/coach/history')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(content: string) {
    if (!content.trim() || sending) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      created_at: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content.trim(), category }),
      })
      const data = await res.json()

      if (data.reply) {
        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          created_at: new Date().toISOString(),
        }
        setMessages(prev => [...prev, assistantMsg])
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'I ran into an issue. Please try again.',
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const isEmpty = !loading && messages.length === 0

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-rose/10 bg-white px-6 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-gradient-rose flex items-center justify-center shadow-rose flex-shrink-0">
            <span className="text-base">✦</span>
          </div>
          <div>
            <div className="font-semibold text-charcoal text-sm">Zara</div>
            <div className="text-xs text-muted">Your AI CFO · Always on</div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 bg-cream rounded-xl p-1">
          {(Object.keys(CATEGORY_LABELS) as Category[]).map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                category === c
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-muted hover:text-charcoal'
              }`}
            >
              <span>{CATEGORY_LABELS[c].icon}</span>
              <span className="hidden sm:inline">{CATEGORY_LABELS[c].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 rounded-full border-2 border-rose/30 border-t-rose-deep animate-spin" />
          </div>
        )}

        {isEmpty && (
          <div className="py-8">
            <div className="text-center mb-6">
              <div className="font-serif text-xl font-semibold text-charcoal mb-1">Ask Zara anything</div>
              <p className="text-sm text-muted">Your personal CFO, tax advisor, and wealth planner — in one chat.</p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {QUICK_PROMPTS[category].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-left px-4 py-3 bg-white border border-rose/10 rounded-xl text-sm text-charcoal hover:border-rose/30 hover:shadow-card transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-rose flex items-center justify-center flex-shrink-0 mr-2 mt-1 shadow-rose">
                <span className="text-xs">✦</span>
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-dark text-white rounded-br-sm'
                  : 'bg-white border border-rose/10 text-charcoal rounded-bl-sm shadow-card'
              }`}
            >
              {msg.content.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < msg.content.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-rose flex items-center justify-center flex-shrink-0 mr-2 shadow-rose">
              <span className="text-xs">✦</span>
            </div>
            <div className="bg-white border border-rose/10 rounded-2xl rounded-bl-sm px-4 py-3 shadow-card">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-rose rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts (non-empty state) */}
      {!isEmpty && (
        <div className="flex-shrink-0 px-6 py-2 border-t border-rose/5">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {QUICK_PROMPTS[category].slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="flex-shrink-0 px-3 py-1.5 bg-cream border border-rose/10 rounded-full text-xs text-muted hover:text-charcoal hover:border-rose/30 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-rose/10 bg-white">
        <div className="flex items-end gap-3 bg-cream border border-rose/15 rounded-2xl px-4 py-3 focus-within:border-rose/40 focus-within:shadow-card transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${CATEGORY_LABELS[category].label.toLowerCase()} finances...`}
            className="flex-1 bg-transparent text-sm text-charcoal placeholder-muted outline-none resize-none max-h-32 min-h-[20px]"
            rows={1}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || sending}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-rose flex items-center justify-center shadow-rose transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5m-7 7l7-7 7 7" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-faint mt-2">
          Zara uses your real financial data to answer questions accurately.
        </p>
      </div>
    </div>
  )
}
