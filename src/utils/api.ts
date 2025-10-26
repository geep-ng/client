export const validateAccount = async (country: string, values: string) => {
  try {
    const res = await fetch(`/api/validate/${country.toLowerCase()}`, {
      method: "POST",
      body: JSON.stringify(values),
    });
    return await res.json();
  } catch (err) {
    return { valid: false, error: (err as Error).message };
  }
};