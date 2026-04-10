import { HomeHero } from "./_page/home-hero";
import { HomeFeatures } from "./_page/home-features";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-16 lg:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <HomeHero />
        <HomeFeatures />
      </div>
    </main>
  );
}
