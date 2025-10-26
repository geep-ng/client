import { NextResponse } from "next/server";

// export const POST = async (req) => {

//     const { transactionId } = await req.json();
//     try {
//       console.log(transactionId)
//         const flutterwaveRes = await fetch(
//             `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
//             {
//               method: 'GET',
//               headers: {
//                 Authorization: `Bearer FLWSECK-39cc7683d231c4d18890ab199cb67f1d-18cf9942a62vt-X`, // Use environment variable for security
//                 'Content-Type': 'application/json',
//               },
//             }
//           );

//           const data = await flutterwaveRes.json();
//           if (!flutterwaveRes.ok) {
//             return new NextResponse(JSON.stringify(flutterwaveRes.status), {status: 400});
//           }


//         return new NextResponse(JSON.stringify(data), {status: 200})

//     } catch (error) {
//         return new NextResponse("Error in getting data" + error, {status: 500} )
//     }
// }


export const POST = async (req) => {
  const { transactionRef } = await req.json();

  try {
    //   console.log(transactionRef);

      // Paystack verification endpoint
      const paystackRes = await fetch(
          `https://api.paystack.co/transaction/verify/${transactionRef}`,
          {
              method: "GET",
              headers: {
                  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Use an environment variable for security
                  "Content-Type": "application/json",
              },
          }
      );

      const data = await paystackRes.json();

      if (!paystackRes.ok || data.status !== true) {
          return new NextResponse(JSON.stringify({ error: data.message }), { status: 400 });
      }

      return new NextResponse(JSON.stringify(data.data), { status: 200 });

  } catch (error) {
      return new NextResponse(JSON.stringify({ error: "Error verifying payment", details: error.message }), { status: 500 });
  }
};