import { useState, useEffect } from 'react';

/**
 * Hook personalizado para implementar debounce en valores
 * @param value Valor que queremos hacer debounce
 * @param delay Tiempo en milisegundos para esperar antes de actualizar el valor
 * @returns El valor después del debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configurar el temporizador para actualizar el valor después del delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el temporizador anterior si el valor cambia antes del delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 