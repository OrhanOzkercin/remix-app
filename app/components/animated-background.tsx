import { useEffect, useState } from "react";
import {
  Type,
  Timer,
  Percent,
  KeySquare,
  Keyboard,
  BarChart,
  Clock,
  KeyRound,
  Gamepad2,
  MousePointer,
  Hash,
  Sparkles,
  Sigma,
} from "lucide-react";

type BackgroundIcon = {
  icon: typeof Keyboard;
  size: number;
  position: {
    top: number;
    left: number;
  };
  rotation: number;
  opacity: number;
  color: string;
  animation: {
    delay: number;
    duration: number;
    translateY: number;
    rotate: number;
  };
};

const colors = [
  "rgb(var(--primary))",
  "rgb(244, 114, 182)", // pink
  "rgb(168, 85, 247)", // purple
  "rgb(59, 130, 246)", // blue
  "rgb(34, 197, 94)", // green
  "rgb(234, 179, 8)", // yellow
  "rgb(249, 115, 22)", // orange
  "rgb(239, 68, 68)", // red
];

export function AnimatedBackground() {
  const [backgroundIcons, setBackgroundIcons] = useState<BackgroundIcon[]>([]);

  useEffect(() => {
    const icons = [
      Type,
      Keyboard,
      Timer,
      KeyRound,
      Clock,
      KeySquare,
      BarChart,
      Gamepad2,
      Percent,
      MousePointer,
      Hash,
      Sparkles,
      Sigma,
    ];

    const cellSize = 120;
    const cols = Math.floor(window.innerWidth / cellSize);
    const rows = Math.floor(window.innerHeight / cellSize);

    const availablePositions = Array.from({ length: rows * cols }, (_, i) => ({
      row: Math.floor(i / cols),
      col: i % cols,
    })).sort(() => Math.random() - 0.5);

    const newIcons = availablePositions
      .slice(0, Math.min(icons.length * 2, availablePositions.length))
      .map((pos, i) => ({
        icon: icons[i % icons.length],
        size: Math.floor(Math.random() * 20) + 40,
        position: {
          top: pos.row * cellSize + Math.random() * cellSize * 0.3,
          left: pos.col * cellSize + Math.random() * cellSize * 0.3,
        },
        rotation: Math.random() * 360 ,
        opacity: Math.random() * 0.15 + 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
        animation: {
          delay: Math.random() * 5,
          duration: Math.random() * 10 + 10,
          translateY: Math.random() * 40 - 10,
          translateX: Math.random() * 30 - 10,
          rotate: Math.random() * 70 - 10,
        },
      }));

    setBackgroundIcons(newIcons);
  }, []);

  return (
    <div className="absolute inset-0">
      {backgroundIcons.map((iconData, i) => {
        const IconComponent = iconData.icon;
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={`icon-${i}`}
            className="absolute"
            style={{
              top: `${iconData.position.top}px`,
              left: `${iconData.position.left}px`,
              animation: `float-${i} ${iconData.animation.duration}s ease-in-out ${iconData.animation.delay}s infinite`,
              transform: `rotate(${iconData.rotation}deg)`,
            }}
          >
            <IconComponent
              style={{
                width: `${iconData.size}px`,
                height: `${iconData.size}px`,
                opacity: iconData.opacity,
                color: iconData.color,
              }}
            />
            <style>{`
              @keyframes float-${i} {
                0%, 100% {
                  transform: rotate(${iconData.rotation}deg) translateY(0px);
                }
                50% {
                  transform: rotate(${iconData.rotation + iconData.animation.rotate}deg) 
                            translateY(${iconData.animation.translateY}px);
                }
              }
            `}</style>
          </div>
        );
      })}
      <div className="absolute inset-0 bg-gradient-radial from-background/30 via-background/50 to-background/70 pointer-events-none" />
    </div>
  );
}
