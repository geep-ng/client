"use client";

import React, { useState } from "react";
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { schema } from "@/utils/schema";
import { validateAccount } from "@/utils/api";
import CountrySelect from "./CountrySelect";
import CurrencySelect from "./CurrencySelect";
import AmountInput from "./AmountInput";
import BankSelect from "./BankSelect";
import DynamicFields from "./DynamicFields";
import ReceiverFields from "./ReceiverFields";
import SubmitButton from "./SubmitButton";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { getBanksForCountry } from "@/components/data/banks";
import { COUNTRIES } from "@/components/data/COUNTRIES";
// import { set } from "zod";

const TransferForm: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methods = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      sourceCountry: "NG",
      destinationCountry: "",
      amount: 0,
      currency: "",
      bankCode: "",
      receiverName: "",
      receiverEmail: "",
      receiverPhone: "",
      narration: "",
      accountNumber: "",
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;
  const router = useRouter()

  const destinationCountry = watch("destinationCountry");
  const receivingCurrency = COUNTRIES.find(
    (c) => c.value === destinationCountry
  )?.currency;

  const sourceCurrency = COUNTRIES.find(
    (c) => c.value === methods.getValues("sourceCountry")
  )?.currency;

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendingData, setPendingData] = useState<any | null>(null);

  const bankName = getBanksForCountry(destinationCountry).find(
    (b) => b.code === methods.getValues("bankCode") || b.id === methods.getValues("bankCode")
  )?.name;


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    const result = await validateAccount(data.destinationCountry, data);

    if (result.success) {
      methods.setValue("receiverName", result.data.account_name);
      toast.success("Account validated and receiver name fetched");

      setPendingData({ ...data, receiverName: result.data.account_name, currency: receivingCurrency, sourceCurrency });
      setShowModal(true);
    } else {
      toast.error("Account validation failed", {
        description: result.error || "Try again",
      });
    }
  };

  

  const createPaymentSession = async () => {
    if (!pendingData) return;

    setLoading(true);

    try {
      // Replace with your API call to send money
      console.log(pendingData)
      const res = await axiosInstance.post("/transaction/create-payment-session", pendingData);

      const sessionId = res.data.sessionId;
      router.push(`/app/payment/${String(pendingData.sourceCountry).toLowerCase()}?sessionId=${sessionId}`);

      toast.success("Transaction sent successfully!");
      setShowModal(false);
    } catch (err) {
      toast.error("Error sending transaction", {
        description: (err as Error).message,
      });
    } finally {
        setLoading(false);
    }
  };



  return (
    <div className="max-w-2xl mx-auto p-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 z-20 bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 transition-all"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Send Money
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Fill in the details below to complete your transfer.
          </p>

          <div className="space-y-6">
            <CountrySelect />
            {destinationCountry && (
              <CurrencySelect destinationCountry={destinationCountry} />
            )}
            <AmountInput />
            {destinationCountry && (
              <BankSelect destinationCountry={destinationCountry} />
            )}
            {destinationCountry && (
              <DynamicFields destinationCountry={destinationCountry} />
            )}
            <ReceiverFields destinationCountry={destinationCountry} />
          </div>

          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </FormProvider>

      {/* Confirmation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transaction</DialogTitle>
            <DialogDescription>
              Please review the details before sending money.
            </DialogDescription>
          </DialogHeader>

          {pendingData && (
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>Amount:</strong> {pendingData.amount}{" "}
                {pendingData.currency}
              </p>
              <p>
                <strong>Bank:</strong> {bankName || pendingData.bankCode}
              </p>
              <p>
                <strong>Account Number:</strong> {pendingData.accountNumber}
              </p>
              <p>
                <strong>Receiver:</strong> {pendingData.receiverName}
              </p>
              {pendingData.receiverEmail && (
                <p>
                  <strong>Email:</strong> {pendingData.receiverEmail}
                </p>
              )}
              {pendingData.receiverPhone && (
                <p>
                  <strong>Phone:</strong> {pendingData.receiverPhone}
                </p>
              )}
              {pendingData.narration && (
                <p>
                  <strong>Narration:</strong> {pendingData.narration}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button onClick={createPaymentSession} disabled={loading} type="button">
              Confirm & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransferForm;
