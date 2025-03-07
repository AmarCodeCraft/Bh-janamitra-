import { useEffect } from "react";
import { checkAppwriteConnection } from "../appwrite";
import { validateConfig } from "../config/api";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const init = async () => {
      try {
        validateConfig();
        const isConnected = await checkAppwriteConnection();
        if (!isConnected) {
          console.error("Failed to connect to Appwrite");
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    init();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
