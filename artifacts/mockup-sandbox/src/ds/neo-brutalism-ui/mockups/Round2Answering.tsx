import { useState } from 'react';

export function Round2Answering() {
  const [answer, setAnswer] = useState('');
  const maxChars = 120;
  const remaining = maxChars - answer.length;

  return (
    <div
      className="min-h-screen w-full overflow-hidden flex flex-col"
      style={{ backgroundColor: '#0D0D1F', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-14 pb-3">
        <div>
          <p className="text-white font-black uppercase text-lg tracking-wide">ROUND 2</p>
          <div className="flex gap-1.5 mt-1">
            {[true, true, true, false, false].map((filled, i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: filled ? '#FF3DBA' : 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        </div>
        <div
          className="font-black text-3xl tracking-tight"
          style={{ color: '#FFE500', textShadow: '2px 2px 0 #000' }}
        >
          00:45
        </div>
      </div>

      {/* Power Play banner */}
      <div className="px-6 mb-3">
        <div
          className="border-2 border-black p-3 flex items-center gap-3"
          style={{ backgroundColor: '#FF3DBA', boxShadow: '3px 3px 0 #000' }}
        >
          <span style={{ fontSize: '1.3rem' }}>⚠️</span>
          <div>
            <p className="font-black uppercase text-xs tracking-widest text-black">POWER PLAY</p>
            <p className="font-black uppercase text-sm text-black leading-tight">
              ANSWER AS: DESPERATELY OPTIMISTIC CEO
            </p>
          </div>
        </div>
      </div>

      {/* Prompt card */}
      <div className="px-6 flex-1 flex flex-col">
        <div
          className="border-2 border-black p-5 flex flex-col gap-3"
          style={{ backgroundColor: '#FFF9E8', boxShadow: '4px 4px 0 #000' }}
        >
          {/* Prompt context */}
          <p className="font-bold text-base text-black leading-snug">
            Your team missed the deadline.
          </p>
          <p
            className="font-black text-xl uppercase leading-tight text-black"
          >
            Explain why it was actually strategically successful.
          </p>

          {/* Divider */}
          <div style={{ height: '2px', backgroundColor: '#000', opacity: 0.15 }} />

          {/* Input area */}
          <div className="flex flex-col gap-1">
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              maxLength={maxChars}
              placeholder="Type your answer..."
              rows={3}
              className="w-full font-bold text-base border-2 border-black bg-white text-black resize-none"
              style={{
                padding: '12px',
                outline: 'none',
                boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.08)',
              }}
            />
            <p
              className="font-bold text-xs text-right"
              style={{ color: remaining < 20 ? '#FF3DBA' : '#888' }}
            >
              {remaining} characters remaining
            </p>
          </div>
        </div>

        <p className="text-center font-bold text-xs mt-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Remember: you MUST answer as a Desperately Optimistic CEO
        </p>
      </div>

      {/* Sticky bottom */}
      <div className="px-6 pb-10 pt-4">
        <button
          className="w-full bg-[#FFE500] text-black font-black uppercase tracking-wide py-5 text-xl border-2 border-black"
          style={{ boxShadow: '4px 4px 0 #000', letterSpacing: '0.05em' }}
        >
          LOCK IT IN →
        </button>
      </div>
    </div>
  );
}

export default Round2Answering;
