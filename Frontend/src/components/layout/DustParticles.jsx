export function DustParticles() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      {[...Array(40)].map((_, i) => (
        <span
          key={i}
          className="absolute w-[3px] h-[3px] bg-purple-400 rounded-full opacity-30 animate-dust"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
          }}
        />
      ))}
    </div>
  );
}