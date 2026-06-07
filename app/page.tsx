import { Hero } from "@/components/hero";
import {
  Collections,
  FeaturedProducts,
  Manifesto,
} from "@/components/home-sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Manifesto />
      <Collections />
    </>
  );
}
