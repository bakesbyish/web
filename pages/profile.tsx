import { Layout } from "@components/layout/layout";
import { Meta } from "@components/seo/metatags";
import { ReactElement } from "react";

export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Meta title="Profile" />

      <main className="flex flex-col items-center justify-center">PWA</main>
    </div>
  );
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
