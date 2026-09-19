export function VoteLocked() {
  const voters = [
    { voted: true },
    { voted: true },
    { voted: true },
    { voted: false },
    { voted: true },
  ];

  return (
    <div
      className="min-h-screen w-full overflow-hidden flex flex-col items-center"
      style={{ backgroundColor: '#0D0D1F', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="w-full px-6 pt-14 pb-4">
        <p className="text-white font-black uppercase text-lg tracking-wide">ROUND 1</p>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        {/* Big checkmark */}
        <div
          className="flex items-center justify-center border-4 border-black"
          style={{
            width: 120,
            height: 120,
            backgroundColor: '#00FF85',
            boxShadow: '6px 6px 0 #fff',
          }}
        >
          <span style={{ fontSize: '4rem', color: '#000', fontWeight: 900 }}>✓</span>
        </div>

        {/* Vote locked label */}
        <div className="text-center">
          <h2
            className="font-black uppercase tracking-tight"
            style={{ fontSize: '2.5rem', color: '#fff', textShadow: '3px 3px 0 rgba(0,0,0,0.5)' }}
          >
            VOTE LOCKED
          </h2>
          <p className="font-bold mt-2 text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Waiting for everyone...
          </p>
        </div>

        {/* Player voting progress */}
        <div
          className="border-2 border-black p-5 w-full"
          style={{ backgroundColor: '#1a1a33', boxShadow: '4px 4px 0 #fff' }}
        >
          <p className="font-black uppercase text-xs tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Votes in
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {voters.map((v, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1"
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: v.voted ? '#00FF85' : 'rgba(255,255,255,0.1)',
                    border: '2px solid ' + (v.voted ? '#000' : 'rgba(255,255,255,0.3)'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: v.voted ? '#000' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {v.voted ? '✓' : '·'}
                </div>
                <span className="font-bold text-xs" style={{ color: v.voted ? '#00FF85' : 'rgba(255,255,255,0.3)' }}>
                  {v.voted ? 'VOTED' : '...'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center font-black text-sm mt-4" style={{ color: '#00FF85' }}>
            4 / 5 votes in
          </p>
        </div>

        {/* Decorative */}
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                backgroundColor: '#00FF85',
                border: '2px solid #000',
                borderRadius: '50%',
                opacity: 0.6 + i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default VoteLocked;
