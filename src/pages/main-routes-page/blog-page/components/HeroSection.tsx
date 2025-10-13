export function HeroSection() {
  return (
    <div className="border-b border-purple-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: "url(/blog-wallpaper.png)",
          backgroundSize: "400px 400px",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance">
          Discover Our Blog
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl text-pretty">
          Insights, tutorials, and stories about modern communication and
          technology.
        </p>
      </div>
    </div>
  );
}
