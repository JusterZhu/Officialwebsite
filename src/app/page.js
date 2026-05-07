import { getHomepageContent } from "@/lib/content";
import SmoothScrollHero from "@/components/SmoothScrollHero";

export default function Page() {
  const content = getHomepageContent();

  return (
    <SmoothScrollHero content={content} />
  );
}
