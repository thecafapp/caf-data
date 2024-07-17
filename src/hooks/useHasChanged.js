import { useRef, useEffect } from "react";

const useHasChanged = (val) => {
  const prevVal = usePrevious(val);
  return prevVal !== val;
};

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default useHasChanged;

export { usePrevious };
