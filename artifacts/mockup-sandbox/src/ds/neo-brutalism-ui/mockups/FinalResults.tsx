export function FinalResults() {
  const leaderboard = [
    { place: 1, medal: '🥇', name: 'PRIYA', pts: '2,840', accent: '#FFE500', big: true },
    { place: 2, medal: '🥈', name: 'RAHUL', pts: '2,510', accent: '#C0C0C0', big: false },
    { place: 3, medal: '🥉', name: 'AMOGH', pts: '1,920', accent: '#CD7F32', big: false },
    { place: 4, medal: '4', name: 'SARAH', pts: '1,640', accent: 'transparent', big: false },
  ];

  return (
    <div
      className="min-h-screen w-full overflow-hidden flex flex-col"
      style={{ backgroundColor: '#0D0D1F', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        <h1
          className="font-black uppercase tracking-tight leading-tight"
          style={{ fontSize: '2rem', color: '#FFE500', textShadow: '3px 3px 0 #000' }}
        >
          THE QUARTERLY RESULTS
        </h1>
      </div>

      {/* Leaderboard */}
      <div className="px-6 flex flex-col gap-2">
        {leaderboard.map((p) => (
          <div
            key={p.place}
            className="border-2 border-black flex items-center gap-3 px-4 py-3"
            style={{
              backgroundColor: p.big ? '#FFE500' : '#FFF9E8',
              boxShadow: p.big ? '4px 4px 0 #000' : '3px 3px 0 #000',
            }}
          >
            <span style={{ fontSize: p.big ? '1.8rem' : '1.4rem', minWidth: 36 }}>{p.medal}</span>
            <span
              className="font-black uppercase flex-1"
              style={{ fontSize: p.big ? '1.3rem' : '1.1rem', color: '#000' }}
            >
              {p.name}
            </span>
            <span
              className="font-black"
              style={{ fontSize: p.big ? '1.3rem' : '1rem', color: '#000' }}
            >
              {p.pts} pts
            </span>
          </div>
        ))}
      </div>

      {/* Corporate persona */}
      <div className="px-6 mt-5">
        <div
          className="border-2 border-black p-4"
          style={{ backgroundColor: '#FF3DBA', boxShadow: '4px 4px 0 #000' }}
        >
          <p className="font-black uppercase text-xs tracking-widest text-black mb-1">
            YOUR CORPORATE PERSONA
          </p>
          <p className="font-black uppercase text-2xl text-black leading-tight">
            ☢️ STRATEGIC MENACE
          </p>
          <p className="font-bold text-sm italic text-black mt-1" style={{ color: 'rgba(0,0,0,0.7)' }}>
            Most likely to say "noted" while plotting revenge.
          </p>
        </div>
      </div>

      {/* AI speech bubble */}
      <div className="px-6 mt-4 relative">
        <div
          style={{
            position: 'absolute',
            top: -10,
            left: 46,
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
            left: 48,
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
          <p className="font-bold text-black text-sm leading-relaxed">
            "Congratulations. Nobody learned anything."
          </p>
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-6 pb-10 pt-5 mt-auto">
        <button
          className="w-full bg-[#FFE500] text-black font-black uppercase tracking-wide py-5 text-xl border-2 border-black"
          style={{ boxShadow: '4px 4px 0 #000', letterSpacing: '0.05em' }}
        >
          PLAY AGAIN →
        </button>
      </div>
    </div>
  );
}

export default FinalResults;
