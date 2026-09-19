export function RoundResults() {
  return (
    <div
      className="min-h-screen w-full overflow-hidden flex flex-col"
      style={{ backgroundColor: '#0D0D1F', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        <p className="font-black uppercase tracking-widest text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          ROUND 1 · RESULTS
        </p>
      </div>

      {/* Winner section */}
      <div className="px-6 flex flex-col items-center gap-2 py-4">
        <span style={{ fontSize: '3.5rem' }}>🏆</span>
        <h2
          className="font-black uppercase tracking-tight"
          style={{ fontSize: '2.5rem', color: '#FF3DBA', textShadow: '3px 3px 0 #000' }}
        >
          WINNER!
        </h2>
        <h3
          className="font-black uppercase tracking-tight"
          style={{ fontSize: '3rem', color: '#fff', lineHeight: 1 }}
        >
          PRIYA
        </h3>
        <div
          className="font-black uppercase text-3xl px-4 py-1 border-2 border-black"
          style={{ color: '#00FF85', backgroundColor: 'rgba(0,255,133,0.1)', boxShadow: '3px 3px 0 #fff' }}
        >
          +400 PTS
        </div>
      </div>

      {/* Winning answer */}
      <div className="px-6 flex flex-col gap-3 flex-1">
        <div
          className="border-2 border-black p-4"
          style={{ backgroundColor: '#FFF9E8', boxShadow: '4px 4px 0 #000' }}
        >
          <p className="font-black uppercase text-xs tracking-widest text-black mb-2" style={{ color: '#888' }}>
            Winning answer
          </p>
          <p className="font-black text-black text-2xl leading-snug">
            "My entire afternoon."
          </p>
          <p className="font-bold text-sm mt-2" style={{ color: '#888' }}>
            Voted by 4 people.
          </p>
        </div>

        {/* AI speech bubble */}
        <div className="relative">
          {/* Tail */}
          <div
            style={{
              position: 'absolute',
              top: -10,
              left: 30,
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '10px solid #000',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -8,
              left: 32,
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '8px solid #FFF9E8',
            }}
          />
          <div
            className="border-2 border-black p-4"
            style={{ backgroundColor: '#FFF9E8', boxShadow: '4px 4px 0 #000' }}
          >
            <p className="font-black uppercase text-xs tracking-widest mb-2" style={{ color: '#FF3DBA' }}>
              🤖 UNHINGED SAYS
            </p>
            <p className="font-bold text-black text-base leading-relaxed">
              "Apparently four people needed their afternoon back."
            </p>
          </div>
        </div>

        {/* Score strip */}
        <div
          className="border-2 border-black p-3 flex justify-between items-center"
          style={{ backgroundColor: '#1a1a33', boxShadow: '4px 4px 0 #fff' }}
        >
          <div className="text-center flex-1">
            <p className="font-black text-lg" style={{ color: '#FFE500' }}>2,840</p>
            <p className="font-bold text-xs uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Priya</p>
          </div>
          <div style={{ width: 2, height: 30, backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <div className="text-center flex-1">
            <p className="font-black text-lg text-white">2,510</p>
            <p className="font-bold text-xs uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Rahul</p>
          </div>
          <div style={{ width: 2, height: 30, backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <div className="text-center flex-1">
            <p className="font-black text-lg text-white">1,920</p>
            <p className="font-bold text-xs uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>You</p>
          </div>
        </div>
      </div>

      {/* Sticky bottom */}
      <div className="px-6 pb-10 pt-4">
        <button
          className="w-full bg-[#FFE500] text-black font-black uppercase tracking-wide py-5 text-xl border-2 border-black"
          style={{ boxShadow: '4px 4px 0 #000', letterSpacing: '0.05em' }}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}

export default RoundResults;
