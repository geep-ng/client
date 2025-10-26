export const countryFieldRules: Record<
  string,
  { name: string; label: string; placeholder: string; type?: string }[]
> = {
  NG: [
    { name: "accountNumber", label: "Account Number", placeholder: "0123456789" },
  ],
  GH: [
    { name: "accountNumber", label: "Account Number", placeholder: "0123456789" },
  ],
  RW: [
    { name: "accountNumber", label: "Account Number", placeholder: "123456" },
  ],
  ZA: [
    { name: "accountNumber", label: "Account Number", placeholder: "1234567890" },
    { name: "branchCode", label: "Branch Code", placeholder: "12345" },
  ],
  US: [
    { name: "routingNumber", label: "Routing Number", placeholder: "123456789" },
    { name: "accountNumber", label: "Account Number", placeholder: "0123456789" },
  ],
  UK: [
    { name: "sortCode", label: "Sort Code", placeholder: "12-34-56" },
    { name: "accountNumber", label: "Account Number", placeholder: "01234567" },
  ],
};