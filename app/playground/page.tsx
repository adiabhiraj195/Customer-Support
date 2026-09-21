"use client";

import { StatelessPlayground } from "@/components/stateless/StatelessPlayground";

export default function PlaygroundPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <StatelessPlayground />
    </div>
  );
}

