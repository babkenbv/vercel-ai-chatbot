"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/chat/${uuidv4()}`);
  }, [router]);

  return null;
}
