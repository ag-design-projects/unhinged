import { useState } from 'react';

export function JoinGame() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  return (
    <div
      className="min-h-screen w-full overflow-hidden flex flex-col"
      style={{ backgroundColor: '#FFF9E8', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div style={{ width: 8, height: 32, backgroundColor: '#FFE500', border: '2px solid #000' }} />
          <h1
            className="font-black uppercase tracking-tight text-black"
            style={{ fontSize: '2.5rem', lineHeight: 1 }}
          >
            JOIN A GAME
          </h1>
        </div>
        <p className="font-bold text-sm uppercase tracking-wide" style={{ color: '#888' }}>
          Enter your details below
        </p>
      </div>

      {/* Form card */}
      <div className="px-6 flex-1">
        <div
          className="bg-[#FFF9E8] border-2 border-black p-5 flex flex-col gap-5"
          style={{ boxShadow: '4px 4px 0 #000' }}
        >
          {/* Code input */}
          <div className="flex flex-col gap-2">
            <label className="font-black uppercase text-xs tracking-widest text-black">
              Enter the game code
            </label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="7FKP"
              maxLength={6}
              className="w-full font-black uppercase text-center border-2 border-black bg-white text-black"
              style={{
                fontSize: '2.5rem',
                letterSpacing: '0.3em',
                padding: '12px',
                fontFamily: 'monospace',
                boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.1)',
                outline: 'none',
              }}
            />
          </div>

          {/* Divider */}
          <div style={{ height: '2px', backgroundColor: '#000' }} />

          {/* Name input */}
          <div className="flex flex-col gap-2">
            <label className="font-black uppercase text-xs tracking-widest text-black">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Amogh"
              className="w-full font-bold border-2 border-black bg-white text-black text-xl"
              style={{
                padding: '12px 16px',
                boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.1)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Decorative dots */}
        <div className="flex justify-center gap-2 mt-4">
          {['#FF3DBA', '#FFE500', '#3DFFFF'].map((c, i) => (
            <div key={i} style={{ width: 8, height: 8, backgroundColor: c, border: '2px solid #000' }} />
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-6 pb-10 flex flex-col gap-3 mt-6">
        <button
          className="w-full bg-[#FFE500] text-black font-black uppercase tracking-wide py-5 text-xl border-2 border-black"
          style={{ boxShadow: '4px 4px 0 #000', letterSpacing: '0.05em' }}
        >
          JOIN MEETING →
        </button>

        <div className="flex items-center gap-3 my-1">
          <div style={{ flex: 1, height: 2, backgroundColor: '#000' }} />
          <span className="font-bold text-sm text-black">OR</span>
          <div style={{ flex: 1, height: 2, backgroundColor: '#000' }} />
        </div>

        <button
          className="w-full font-black uppercase tracking-wide py-4 text-lg border-2 border-black text-black"
          style={{ backgroundColor: '#FFF9E8', boxShadow: '4px 4px 0 #000', letterSpacing: '0.05em' }}
        >
          📷 SCAN QR
        </button>
      </div>
    </div>
  );
}

export default JoinGame;
