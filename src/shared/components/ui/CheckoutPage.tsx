'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { XCircle, Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { initializePayment } from "@/utils/paymentHandlers";

type TransferSession = {
  userId: string;
  sourceCountry: string;
  destinationCountry: string;
  amount: number; // amount user entered
  currency: string; // destination currency
  bankCode: string;
  receiverName: string;
  receiverEmail: string;
  receiverPhone: string;
  narration: string;
  accountNumber: string;
  createdAt: number;
};

const Checkout = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<TransferSession | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { country: sourceCountry } = useParams(); // dynamic source country

  const sessionId = searchParams.get("sessionId");

  useEffect(() => {
    const initiatePayment = async () => {
      if (!sessionId) {
        setError("Invalid session. Please start your transfer again.");
        setLoading(false);
        return;
      }

      try {
        // 1. Verify transfer session
        const verifyRes = await axiosInstance.get(
          `/transaction/verifying-payment-session?sessionId=${sessionId}`
        );

        const sessionData: TransferSession = verifyRes.data.session;
        if (!sessionData?.amount || !sessionData?.currency) {
          throw new Error("Invalid transfer session data.");
        }

        setSession(sessionData);

        // 2. Initialize correct payment provider
        await initializePayment(sourceCountry as string, sessionId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Checkout error:", err);
        setError(
          "Something went wrong while preparing your transfer: " +
            (err.response?.data?.message || err.message)
        );
        setLoading(false);
      }
    };

    initiatePayment();
  }, [sessionId, sourceCountry]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
        <p className="ml-4 text-lg text-gray-700">
          Redirecting to payment gateway...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <div className="w-full text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="text-red-500 w-10 h-10" />
          </div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Transfer Preparation Failed
          </h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/app")}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Back to Transfer
          </button>
        </div>
      </div>
    );
  }

  if (!session) return null;

  // Fallback UI if not redirected yet
  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 my-10">
      <div className="bg-white w-full max-w-lg p-8 rounded-md shadow space-y-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Confirm Your Transfer</h2>

        <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700 space-y-2">
          <div className="flex justify-between">
            <span>Sending Country</span>
            <span>{session.sourceCountry}</span>
          </div>
          <div className="flex justify-between">
            <span>Receiving Country</span>
            <span>{session.destinationCountry}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount</span>
            <span>
              {session.amount} {session.currency}
            </span>
          </div>
          <div className="flex justify-between border-t border-t-gray-300 pt-2 font-semibold">
            <span>Recipient</span>
            <span>{session.receiverName}</span>
          </div>
          <div className="flex justify-between">
            <span>Account</span>
            <span>{session.accountNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Bank Code</span>
            <span>{session.bankCode}</span>
          </div>
        </div>

        <p className="text-gray-700">
          You will be redirected to{" "}
          {sourceCountry?.toString().toUpperCase()} payment gateway...
        </p>
        <Loader2 className="animate-spin mx-auto w-8 h-8 text-blue-500" />
      </div>
    </div>
  );
};

export default Checkout;