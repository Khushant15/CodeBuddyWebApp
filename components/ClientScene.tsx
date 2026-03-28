"use client";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

export default function ClientScene() {
  return <Scene3D />;
}
