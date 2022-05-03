import { useEffect, useState } from "react";

export function useLoading(loadingFunc) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState();
  useEffect(reload, []);

  async function reload() {
    setLoading(true);
    try {
      setData(await loadingFunc());
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  }

  return { loading, error, data, reload };
}
