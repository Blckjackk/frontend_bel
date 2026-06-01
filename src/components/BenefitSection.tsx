export default function BenefitSection() {
  const benefits = [
    {
      title: "Privacy-First Design",
      desc: "Solusi ruangan privat dengan tingkat keamanan data dan privasi kerja terjamin untuk ketenangan tim Anda.",
      icon: "/assets/images/icons/security-user.svg",
    },
    {
      title: "Easy Move Access",
      desc: "Proses sewa instan dan fleksibel. Pindah dan langsung mulai bekerja tanpa hambatan birokrasi.",
      icon: "/assets/images/icons/group.svg",
    },
    {
      title: "Flexibility Spaces",
      desc: "Pilihan ukuran ruang kerja yang beragam, sangat mudah disesuaikan dengan skala tim yang berkembang.",
      icon: "/assets/images/icons/3dcube.svg",
    },
    {
      title: "Top-Rated Office",
      desc: "Seluruh lokasi kantor memiliki akreditasi tinggi dan dinilai sangat positif oleh komunitas startup.",
      icon: "/assets/images/icons/cup.svg",
    },
    {
      title: "Extra Snacks Available",
      desc: "Fasilitas pelengkap premium seperti kafe mini dengan suplai teh, kopi, dan camilan gratis setiap hari.",
      icon: "/assets/images/icons/coffee.svg",
    },
    {
      title: "Sustain for Business",
      desc: "Infrastruktur penunjang bisnis yang matang untuk menjamin stabilitas dan skalabilitas jangka panjang.",
      icon: "/assets/images/icons/home-trend-up.svg",
    },
  ];

  return (
    <section
      id="Benefits"
      className="w-full bg-canvas border-b border-hairline py-16 sm:py-20 md:py-24"
    >
      <div className="max-w-[1130px] mx-auto px-4 sm:px-6 xl:px-0">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-12 text-start">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Keunggulan Kami</span>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
            Mengapa Memilih Layanan Ruang Kerja OfficeHub?
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-[600px]">
            Kami menghadirkan standar kenyamanan dan fleksibilitas baru untuk mendukung karir dan operasional bisnis Anda.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white border border-hairline rounded-xl p-6 flex flex-col gap-4 shadow-sm premium-transition hover:border-primary/40 hover:-translate-y-1"
            >
              {/* Icon Frame */}
              <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-lg bg-canvas border border-hairline text-primary">
                <img src={benefit.icon} className="w-6 h-6" alt={benefit.title} />
              </div>
              
              {/* Text Info */}
              <div className="flex flex-col gap-1.5">
                <h3 className="font-semibold text-ink text-base tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}