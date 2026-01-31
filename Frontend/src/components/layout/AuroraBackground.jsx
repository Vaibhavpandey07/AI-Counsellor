export function AuroraBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute w-[140%] h-[140%] bg-[radial-gradient(circle_at_20%_20%,#e9d5ff,transparent_40%),radial-gradient(circle_at_80%_30%,#c7d2fe,transparent_40%),radial-gradient(circle_at_50%_80%,#fbcfe8,transparent_40%)] animate-auroraMove opacity-80" />
    </div>
  );
}