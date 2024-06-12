"use client";
import Head from "next/head";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebaseui/dist/firebaseui.css";
import { useEffect } from "react";
import useFirebaseUser from "../../hooks/useFirebaseUser";
import { useRouter } from "next/navigation";
import { Card, Icon, Title, Text, Button } from "@tremor/react";
import { ArrowUpLeftIcon, KeyIcon } from "@heroicons/react/24/outline";
import "./page.css";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: "login.thecaf.app",
  projectId: "thecaf-dotme",
  storageBucket: "thecaf-dotme.appspot.com",
  appId: "1:545159752910:web:bd66c8c0e7e0b2d0d6f49f",
};
firebase.initializeApp(firebaseConfig);

function Login() {
  const user = useFirebaseUser();
  const router = useRouter();
  useEffect(() => {
    let ui = null;
    if (user == false) {
      import("firebaseui").then((firebaseui) => {
        ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start("#firebaseui-auth-container", {
          signInOptions: [
            {
              provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              customParameters: {
                hd: "mc.edu",
                prompt: "select_account",
              },
            },
          ],
          signInSuccessUrl: "/login",
          signInFlow: "popup",
        });
      });
    } else if (user) {
      (async () => {
        const token = await user.getIdToken();
        fetch("https://thecaf.app/api/account", {
          method: "POST",
          headers: { "x-firebase-token": token },
        })
          .then((res) => {
            if (res.ok) {
              router.push("/admin");
              return null;
            } else {
              return res.json();
            }
          })
          .then((data) => {
            if (data) {
              alert(data.error);
            }
          });
      })();
    }
    return () => {
      if (ui) ui.delete();
    };
  }, [user]);

  return (
    <>
      <Head>
        <title>Account | The Caf at MC</title>
        <meta
          name="description"
          content="Sign in with your MC email to become a rating partner"
        />
        <link rel="icon" href="/icons/icon.png" />
      </Head>
      <main className="flex flex-col h-screen justify-center">
        {!user ? (
          <>
            <Card
              className="max-w-96 mx-auto text-center h-max mb-4"
              decoration="top"
            >
              <Icon
                icon={KeyIcon}
                size="xl"
                variant="outlined"
                className="mb-4"
              />
              <Title>Login to The Caf App</Title>
              <div
                id="firebaseui-auth-container"
                data-shape="rectangular"
              ></div>
              <Text className="text-sm w-2/3 m-auto">
                only administrators using their MC email address will be able to
                access the admin panel.
              </Text>
            </Card>
            <Card className="max-w-96 mx-auto text-center pb-5">
              <Button
                variant="light"
                icon={ArrowUpLeftIcon}
                onClick={() => router.push("/")}
              >
                Back to Data
              </Button>
            </Card>
          </>
        ) : (
          <>
            <Card className="max-w-96 mx-auto text-center pb-5">
              <Text color="white">Redirecting to admin...</Text>
            </Card>
          </>
        )}
      </main>
    </>
  );
}

export default Login;
