export type PetRow = {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  species: string;
  age: string;
  bio: string;
  photo_url: string | null;
  zone: string;
  zone_lat: number | null;
  zone_lng: number | null;
  owner_name: string;
  phone: string;
  whatsapp_message: string;
  verified: boolean;
};

export type PetFormInput = Omit<PetRow, "id" | "owner_id" | "photo_url"> & {
  photo_url?: string | null;
};

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
