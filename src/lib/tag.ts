export type TagRow = {
  id: string;
  code: string;
  status: "unclaimed" | "claimed";
  pet_id: string | null;
  claimed_by: string | null;
  created_at: string;
  claimed_at: string | null;
};

export function generateTagCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}
