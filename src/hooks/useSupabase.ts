"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ApiResponse } from "@/types";

/**
 * Supabase'den veri çekmek için generic hook.
 * 
 * Kullanım:
 * ```tsx
 * const { data, loading, error, refetch } = useSupabaseQuery(
 *   async (supabase) => {
 *     const { data, error } = await supabase.from('users').select('*');
 *     if (error) throw error;
 *     return data;
 *   }
 * );
 * ```
 */
export function useSupabaseQuery<T>(
  queryFn: (supabase: ReturnType<typeof createClient>) => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await queryFn(supabase);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Supabase mutation (insert, update, delete) için hook.
 */
export function useSupabaseMutation<TInput, TOutput = unknown>(
  mutationFn: (
    supabase: ReturnType<typeof createClient>,
    input: TInput
  ) => Promise<TOutput>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const mutate = async (input: TInput): Promise<ApiResponse<TOutput>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(supabase, input);
      return { data: result, error: null, success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Bir hata oluştu";
      setError(message);
      return { data: null, error: message, success: false };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
