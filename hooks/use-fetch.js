import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fn = async (...args) => {
    if (isMounted.current) setLoading(true);
    if (isMounted.current) setError(null);

    try {
      const response = await cb(...args);
      if (isMounted.current) {
        setData(response);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) setError(err);
      toast.error(err.message || "An error occurred");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
