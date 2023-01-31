import React, { useEffect, useState } from "react";
import { Provider, useSession } from "next-auth/client";
import Router, { useRouter } from "next/router";
import Layout from "../layout";
import Loader from "./loader";
import config from "../config/config";
import axios from "axios";
import { encryptName } from "helpers/encryptions";

const AuthGuard = ({ children }) => {
  const [session] = useSession();
  const [loading, setloading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (!loading && !session) {
      Router.push("/auth/signin");
      delete axios.defaults.headers.common.Authorization;
    }
    else {
      axios.defaults.headers.common.Authorization = `Bearer ${session?.user?.new_token}`;
      axios.defaults.baseURL = config?.apiGateway?.URL;
      setTimeout(() => setloading(false), 1000);


      const userId = JSON.parse(localStorage.getItem(encryptName("userId")));
      console.log(userId);
      localStorage.setItem(JSON.stringify(encryptName("userId")), session?.user?.user?.id);
      // if (userId != session?.user?.user?.id) {
      //   console.log(userId, session?.user?.user?.id);
      //   console.log(userId != session?.user?.user?.id);
      //   localStorage.clear()
      //   localStorage.setItem(JSON.stringify(encryptName("userId")), session?.user?.user?.id);
      // } else {

      //   localStorage.setItem(JSON.stringify(encryptName("userId")), session?.user?.user?.id);
      // }



    }
  }, [loading, session]);

  if ((loading || !session) && router.pathname !== "/auth/signin") {
    return <Loader />;
  }
  return (
    <Provider
      options={{
        clientMaxAge: 0,
        keepAlive: 0,
      }}
      session={session}
    // refetchInterval={5}
    // Re-fetches session when window is focused
    // refetchOnWindowFocus={true}
    >
      {!loading && session && router.pathname !== "/auth/signin" ? (
        <Layout>{children}</Layout>
      ) : (
        children
      )}
    </Provider>
  );
};
export default AuthGuard;
