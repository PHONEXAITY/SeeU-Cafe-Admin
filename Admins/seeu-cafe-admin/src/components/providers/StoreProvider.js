"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect, useState } from "react";

export default function StoreProvider({ children }) {
  const [storeReady, setStoreReady] = useState(false);

  useEffect(() => {
    setStoreReady(true);
  }, []);

  if (!storeReady) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        กำลังโหลด...
      </div>
    );
  }

  return <Provider store={store}>{children}</Provider>;
}
