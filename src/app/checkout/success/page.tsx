"use client";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SuccessPage() {
//   const router = useRouter();
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  const transactionRef= searchParams.get('trxref')
//   const status = searchParams.get('status')

  // console.log(transactionRef, status)

  // https://quilo.live/buy/success?status=completed&tx_ref=1734583451829&transaction_id=1689775247

  useEffect(() => {
    const verifyPayment = async () => {
      setLoading(true)

        if (!transactionRef) {
            console.error('Missing transaction ID or status in search parameters.')
            toast.error('Invalid transaction parameters. Please check your link.')
            return
          }
    
          

      if (transactionRef) {
        try {
          

          const res = await axios.post(`/api/verifypayment`, {transactionRef})

          // console.log(res)

          if (res.status !== 200) {
            throw new Error(`Unexpected response status: ${res.status}`)
          }

          const paymentStatus = res.data?.status

          console.log(res)

          if(paymentStatus === 'success') {
            const response = res

            const {
                data: {
                    metadata: { billingInterval, planId, userId}
                }
            } = response

            if (!userId || !planId || !billingInterval) {
                toast.error('Missing required data')
              }

            // const saveResponse = await saveNewTicket(email, eventId, sid, response?.data)
            const saveResponse = await axiosInstance.post(`/subscription/paystack/webhook`, response.data)

            console.log(saveResponse)

            toast.success('Payment verified successfully!')

            // if (saveResponse?.status === 200) {
            //     toast.success("Your ticket is ready!");
            // } else {
            //     toast.error(`Failed to save ticket. Contact support`);
            // }

          }

          setLoading(false)

          // console.log(res)
        } catch (error) {
          console.log('Error verifying payment:', error)
          toast.error('An error occurred during payment verification.')
        } finally {
          setLoading(false)
        }
      }
    }

    verifyPayment()
  }, [transactionRef])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center p-8 rounded-xl bg-white shadow-lg">
                <h1 className="text-2xl font-bold">Verifying your payment...</h1>
                <p className="mt-2 text-gray-600">Please wait a moment.</p>
              </div>
            </div>
          );
    }


  return (
    <div className="min-h-screen flex items-center justify-center">
        
      <div className="text-center p-8 rounded-xl bg-white shadow-lg">
        <h1 className="text-2xl font-bold">Payment successful 🎉</h1>
        <p className="mt-2 text-gray-600">We’re provisioning your plan now — redirecting to your dashboard.</p>
      </div>
    </div>
  );
}
