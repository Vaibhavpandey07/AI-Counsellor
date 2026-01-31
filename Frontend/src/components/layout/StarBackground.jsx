export default function StarBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#060014]">
      {/* Purple nebula glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-500/20 rounded-full blur-[120px]" />

      {/* Stars layers */}
      <div className="stars stars-sm" />
      <div className="stars stars-md" />
      <div className="stars stars-lg" />
    </div>
  );
}