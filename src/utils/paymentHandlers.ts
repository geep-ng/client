import axiosInstance from "@/utils/axiosInstance";

export const initializePayment = async (country: string, sessionId: string) => {
  switch (country.toLowerCase()) {
    case "ng": // Nigeria
    case "gh": // Ghana
    case "ke": // Kenya
    case "za": // South Africa
    case "tz": // Tanzania
    case "ug": // Uganda
    case "rw": // Rwanda
      return initPaystack(sessionId);

    case "us":
      return initStripe(sessionId);

    case "eu":
      return initAdyen(sessionId);

    default:
      throw new Error(`Unsupported payment country: ${country}`);
  }
};

const initPaystack = async (sessionId: string) => {
  const res = await axiosInstance.post("/transaction/initialize-payment", { sessionId });
  const { authorization_url } = res.data;
  if (!authorization_url) throw new Error("Paystack URL not received");
  window.location.href = authorization_url;
};

const initStripe = async (sessionId: string) => {
  const res = await axiosInstance.post("/order/api/stripe-payment", { sessionId });
  const { checkoutUrl } = res.data;
  if (!checkoutUrl) throw new Error("Stripe URL not received");
  window.location.href = checkoutUrl;
};

const initAdyen = async (sessionId: string) => {
  const res = await axiosInstance.post("/order/api/adyen-payment", { sessionId });
  const { redirectUrl } = res.data;
  if (!redirectUrl) throw new Error("Adyen URL not received");
  window.location.href = redirectUrl;
};