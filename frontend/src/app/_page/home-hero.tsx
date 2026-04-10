import { HomeHeroText } from "./home-hero-text";
import { HomeHeroActions } from "./home-hero-actions";

export function HomeHero() {
  return (
    <section className="space-y-6">
      <HomeHeroText />
      <HomeHeroActions />
    </section>
  );
}