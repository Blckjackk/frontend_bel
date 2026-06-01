import type { OfficeSpace } from '../types/officeSpace.types';
import { officeSpaces as seedOfficeSpaces } from '../data/officeSpaces.mock';

const STORAGE_KEY = 'provider_offices_v1';

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getInitialData(): OfficeSpace[] {
  // Start from mock data, but allow provider to CRUD locally.
  return seedOfficeSpaces;
}

function readAll(): OfficeSpace[] {
  if (typeof window === 'undefined') return getInitialData();
  const saved = safeParse<OfficeSpace[]>(window.localStorage.getItem(STORAGE_KEY));
  return Array.isArray(saved) ? saved : getInitialData();
}

function writeAll(next: OfficeSpace[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function getAllOffices(): OfficeSpace[] {
  const all = readAll();
  // Deduplicate by slug (prefer the latest occurrence).
  const map = new Map<string, OfficeSpace>();
  for (const office of all) {
    map.set(office.slug, office);
  }
  return Array.from(map.values());
}

export function getOfficeBySlug(slug: string): OfficeSpace | null {
  const all = readAll();
  return all.find((o) => o.slug === slug) ?? null;
}

export type OfficeUpsertInput = Pick<
  OfficeSpace,
  'title' | 'location' | 'address' | 'price' | 'duration' | 'about' | 'image' | 'images' | 'features' | 'tags' | 'isFullyBooked' | 'rating' | 'salesContacts'
> & {
  slug?: string;
};

export function getProviderOffices(providerId: number | string | undefined): OfficeSpace[] {
  if (!providerId) return [];
  const all = readAll();
  return all.filter((o) => String(o.providerId) === String(providerId));
}

export function createProviderOffice(providerId: number | string, input: OfficeUpsertInput): OfficeSpace {
  const all = readAll();
  const nextId = Math.max(0, ...all.map((o) => o.id)) + 1;
  const office: OfficeSpace = {
    id: nextId,
    providerId: Number(providerId),
    title: input.title,
    slug: input.slug?.trim() ? slugify(input.slug) : slugify(input.title),
    location: input.location,
    address: input.address,
    price: Number(input.price),
    duration: input.duration,
    about: input.about,
    rating: Number(input.rating ?? 4.5),
    tags: input.tags ?? [],
    image: input.image,
    images: input.images ?? [input.image],
    features: input.features ?? [],
    salesContacts: input.salesContacts ?? [],
    isFullyBooked: Boolean(input.isFullyBooked),
  };

  writeAll([...all, office]);
  return office;
}

export function updateProviderOffice(providerId: number | string, officeId: number, patch: OfficeUpsertInput): OfficeSpace | null {
  const all = readAll();
  const idx = all.findIndex((o) => o.id === officeId && String(o.providerId) === String(providerId));
  if (idx < 0) return null;

  const current = all[idx];
  const next: OfficeSpace = {
    ...current,
    title: patch.title ?? current.title,
    slug: patch.slug?.trim() ? slugify(patch.slug) : current.slug,
    location: patch.location ?? current.location,
    address: patch.address ?? current.address,
    price: patch.price != null ? Number(patch.price) : current.price,
    duration: patch.duration ?? current.duration,
    about: patch.about ?? current.about,
    rating: patch.rating != null ? Number(patch.rating) : current.rating,
    tags: patch.tags ?? current.tags,
    image: patch.image ?? current.image,
    images: patch.images ?? current.images,
    features: patch.features ?? current.features,
    salesContacts: patch.salesContacts ?? current.salesContacts,
    isFullyBooked: patch.isFullyBooked != null ? Boolean(patch.isFullyBooked) : current.isFullyBooked,
  };

  const updated = [...all];
  updated[idx] = next;
  writeAll(updated);
  return next;
}

export function deleteProviderOffice(providerId: number | string, officeId: number): boolean {
  const all = readAll();
  const before = all.length;
  const next = all.filter((o) => !(o.id === officeId && String(o.providerId) === String(providerId)));
  if (next.length === before) return false;
  writeAll(next);
  return true;
}

export function toggleProviderOfficeFullyBooked(providerId: number | string, officeId: number): OfficeSpace | null {
  const all = readAll();
  const idx = all.findIndex((o) => o.id === officeId && String(o.providerId) === String(providerId));
  if (idx < 0) return null;
  const current = all[idx];
  const next = { ...current, isFullyBooked: !current.isFullyBooked };
  const updated = [...all];
  updated[idx] = next;
  writeAll(updated);
  return next;
}

