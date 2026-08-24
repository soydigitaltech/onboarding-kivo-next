import type { ReactNode } from "react";
import DesignSystemSidebar from "@/components/design-system/DesignSystemSidebar";

export default function DesignSystemLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <DesignSystemSidebar />

      <main className="min-h-screen lg:pl-72">
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 lg:px-14 lg:py-14">
          {children}
        </div>
      </main>
    </div>
  );
}
