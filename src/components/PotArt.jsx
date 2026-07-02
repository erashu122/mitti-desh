import { C } from "../lib/theme";

export default function PotArt({ shape = "pot", tint = C.terracotta, className = "", style, rotate = 0 }) {
  const ridge = (n, x1, x2, y0, gap, key) =>
    Array.from({ length: n }).map((_, i) => (
      <line key={key + i} x1={x1} y1={y0 + i * gap} x2={x2} y2={y0 + i * gap}
        stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
    ));

  const shapes = {
    mug: (
      <>
        <path d="M55 60 Q50 150 70 190 Q100 210 130 190 Q150 150 145 60 Z" fill={tint} />
        <path d="M145 90 Q180 90 180 125 Q180 160 145 158" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="6" />
        {ridge(4, 58, 142, 95, 22, "m")}
        <ellipse cx="100" cy="60" rx="45" ry="10" fill={C.gold} />
      </>
    ),
    pot: (
      <>
        <path d="M60 55 Q30 90 45 140 Q60 205 100 210 Q140 205 155 140 Q170 90 140 55 Z" fill={tint} />
        {ridge(5, 40, 160, 90, 22, "p")}
        <ellipse cx="100" cy="55" rx="42" ry="11" fill={C.gold} />
        <rect x="88" y="35" width="24" height="22" rx="4" fill={tint} />
      </>
    ),
    diya: (
      <>
        <path d="M35 150 Q100 200 165 150 Q150 175 100 178 Q50 175 35 150 Z" fill={tint} />
        <ellipse cx="100" cy="150" rx="65" ry="18" fill={tint} />
        <ellipse cx="100" cy="150" rx="40" ry="9" fill="currentColor" fillOpacity="0.15" />
        <path d="M100 128 Q94 108 100 95 Q106 108 100 128 Z" fill={C.gold} />
        <path d="M100 118 Q97 106 100 98 Q103 106 100 118 Z" fill="#F7C766" />
      </>
    ),
    vase: (
      <>
        <path d="M85 40 Q70 60 75 85 Q40 110 42 150 Q45 195 100 205 Q155 195 158 150 Q160 110 125 85 Q130 60 115 40 Z" fill={tint} />
        {ridge(3, 46, 154, 130, 20, "v")}
        <ellipse cx="100" cy="40" rx="18" ry="7" fill={C.gold} />
      </>
    ),
    planter: (
      <>
        <path d="M50 70 L150 70 L136 190 Q100 205 64 190 Z" fill={tint} />
        {ridge(3, 58, 142, 100, 24, "pl")}
        <ellipse cx="100" cy="70" rx="52" ry="11" fill={C.gold} />
        <path d="M78 55 Q75 25 100 15 Q125 25 122 55" fill="none" stroke={C.success} strokeWidth="6" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 200 220" className={className} style={{ color: C.charcoal, transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style }} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="200" rx="70" ry="10" fill="currentColor" fillOpacity="0.06" />
      {shapes[shape] || shapes.pot}
    </svg>
  );
}
