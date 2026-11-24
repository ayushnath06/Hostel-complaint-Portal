'use client'

import { useState, useEffect } from 'react'
import { mockStore } from '@/lib/mockStore'
import { Star, Send, CheckCircle } from 'lucide-react'

interface FeedbackFormProps {
  issueId: string
}

export function FeedbackForm({ issueId }: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [existingFeedback, setExistingFeedback] = useState<null | { rating: number; comment: string | null }>(null)

  useEffect(() => {
    const fb = mockStore.getFeedback(issueId)
    if (fb) {
      setExistingFeedback(fb)
      setRating(fb.rating)
      setSubmitted(true)
    }
  }, [issueId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return
    setSubmitting(true)

    const fb = mockStore.submitFeedback(issueId, rating, comment.trim() || null)
    setExistingFeedback(fb)
    setSubmitted(true)
    setSubmitting(false)
  }

  const displayRating = existingFeedback?.rating || rating
  const displayComment = existingFeedback?.comment

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle size={16} className="text-emerald-600 shrink-0" />
        <span className="text-sm font-semibold text-emerald-900">Issue Resolved</span>
      </div>

      {submitted ? (
        <div className="space-y-1.5">
          <p className="text-xs text-emerald-800 font-medium">Thank you for rating this resolution!</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={18}
                className={s <= displayRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
              />
            ))}
            <span className="text-xs font-semibold text-slate-700 ml-1.5">{displayRating}/5</span>
          </div>
          {displayComment && (
            <p className="text-xs text-slate-600 italic bg-white/70 p-2 rounded-lg border border-emerald-100 mt-2">
              &ldquo;{displayComment}&rdquo;
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <p className="text-xs text-emerald-900 font-medium mb-1.5">
              Was this issue resolved to your satisfaction? Please leave a rating:
            </p>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
                >
                  <Star
                    size={22}
                    className={
                      s <= (hovered || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 hover:text-amber-300'
                    }
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-xs font-semibold text-slate-600 ml-2">
                  {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Terrible'}
                </span>
              )}
            </div>
          </div>

          <div>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional: Any additional comments on the fix?"
              className="w-full text-xs px-3 py-2 rounded-lg border border-emerald-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0 || submitting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send size={12} />
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      )}
    </div>
  )
}
