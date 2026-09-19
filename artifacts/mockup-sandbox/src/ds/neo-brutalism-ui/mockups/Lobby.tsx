export function Lobby() {
  const players = [
    { name: 'Amogh', you: true, joined: true },
    { name: 'Priya', you: false, joined: true },
    { name: 'Rahul', you: false, joined: true },
    { name: 'Sarah', you: false, joined: true },
    { name: 'Waiting...', you: false, joined: false },
  ];

  return (
    <div
      className="min-h-screen w-full overflow-hidden flex flex-col"
      style={{ backgroundColor: '#0D0D1F', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header section */}
      <div className="px-6 pt-14 pb-4">
        <h1
          className="font-black uppercase tracking-tight leading-none"
          style={{ fontSize: '3.5rem', color: '#FFE500', textShadow: '4px 4px 0 #000' }}
        >
          BOARD<br />ROOM
        </h1>
        <p className="text-white font-bold italic text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Nobody knows why we're here.
        </p>
      </div>

      {/* Room code */}
      <div className="px-6 mb-4">
        <div
          className="flex items-center justify-between border-2 border-black p-3"
          style={{ backgroundColor: '#1a1a33', boxShadow: '4px 4px 0 #fff' }}
        >
          <div>
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>Meeting ID</p>
            <p className="text-white font-black text-2xl tracking-[0.2em]">7FKP</p>
          </div>
          <button
            className="font-black uppercase text-sm border-2 border-black px-4 py-2"
            style={{ backgroundColor: '#FFF9E8', color: '#000', boxShadow: '3px 3px 0 #fff', letterSpacing: '0.05em' }}
          >
            COPY LINK
          </button>
        </div>

        {/* Player count */}
        <p className="font-black uppercase text-sm mt-3 tracking-wide" style={{ color: '#FF3DBA' }}>
          ● 4 / 8 PEOPLE IN
        </p>
      </div>

      {/* Player list card */}
      <div className="px-6 flex-1">
        <div
          className="border-2 border-black"
          style={{ backgroundColor: '#FFF9E8', boxShadow: '4px 4px 0 #fff' }}
        >
          <div className="px-4 py-2 border-b-2 border-black">
            <p className="font-black uppercase text-xs tracking-widest text-black">Players</p>
          </div>
          {players.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: i < players.length - 1 ? '1px solid rgba(0,0,0,0.15)' : 'none' }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: p.joined ? '#00FF85' : '#888',
                  border: '2px solid #000',
                }}
              />
              <span
                className="font-bold text-base flex-1"
                style={{ color: p.joined ? '#000' : '#999' }}
              >
                {p.name}
              </span>
              {p.you && (
                <span
                  className="font-black uppercase text-xs px-2 py-0.5 border border-black"
                  style={{ backgroundColor: '#FFE500', color: '#000' }}
                >
                  YOU
                </span>
              )}
            </div>
          ))}
        </div>

        {/* How to play */}
        <div
          className="mt-4 border-2 border-black p-4"
          style={{ backgroundColor: '#FFF9E8', boxShadow: '4px 4px 0 #fff' }}
        >
          <p className="font-black uppercase text-xs tracking-widest text-black mb-2">How to play</p>
          <p className="font-bold text-sm text-black leading-relaxed">
            Answer the prompt.<br />
            Vote for your favourite.<br />
            Win points. Cause problems.
          </p>
        </div>
      </div>

      {/* Sticky bottom */}
      <div className="px-6 pb-10 pt-4">
        <button
          className="w-full bg-[#FFE500] text-black font-black uppercase tracking-wide py-5 text-xl border-2 border-black"
          style={{ boxShadow: '4px 4px 0 #000', letterSpacing: '0.05em' }}
        >
          START MEETING →
        </button>
      </div>
    </div>
  );
}

export default Lobby;
