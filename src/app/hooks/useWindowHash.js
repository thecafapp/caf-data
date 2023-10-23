import { useState, useEffect } from "react";

export default function useWindowHash() {
  const [windowHash, setWindowHash] = useState("");
  useEffect(() => {
    function setHash() {
      setWindowHash(window.location.hash);
    }
    window.addEventListener("hashchange", setHash);
    return () => {
      window.removeEventListener("hashchange", setHash);
    };
  }, []);
  return windowHash;
}
