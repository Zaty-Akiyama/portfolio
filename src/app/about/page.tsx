import { AboutPage } from "@/components/about/AboutPage";
import { readMd } from "@/utils/readMd";

export default async function Page() {
  const markdown = await readMd("about.md");

  return <AboutPage markdown={markdown} />;
}