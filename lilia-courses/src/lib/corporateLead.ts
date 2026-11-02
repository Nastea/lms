import { z } from "zod";

// Schema comună formularului de contact corporate (client + server).
export const leadSchema = z.object({
  name: z.string({ error: "Scrieți numele și prenumele." }).trim().min(2, "Scrieți numele și prenumele.").max(120),
  company: z.string({ error: "Scrieți numele companiei." }).trim().min(2, "Scrieți numele companiei.").max(160),
  position: z.string().trim().max(120).optional().default(""),
  email: z.string({ error: "Scrieți adresa de email." }).trim().email("Verificați adresa de email.").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+()\d\s.-]*$/, "Numărul poate conține doar cifre, spații și +.")
    .optional()
    .default(""),
  participants: z.string().trim().max(40).optional().default(""),
  intent: z.string().trim().max(80).optional().default(""),
  challenge: z.string({ error: "Descrieți pe scurt ce observați." }).trim().min(10, "Descrieți pe scurt ce observați (cel puțin o propoziție).").max(3000),
  consent: z.literal(true, { message: "Avem nevoie de acordul dumneavoastră ca să vă putem contacta." }),
  // Anti-spam: câmp ascuns care trebuie să rămână gol + momentul în care s-a deschis formularul.
  website: z.string().max(0).optional().default(""),
  startedAt: z.number().int().positive(),
});

export type Lead = z.infer<typeof leadSchema>;

export const MIN_FILL_MS = 3000;
