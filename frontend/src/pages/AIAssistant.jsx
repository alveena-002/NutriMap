import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import { AIActiveIndicator } from '../components/AIActiveIndicator'

const starterPrompts = [
  'Which area needs food most this week?',
  'Suggest cheap healthy meals for teenage athletes.',
  'Summarize Sindh corridor supply chain risks.',
]

function TypingDots() {
  return (
    <div className="typing-dot-row flex gap-2 py-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`typing-dot h-2.5 w-2.5 rounded-full bg-gradient-to-br from-nm-neon to-nm-cyan`} />
      ))}
    </div>
  )
}

export default function AIAssistant() {
  const [messages, setMessages] = useState(() => [
    {
      role: 'assistant',
      content:
        "I'm NutriMap Copilot · wired to HF zero-shot routing, SST-2 polarity, and summarization backends. Ask about hotspots, budgeting, or program design.",
      meta: { mock_only: false },
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  const scrollBottom = () => {
    queueMicrotask(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    })
  }

  useEffect(() => {
    scrollBottom()
  }, [messages, loading])

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg = { role: 'user', content: trimmed }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const { data } = await api.post('/assistant', { message: trimmed })
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.reply,
          meta: { mock_only: Boolean(data.meta?.mock_only) },
        },
      ])
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            'Backend unreachable — displaying cached insight: Karachi peri-urban and South Balochistan remain highest priority corridors; deploy conditional cash at wholesale gates while kitchens spin up.',
          meta: { mock_only: true, fallback: 'network_error' },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-[52rem] flex-col gap-8 pb-12">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            Intelligence console
          </h1>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-slate-400">
            Copilot-tier workspace — resilient to cold starters with graceful mock layers underneath.
          </p>
        </div>
        <AIActiveIndicator label="Orchestration live" className="self-start lg:self-center" />
      </div>

      <div
        className="glass-strong ai-chat-sheen relative overflow-hidden rounded-[1.65rem] border border-white/[0.08] shadow-[0_36px_100px_rgba(0,0,0,0.55)]"
        style={{
          boxShadow:
            '0 32px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(0,255,136,0.07)',
        }}
      >
        <div
          className="pointer-events-none absolute left-10 top-0 h-[280px] w-[280px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.06), transparent 65%)' }}
          aria-hidden="true"
        />

        <div
          ref={listRef}
          className="relative max-h-[min(58vh,520px)] space-y-4 overflow-y-auto scroll-smooth px-4 pb-5 pt-5 md:px-8 md:pb-8 md:pt-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-track]:bg-black/40"
          role="log"
          aria-live="polite"
          aria-label="Conversation"
        >
          {messages.map((msg, idx) => (
            <div
              key={`${idx}-${msg.content.slice(0, 24)}`}
              className={`flex chat-bubble-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="mr-3 mt-2 hidden shrink-0 sm:block">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-nm-neon/30 bg-black/65 font-display text-sm font-bold text-nm-neon glow-green">
                    N
                  </div>
                </div>
              )}
              <div
                className={[
                  'max-w-[min(94%,620px)] rounded-[1.15rem] border px-[1rem] py-[0.82rem] text-[13px] leading-[1.7] md:text-[14px]',
                  msg.role === 'user'
                    ? 'border-nm-cyan/25 bg-gradient-to-br from-nm-cyan/[0.14] via-black/45 to-black/55 text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
                    : 'border-nm-neon/18 bg-black/50 text-slate-200 shadow-[0_12px_40px_rgba(0,0,0,0.28)]',
                ].join(' ')}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.meta?.mock_only && (
                  <p className="mt-3 border-t border-white/[0.06] pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200/90">
                    Offline / mock layer
                  </p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start chat-bubble-in">
              <div className="mr-3 mt-2 hidden shrink-0 sm:block">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-nm-neon/30 bg-black/55">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-nm-neon" />
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-[1.15rem] border border-nm-neon/25 bg-black/50 px-5 py-3">
                <TypingDots />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  inference · composing
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="relative border-t border-white/[0.06] bg-black/25 px-4 py-5 backdrop-blur-md md:px-8 md:py-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {starterPrompts.map((p) => (
              <button
                key={p}
                type="button"
                disabled={loading}
                onClick={() => sendMessage(p)}
                className="rounded-full border border-white/[0.08] bg-black/55 px-[0.875rem] py-2 text-left text-[12px] font-medium text-slate-200 outline-none ring-nm-neon/20 transition hover:border-nm-neon/45 hover:bg-nm-neon/[0.08] hover:text-white focus-visible:ring-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 md:text-[13px]"
              >
                {p}
              </button>
            ))}
          </div>

          <form
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage(input)
            }}
          >
            <div className="group/input relative flex min-h-[100px] flex-1">
              <div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-sm transition duration-300 group-focus-within/input:opacity-100"
                style={{
                  background: 'linear-gradient(120deg, rgba(0,255,136,0.45), rgba(0,229,255,0.45))',
                }}
                aria-hidden="true"
              />
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about hotspots, ration design, shocks…"
                rows={3}
                className="relative w-full resize-none rounded-2xl border border-white/[0.12] bg-black/60 px-4 py-3.5 text-[13px] text-white outline-none transition placeholder:text-slate-600 focus:border-nm-neon/40 focus:ring-2 focus:ring-nm-cyan/25 md:text-[14px]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-nm-neon to-nm-cyan px-8 text-[13px] font-bold uppercase tracking-wide text-black shadow-[0_0_32px_rgba(0,255,136,0.35)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 sm:min-h-[100px] sm:w-36 sm:flex-col"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <ul className="space-y-2 text-[11px] leading-snug text-slate-600 md:flex md:flex-wrap md:gap-x-8 md:text-[12px]">
        <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-nm-neon/60">
          Zero-shot clustering routes your prompts to playbook templates.
        </li>
        <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-nm-cyan/60">
          Text classification gauges tone for escalation heuristics.
        </li>
        <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-nm-neon/50">
          Summarisation compresses long policy notes on demand.
        </li>
      </ul>

      <style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { opacity: 0.35; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-4px); }
        }
        .typing-dot:nth-child(1) { animation: typingBounce 1.1s infinite ease-in-out 0ms; }
        .typing-dot:nth-child(2) { animation: typingBounce 1.1s infinite ease-in-out 160ms; }
        .typing-dot:nth-child(3) { animation: typingBounce 1.1s infinite ease-in-out 320ms; }
      `}</style>
    </div>
  )
}
