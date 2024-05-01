import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { subtitle, title } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("landing");
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>
          {t.rich("home.hero.title", {
            highlight: (chunks) => (
              <span className="text-primary">{chunks}</span>
            ),
          })}
        </h1>
        <br />
        <span>{t("home.hero.description")}</span>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          href={siteConfig.links.docs}
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
        >
          {t("home.hero.getStarted")}
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          <span>{t("home.hero.viewOnGitHub")}</span>
        </Link>
      </div>
    </section>
  );
}
