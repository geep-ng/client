import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// 🔑 Paystack keys (per country)
const PAYSTACK_KEYS: Record<string, string | undefined> = {
  ng: process.env.PAYSTACK_SECRET_NG, // Nigeria
  gh: process.env.PAYSTACK_SECRET_GH, // Ghana
  rw: process.env.PAYSTACK_SECRET_RW, // Rwanda
  eg: process.env.PAYSTACK_SECRET_EG, // Egypt
  za: process.env.PAYSTACK_SECRET_ZA, // South Africa
  ci: process.env.PAYSTACK_SECRET_CI, // Côte d’Ivoire
};

// 🔑 Flutterwave keys (per country template)
const FLUTTERWAVE_KEYS: Record<string, string | undefined> = {
  ke: process.env.FLW_SECRET_KE, // Kenya
  ug: process.env.FLW_SECRET_UG, // Uganda
  tz: process.env.FLW_SECRET_TZ, // Tanzania
  // add more here
};

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ country: string }> }
) {
  const { accountNumber, bankCode } = await req.json();
  const { country } = await context.params;
  const countryCode = country.toLowerCase();

  try {
    // ✅ Paystack-supported countries
    if (PAYSTACK_KEYS[countryCode]) {
      const secret = PAYSTACK_KEYS[countryCode];
      const response = await axios.get(
        `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        { headers: { Authorization: `Bearer ${secret}` } }
      );

      return NextResponse.json({ success: true, data: response.data.data });
    }

    // 🌍 Flutterwave template countries
    if (FLUTTERWAVE_KEYS[countryCode]) {
      const secret = FLUTTERWAVE_KEYS[countryCode];
      const response = await axios.post(
        `https://api.flutterwave.com/v3/accounts/resolve`,
        {
          account_number: accountNumber,
          account_bank: bankCode,
        },
        { headers: { Authorization: `Bearer ${secret}` } }
      );

      return NextResponse.json({ success: true, data: response.data.data });
    }

    // ❌ Unsupported
    return NextResponse.json(
      { success: false, message: `Country '${country}' not supported yet` },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : JSON.stringify(error);

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}