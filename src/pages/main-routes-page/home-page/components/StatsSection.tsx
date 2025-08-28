const StatsSection = () => {
  const stats = [
    { number: "10M+", label: "Người dùng" },
    { number: "50M+", label: "Tin nhắn/ngày" },
    { number: "99.9%", label: "Uptime" },
    { number: "150+", label: "Quốc gia" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
