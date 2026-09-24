/** @jsxRuntime automatic */
import { PaperCard } from "./GameUI";
import type { AnswerEntry } from "../game/types";

export function AnswerReview({
  answers, viewerId, showVotes = false,
}: {
  answers: (AnswerEntry & { votes?: number })[];
  viewerId?: string;
  showVotes?: boolean;
}) {
  return <section className="mt-8 w-full text-left" aria-label="All answers" data-testid="answer-review">
    <h3 className="font-display text-xl uppercase text-yellow-300">All answers</h3>
    <p className="mt-1 text-sm text-white/70">
      {showVotes ? "Every response and its vote total." : "For review only. Only the response cards above can receive your vote."}
    </p>
    <div className="mt-4 space-y-3">
      {answers.map((answer, index) => <PaperCard key={answer.id} className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-2 text-xs font-bold uppercase tracking-wide text-slate-600">
          <span>{showVotes ? (answer.authorName ?? "Player") : `Response ${index + 1}`}{answer.authorId === viewerId && " · Yours"}</span>
          <span>{answer.submitted ? "Submitted" : "Not submitted"}</span>
        </div>
        {answer.prompt && <p className="mt-2 break-words text-sm text-slate-600">{answer.prompt}</p>}
        <p className="mt-2 break-words font-display text-xl">{answer.submitted ? answer.text : "Not submitted"}</p>
        {showVotes && <p className="mt-2 text-sm font-bold text-slate-600">{answer.votes ?? 0} {(answer.votes ?? 0) === 1 ? "vote" : "votes"}</p>}
      </PaperCard>)}
    </div>
  </section>;
}