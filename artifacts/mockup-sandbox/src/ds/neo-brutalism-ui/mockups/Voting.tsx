export function Voting() {
  return (
    <div
      className="min-h-screen w-full overflow-hidden flex flex-col"
      style={{ backgroundColor: '#0D0D1F', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        <p className="text-white font-black uppercase text-lg tracking-wide">ROUND 1</p>
        <h2
          className="font-black uppercase leading-tight mt-1"
          style={{ fontSize: '1.6rem', color: '#FFE500', textShadow: '3px 3px 0 #000' }}
        >
          WHICH RESPONSE IS BETTER?
        </h2>
      </div>

      {/* Card A */}
      <div className="px-6 flex flex-col gap-4 flex-1">
        <div
          className="border-2 border-black overflow-hidden"
          style={{ backgroundColor: '#FFF9E8', boxShadow: '4px 4px 0 #000' }}
        >
          <div className="flex items-start gap-4 p-5">
            <span
              className="font-black leading-none"
              style={{ fontSize: '4rem', color: '#FF3DBA', lineHeight: 1 }}
            >
              A
            </span>
            <div className="flex-1">
              <p className="font-black text-black text-2xl leading-snug mt-2">
                "Last two hours."
              </p>
              <p className="font-bold text-sm mt-1" style={{ color: '#888' }}>
                — Anonymous
              </p>
            </div>
          </div>
          <button
            className="w-full font-black uppercase tracking-wide py-4 text-base border-t-2 border-black text-black"
            style={{ backgroundColor: '#FF3DBA', letterSpacing: '0.08em' }}
          >
            TAP TO VOTE ↑
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div style={{ flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <span className="text-white font-black text-xl">OR</span>
          <div style={{ flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Card B */}
        <div
          className="border-2 border-black overflow-hidden"
          style={{ backgroundColor: '#FFF9E8', boxShadow: '4px 4px 0 #000' }}
        >
          <div className="flex items-start gap-4 p-5">
            <span
              className="font-black leading-none"
              style={{ fontSize: '4rem', color: '#3DFFFF', lineHeight: 1 }}
            >
              B
            </span>
            <div className="flex-1">
              <p className="font-black text-black text-2xl leading-snug mt-2">
                "My entire afternoon."
              </p>
              <p className="font-bold text-sm mt-1" style={{ color: '#888' }}>
                — Anonymous
              </p>
            </div>
          </div>
          <button
            className="w-full font-black uppercase tracking-wide py-4 text-base border-t-2 border-black text-black"
            style={{ backgroundColor: '#3DFFFF', letterSpacing: '0.08em' }}
          >
            TAP TO VOTE ↑
          </button>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="px-6 pb-10 pt-4">
        <p className="text-center font-bold text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          You can't vote for yourself
        </p>
      </div>
    </div>
  );
}

export default Voting;
