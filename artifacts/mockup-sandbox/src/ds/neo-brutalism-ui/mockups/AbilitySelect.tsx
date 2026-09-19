import { useState } from 'react';

const powers = [
  {
    id: 'word',
    icon: '📝',
    title: 'USE THIS WORD',
    desc: 'Force a word into an answer.',
    cost: '1 PT',
    costColor: '#FF3DBA',
  },
  {
    id: 'persona',
    icon: '🎭',
    title: 'ANSWER AS A...',
    desc: 'Change the personality.',
    cost: '1 PT',
    costColor: '#FF3DBA',
  },
  {
    id: 'emoji',
    icon: '😂',
    title: 'EMOJI ONLY',
    desc: 'No words allowed.',
    cost: '2 PTS',
    costColor: '#FFE500',
  },
];

export function AbilitySelect() {
  const [selected, setSelected] = useState('word');

  return (
    <div
      className="min-h-screen w-full overflow-hidden flex flex-col"
      style={{ backgroundColor: '#0D0D1F', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="px-6 pt-14 pb-2">
        <h1
          className="font-black uppercase tracking-tight leading-none"
          style={{ fontSize: '3.5rem', color: '#FFE500', textShadow: '4px 4px 0 #000' }}
        >
          YOU WON.
        </h1>
        <h2
          className="font-black uppercase tracking-tight leading-none mt-1"
          style={{ fontSize: '2rem', color: '#fff' }}
        >
          NOW CAUSE PROBLEMS.
        </h2>

        <div className="flex items-center gap-3 mt-3">
          <div
            className="font-black uppercase text-sm px-3 py-1 border-2 border-black"
            style={{ backgroundColor: '#FF3DBA', color: '#000', boxShadow: '2px 2px 0 #fff' }}
          >
            +2 ABILITY POINTS
          </div>
        </div>
        <p className="text-white font-bold mt-3 text-base">Choose your power.</p>
      </div>

      {/* Power cards */}
      <div className="px-6 flex-1 flex flex-col gap-3 py-4">
        {powers.map((p) => {
          const isSelected = selected === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className="w-full text-left border-2 border-black p-4 flex items-center gap-4"
              style={{
                backgroundColor: isSelected ? '#FF3DBA' : '#FFF9E8',
                boxShadow: isSelected ? '4px 4px 0 #FF3DBA' : '4px 4px 0 #000',
                borderColor: isSelected ? '#FF3DBA' : '#000',
                outline: isSelected ? '3px solid #FF3DBA' : 'none',
                outlineOffset: '2px',
                transition: 'all 0.1s',
              }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center border-2 border-black flex-shrink-0"
                style={{
                  width: 52,
                  height: 52,
                  backgroundColor: isSelected ? '#000' : '#FFE500',
                  fontSize: '1.5rem',
                }}
              >
                {p.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <p
                  className="font-black uppercase text-base tracking-tight"
                  style={{ color: isSelected ? '#000' : '#000' }}
                >
                  {p.title}
                </p>
                <p
                  className="font-bold text-sm mt-0.5"
                  style={{ color: isSelected ? 'rgba(0,0,0,0.6)' : '#555' }}
                >
                  {p.desc}
                </p>
              </div>

              {/* Cost badge */}
              <div
                className="font-black uppercase text-xs px-2 py-1 border border-black flex-shrink-0"
                style={{
                  backgroundColor: isSelected ? '#FFE500' : p.costColor,
                  color: '#000',
                }}
              >
                {p.cost}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sticky bottom */}
      <div className="px-6 pb-10 pt-2">
        <button
          className="w-full bg-[#FFE500] text-black font-black uppercase tracking-wide py-5 text-xl border-2 border-black"
          style={{ boxShadow: '4px 4px 0 #000', letterSpacing: '0.05em' }}
        >
          USE POWER →
        </button>
      </div>
    </div>
  );
}

export default AbilitySelect;
