/** @jsxRuntime automatic */
import { type ReactNode } from "react";
import { Button } from "@workspace/neo-brutalism-ui/components/button";
import { Input } from "@workspace/neo-brutalism-ui/components/input";
import { cn } from "@workspace/neo-brutalism-ui/lib/utils";
import { Check, Link2, Radio, ShieldAlert, Sparkles, Trophy, Zap } from "lucide-react";

export const colors = { ink: "#0D0D1F", paper: "#FFF9E8", yellow: "#FFE500", pink: "#FF3DBA", cyan: "#3DFFFF", green: "#00FF85" };
export function Shell({ children, accent = colors.yellow, testId }: { children: ReactNode; accent?: string; testId?: string }) {
  return <main data-testid={testId} className="safe-screen" style={{ background: colors.ink, color: "#fff", borderTop: `4px solid ${accent}` }}><div className="mx-auto flex min-h-[calc(100svh-4px)] w-full max-w-[32rem] flex-col overflow-hidden">{children}</div></main>;
}
export function CTA({ children, onClick, disabled = false, testId, color = "yellow" }: { children: ReactNode; onClick?: () => void; disabled?: boolean; testId: string; color?: "yellow" | "pink" | "cyan" }) {
  return <Button data-testid={testId} type="button" buttonText={`${String(children)} →`} onClick={onClick} disabled={disabled} size="lg" rounded="md" color={color} style={{ width: "100%", fontFamily: "var(--unhinged-display)", fontSize: "1.05rem", letterSpacing: ".06em", boxShadow: disabled ? "none" : "4px 4px 0 #000" }} />;
}
export function Header({ round, right }: { round?: string; right?: ReactNode }) {
  return <div className="flex items-start justify-between px-1 pb-4 pt-8"><div><p className="font-display text-lg uppercase tracking-widest">{round}</p>{round && <div className="mt-2 flex gap-2" aria-label="round progress">{[0,1,2,3,4].map(i => <span key={i} className="h-3 w-3 border-2 border-black" style={{ background: i < (round === "ROUND 1" ? 2 : round === "ROUND 2" ? 3 : 5) ? colors.pink : "rgba(255,255,255,.2)" }} />)}</div>}</div>{right}</div>;
}
export function PaperCard({ children, className, accent = colors.yellow }: { children: ReactNode; className?: string; accent?: string }) {
  return <section className={cn("border-2 border-black p-5 text-black", className)} style={{ background: colors.paper, boxShadow: `4px 4px 0 ${accent}` }}>{children}</section>;
}
export function PromptCard({ label = "QUICK SYNC", prompt, context }: { label?: string; prompt: string; context?: string }) {
  return <PaperCard><span className="inline-block border-2 border-black px-2 py-1 font-display text-xs" style={{ background: colors.cyan }}>{label}</span>{context && <p className="mt-4 text-sm text-slate-600">{context}</p>}<p data-testid="text-prompt" className="mt-3 font-display text-2xl uppercase leading-tight">{prompt}</p></PaperCard>;
}
export function AnswerBox({ value, onChange, locked, onLock, max = 32 }: { value: string; onChange: (v: string) => void; locked: boolean; onLock: () => void; max?: number }) {
  const remaining = max - value.length;
  return <div className="mt-4"><textarea data-testid="input-answer" value={value} onChange={e => onChange(e.target.value)} maxLength={max} disabled={locked} rows={4} placeholder="Type your answer..." className="w-full resize-none border-2 border-black bg-white p-3 font-bold text-black outline-none focus:bg-cyan" /><p data-testid="text-characters-remaining" className="mt-1 text-right text-xs font-bold" style={{ color: remaining < 8 ? colors.pink : "#777" }}>{remaining} characters remaining</p>{locked && <p data-testid="status-answer-locked" className="mt-3 flex items-center gap-2 font-display uppercase text-green-600"><Check size={18} /> Answer locked · waiting for everyone</p>}{!locked && <CTA testId="button-lock-answer" onClick={onLock} disabled={!value.trim()}>LOCK IT IN</CTA>}</div>;
}
export function HostBubble({ children }: { children: ReactNode }) { return <div data-testid="card-host-roast" className="mt-4 border-2 border-black p-4 text-black" style={{ background: colors.paper, boxShadow: "4px 4px 0 #000" }}><p className="font-display text-xs tracking-widest" style={{ color: colors.pink }}><Radio className="mr-1 inline" size={14} /> UNHINGED SAYS</p><p className="mt-2 font-bold">"{children}"</p></div>; }
export function VoteCard({ letter, text, selected, onClick, index }: { letter: string; text: string; selected: boolean; onClick: () => void; index: number }) {
  return <button data-testid={`button-vote-${index}`} type="button" onClick={onClick} className="w-full overflow-hidden border-2 border-black text-left text-black" style={{ background: colors.paper, boxShadow: selected ? `5px 5px 0 ${colors.pink}` : "4px 4px 0 #000", outline: selected ? `3px solid ${colors.pink}` : "none" }}><div className="flex gap-4 p-5"><span className="font-display text-5xl" style={{ color: index % 2 ? colors.cyan : colors.pink }}>{letter}</span><span className="break-words pt-2 font-display text-xl">"{text}"</span></div><div className="border-t-2 border-black p-3 text-center font-display text-sm" style={{ background: selected ? colors.green : index % 2 ? colors.cyan : colors.pink }}>{selected ? "SELECTED ✓" : "TAP TO VOTE ↑"}</div></button>;
}
export function GameTitle({ children, className = "" }: { children: ReactNode; className?: string }) { return <h1 className={cn("font-display uppercase leading-none", className)} style={{ color: colors.yellow, textShadow: "4px 4px 0 #000" }}>{children}</h1>; }
export function CopyButton({ onCopy, copied }: { onCopy: () => void; copied: boolean }) { return <Button data-testid="button-copy-link" type="button" buttonText={copied ? "COPIED!" : "COPY LINK"} onClick={onCopy} size="sm" color="cyan" style={{ fontFamily: "var(--unhinged-display)", boxShadow: "3px 3px 0 #000" }} />; }
export { Input, ShieldAlert, Sparkles, Trophy, Zap, Link2 };