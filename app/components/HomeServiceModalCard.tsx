"use client";

import { ServiceCard } from "@/app/components/ServiceCard";

type Props = {
  service: any;
};

export function HomeServiceModalCard({ service }: Props) {
  return (
    <button
      type="button"
      onClick={() => (window as any).openSignupModal?.()}
      className="w-full text-left"
    >
      <ServiceCard service={service} />
    </button>
  );
}