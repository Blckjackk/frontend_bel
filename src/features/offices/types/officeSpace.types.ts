export type OfficeSpace = {
    id: number;
    title: string;
    slug: string;
    price: number;
    duration: string;
    address: string; 
    about: string;
    location: string;
    rating: number;
    tags: string[];
    image: string;
    images: string[];
    features: string[];
    salesContacts: salesContact[];
    isFullyBooked: boolean;
    providerId?: number;
};

export type salesContact = {
    name: string;
    role: string;
    photo: string;
    email: string;
    phone: string;
};

export type Contact = {
    name: string;
    role: string;
    photo: string;
    email: string;
    phone: string;
}

export function mapOfficeDtoToOfficeSpace(dto: any): OfficeSpace {
  if (!dto) return {} as OfficeSpace;

  // Defensive parse for sales_contacts — TypeORM simple-json can return
  // a pre-parsed array OR a JSON string depending on the MySQL driver version
  let salesContacts: salesContact[] = [];
  try {
    const raw = dto.sales_contacts ?? dto.salesContacts;
    if (Array.isArray(raw)) {
      salesContacts = raw;
    } else if (typeof raw === 'string' && raw.trim().startsWith('[')) {
      salesContacts = JSON.parse(raw);
    }
  } catch {
    salesContacts = [];
  }

  return {
    id: dto.id,
    title: dto.name,
    slug: dto.slug,
    price: Number(dto.price),
    duration: dto.duration_type || "monthly",
    address: dto.address,
    about: dto.about,
    location: dto.city?.name || dto.location || "Indonesia",
    rating: Number(dto.rating || 4.5),
    tags: dto.is_full_booked ? ["Fully Booked"] : ["Popular"],
    image: dto.thumbnail || dto.image || "/assets/images/thumbnails/thumbnails-1.png",
    images: Array.isArray(dto.images) && dto.images.length > 0 
      ? dto.images.map((i: any) => typeof i === 'string' ? i : i.image_path)
      : [dto.thumbnail || dto.image || "/assets/images/thumbnails/thumbnails-1.png"],
    features: Array.isArray(dto.features) 
      ? dto.features.map((f: any) => typeof f === 'string' ? f : f.name)
      : [],
    salesContacts,
    isFullyBooked: Boolean(dto.is_full_booked || dto.isFullyBooked),
    providerId: dto.provider_id || dto.providerId
  };
}