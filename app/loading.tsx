export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.2)]" />
        </div>
        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.4em] animate-pulse">Initializing Core...</p>
      </div>
    </div>
  );
}
