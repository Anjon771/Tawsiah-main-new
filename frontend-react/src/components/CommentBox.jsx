import { useState } from 'react'
import { GoStarFill, GoStar } from 'react-icons/go'
import { useUser } from '../contexts/UserContext'
import { addRating } from '../services/ratingService'
import { useParams } from 'react-router-dom'
import LoadingButton from './ui/LoadingButton'
import { toast } from 'react-toastify'

function CommentBox({ onCommentAdded }) {
  const { user } = useUser()
  const { id } = useParams()
  const [text, setText] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedStar, setSelectedStar] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!user) {
      toast.info('Please log in to submit a review')
      return
    }
    if (selectedStar === 0) {
      toast.info('Please select a rating')
      return
    }
    if (!text.trim()) {
      toast.info('Please write a comment')
      return
    }

    try {
      setSubmitting(true)
      const res = await addRating({
        eventId: Number(id),
        rating: selectedStar,
        comment: text.trim(),
        userName: user.name || user.username || 'Anonymous',
        userID: user.id,
      })

      if (onCommentAdded) onCommentAdded(res.data)

      setText('')
      setSelectedStar(0)
      setHoveredStar(0)
      toast.success('Review submitted successfully!')
    } catch (err) {
      console.error('Failed to submit review:', err)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="comment-box w-100">
      <div className="mb-3">
        <label className="form-label fw-semibold">Your Rating</label>
        <div className="d-flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              onClick={() => setSelectedStar(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              style={{ cursor: 'pointer', transition: 'color 0.15s ease' }}
            >
              {star <= (hoveredStar || selectedStar) ? (
                <GoStarFill size={32} color="#FFC107" />
              ) : (
                <GoStar size={32} color="#ccc" />
              )}
            </span>
          ))}
        </div>
        {selectedStar > 0 && (
          <small className="text-muted">{selectedStar} / 5</small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Your Comment</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts about this place..."
          rows={5}
          className="form-control"
          style={{ resize: 'vertical', minHeight: '120px' }}
        />
      </div>

      <LoadingButton
        loading={submitting}
        loadingText="Submitting..."
        variant="success"
        onClick={handleSubmit}
        className="d-inline w-auto"
      >
        Submit Review
      </LoadingButton>
    </div>
  )
}

export default CommentBox
