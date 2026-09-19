import { useState } from 'react';

export function Answering() {
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
          <p className="text-white font-black uppercase text-lg tracking-wide">ROUND 1</p>
          {/* Progress dots */}
          <div className="flex gap-1.5 mt-1">
            {[true, true, false, false, false].map((filled, i) => (
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
          00:38
        </div>
      </div>

      {/* Prompt card */}
      <div className="px-6 flex-1 flex flex-col">
        <div
          className="border-2 border-black p-5 flex flex-col gap-3"
          style={{ backgroundColor: '#FFF9E8', boxShadow: '4px 4px 0 #000' }}
        >
          {/* Category label */}
          <div className="flex items-center gap-2">
            <span
              className="font-black uppercase text-xs tracking-widest px-2 py-1 border border-black"
              style={{ backgroundColor: '#3DFFFF', color: '#000' }}
            >
              ⚡ QUICK SYNC
            </span>
          </div>

          {/* Context */}
          <p className="font-bold text-sm text-black" style={{ color: '#555' }}>
            Your manager says: <em>"Can we jump on a quick call?"</em>
          </p>

          {/* Main prompt */}
          <p className="font-black text-black text-xl uppercase leading-tight">
            THE CALL WILL DEFINITELY _______
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

        {/* Encouragement */}
        <p className="text-center font-bold text-sm mt-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Be honest. Be ruthless. Be professional.
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

export default Answering;
