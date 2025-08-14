import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding - Studyflow",
};

export default function OnboardingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(0deg, #001AFF 0%, #E0E3FF 100%)" }}>
      {children}
    </div>
  );
}


