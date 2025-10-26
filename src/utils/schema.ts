import { z } from "zod";

export const schema = z.object({
  sourceCountry: z.string().nonempty("Source country is required"),
  destinationCountry: z.string().nonempty("Destination country is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  currency: z.string().nonempty("Currency is required"),
  bankCode: z.string().nonempty("Bank is required"),
  receiverName: z.string().nonempty("Receiver name is required"),
  receiverEmail: z.string().email("Invalid email").optional(),
  receiverPhone: z.string().optional(),
  narration: z.string().optional(),
  accountNumber: z.string().nonempty("Account number is required"),
});