"use client";

import PageMessage from "@/components/PageMessage";

export const revalidate = 0; // page will not be cached

export default async function NotFound() {
  return (
    <>
      <PageMessage
        title="Account"
        description="This feature has not been implemented yet"
      />
    </>
  );
}
