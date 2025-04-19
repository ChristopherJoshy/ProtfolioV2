import { useState, useEffect } from 'react';
import { FirebaseError } from 'firebase/app';

/**
 * A custom hook to fetch data from Firebase with better error handling
 * @param fetchFunction The function to fetch data from Firebase
 * @param fallbackData Default data to use if the fetch fails
 * @returns An object with data, loading state, and error
 */
export function useFirebaseData<T>(
  fetchFunction: () => Promise<T>,
  fallbackData: T
) {
  const [data, setData] = useState<T>(fallbackData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchFunction();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        
        // Handle specific Firebase errors
        if (err instanceof FirebaseError) {
          if (err.code === 'failed-precondition') {
            setError('Firebase database not initialized. Please ensure Firestore is set up correctly.');
          } else {
            setError(`Firebase error: ${err.message}`);
          }
        } else {
          setError('An unknown error occurred while fetching data');
        }
        
        // Keep the fallback data
        setData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction, fallbackData]);

  return { data, isLoading, error };
}