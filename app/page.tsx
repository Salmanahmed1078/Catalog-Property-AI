"use client";
import dynamic from "next/dynamic";
import Loading from "./loading";

const HomePageComponent = dynamic(() => import("../components/HomePageComponent"), {
  ssr: false,
  loading: () => <Loading/>, // Optional: fallback while loading
});

export default function Page() {
  return <HomePageComponent />;
}
