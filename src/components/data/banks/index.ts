import { ghanaBankData } from "./ghana";
import { rwandaBankData } from "./rwanda";
import { nigeriaBankData } from "./nigeria";
import { southAfricaBankData } from "./south-africa";
import { coteDivoireBankData } from "./cote-d-ivoire";
import { egyptBankData } from "./egypt";
import { kenyaBankData } from "./kenya";
// import { usaBankData } from "./banks/usa"; // if present

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BANKS_MAP: Record<string, any[]> = {
  GH: ghanaBankData,
  RW: rwandaBankData,
  NG: nigeriaBankData,
  ZA: southAfricaBankData,
  CI: coteDivoireBankData,
  EG: egyptBankData,
  KE: kenyaBankData,
//   US: usaBankData,
  // ...add or adapt codes
};

export const COUNTRIES = [
  { value: "NG", label: "Nigeria", currency: "NGN", phoneCode: "+234" },
  { value: "GH", label: "Ghana", currency: "GHS", phoneCode: "+233" },
  { value: "RW", label: "Rwanda", currency: "RWF", phoneCode: "+250" },
  { value: "ZA", label: "South Africa", currency: "ZAR", phoneCode: "+27" },
  { value: "CI", label: "Côte d’Ivoire", currency: "XOF", phoneCode: "+225" },
  { value: "EG", label: "Egypt", currency: "EGP", phoneCode: "+20" },
  { value: "US", label: "USA", currency: "USD", phoneCode: "+1" },
  { value: "KE", label: "Kenya", currency: "KES", phoneCode: "+254" },
  // add UK/CA etc if you need them
];

export function getBanksForCountry(countryCode: string) {
  // Normalize code: accept 'Ghana' or 'GH'
  const normalized = countryCode.length === 2 ? countryCode.toUpperCase() : countryCodeToCode(countryCode);
  return BANKS_MAP[normalized] ?? [];
}

function countryCodeToCode(nameOrCode: string): string {
  // small helper: if given full name map to code (simple map); expand if needed
  const map: Record<string, string> = {
    Ghana: "GH",
    Rwanda: "RW",
    Nigeria: "NG",
    "South Africa": "ZA",
    "Côte d’Ivoire": "CI",
    Egypt: "EG",
    USA: "US",
    "United States": "US",
  };
  return map[nameOrCode] ?? nameOrCode.toUpperCase();
}