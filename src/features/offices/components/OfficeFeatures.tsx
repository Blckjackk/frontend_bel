import Image from "next/image";

const FEATURES_MAP = [
  {
    label: "High Speed Wifi",
    description: "High Speed Internet",
    icon: "/assets/images/icons/wifi.svg",
  },
  {
    label: "100% Privacy",
    description: "For Yourself",
    icon: "/assets/images/icons/security-user.svg",
  },
  {
    label: "Free Move",
    description: "Anytime 24/7",
    icon: "/assets/images/icons/group.svg",
  },
  {
    label: "Sustainability",
    description: "Long-term Goals",
    icon: "/assets/images/icons/home-trend-up.svg",
  },
  {
    label: "Parking Space",
    description: "Available",
    icon: "/assets/images/icons/3dcube.svg",
  },
  {
    label: "Compact",
    description: "Good for Focus",
    icon: "/assets/images/icons/coffee.svg",
  },
];

export default function OfficeFeatures({ features }: { features: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
      {features?.map((feature) => {
        const matched = FEATURES_MAP.find((f) => f.label === feature);
        const icon = matched?.icon || "/assets/images/icons/verify.svg";
        const description = matched?.description || "Feature";

        return (
          <div key={feature} className="flex items-center gap-3.5">
            {/* Custom Icon Container */}
            <div className="w-11 h-11 bg-canvas border border-hairline flex items-center justify-center shrink-0 rounded-lg">
              <Image
                src={icon}
                className="w-5 h-5 object-contain"
                alt={`${feature} icon`}
                width={20}
                height={20}
              />
            </div>
            {/* Info details */}
            <div className="flex flex-col gap-0.5">
              <p className="font-semibold text-sm sm:text-base text-ink tracking-tight leading-tight">{feature}</p>
              <p className="text-[11px] sm:text-xs text-muted leading-tight">{description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}