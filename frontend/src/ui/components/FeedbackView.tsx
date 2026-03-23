import { useState } from "react";
import { DiagnoseApi } from "../api";
import { useTranslation } from "react-i18next";

interface FeedbackViewProps {
  api: DiagnoseApi;
  patientId?: number;
  onBack: () => void;
}

export const FeedbackView = ({ api, patientId, onBack }: FeedbackViewProps) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.submitFeedback({
        rating,
        comment,
        patient_id: patientId
      });
      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-emerald-100">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your feedback helps us improve HealthAI.</p>
          <button
            onClick={onBack}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={onBack}
          className="mb-6 text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Feedback</h1>
          <p className="text-gray-600 mb-8">Tell us about your experience with HealthAI.</p>

          {error && (
            <div className="mb-6 bg-red-50 text-red-800 px-4 py-3 rounded-xl text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate your experience
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`w-12 h-12 rounded-full text-2xl transition-all ${
                      rating >= star
                        ? "bg-yellow-100 ring-2 ring-yellow-400 scale-110"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {rating >= star ? "⭐" : "★"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-32 rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 border resize-none"
                placeholder="What did you like? What can we improve?"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
