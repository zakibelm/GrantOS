
import React, { useState } from 'react';
import { ClientFeedback } from '../types';

export const FeedbackSection: React.FC = () => {
  const [feedback, setFeedback] = useState<ClientFeedback>({
    satisfaction: 5,
    accuracy: 5,
    clarity: 5,
    comments: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simuler le stockage dans la boucle d'apprentissage
    console.log("Feedback envoyé à la boucle d'apprentissage GrantOS:", feedback);
  };

  if (submitted) {
    return (
      <div className="bg-indigo-600 rounded-2xl p-8 text-center text-white shadow-xl animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Merci pour votre feedback !</h3>
        <p className="text-indigo-100 text-sm">Vos réponses ont été injectées dans notre boucle d'apprentissage pour optimiser les classements futurs et la précision des sources.</p>
      </div>
    );
  }

  const StarRating = ({ label, value, field }: { label: string, value: number, field: keyof ClientFeedback }) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setFeedback({ ...feedback, [field]: star })}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              star <= value ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
          >
            {star}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9-.693-2.193-1.639l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Boucle d'apprentissage (Learning Loop)</h3>
          <p className="text-sm text-slate-500">Aidez-nous à affiner nos algorithmes de matching.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StarRating label="Satisfaction Globale" value={feedback.satisfaction} field="satisfaction" />
          <StarRating label="Précision des Infos" value={feedback.accuracy} field="accuracy" />
          <StarRating label="Clarté des Recommandations" value={feedback.clarity} field="clarity" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Commentaires additionnels</label>
          <textarea
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Avez-vous repéré une erreur ? Un programme manquant ?"
            value={feedback.comments}
            onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg"
        >
          Soumettre au Système GrantOS
        </button>
      </form>
    </div>
  );
};
