import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";

const HomePage = async () => {
  const t = await getTranslations("home");

  return (
    <>
      <header className="w-full border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="#" className="font-mono text-lg font-bold">
            SwiftAgent
          </Link>
        </div>
      </header>
      <section className="container mt-10 flex flex-col items-center gap-3 text-center md:absolute md:top-1/2 md:left-1/2 md:mt-0 md:-translate-x-1/2 md:-translate-y-1/2">
        <h1 className="mb-1 font-mono text-4xl leading-tight font-extrabold tracking-tighter [word-spacing:-0.5rem] md:text-5xl">
          <span className="bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent">
            SwiftAgent
          </span>
        </h1>
        <p className="text-muted-foreground max-w-2xl md:text-lg">
          {t("subtitle")}
        </p>
        <div className="mt-2 flex gap-4">
          <Link href="#" className={buttonVariants({ size: "lg" })}>
            {t("getStartedButton")}
          </Link>
          <Link
            href="https://github.com/SerendptAI/SwiftAgent"
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <Icons.github /> Github
          </Link>
        </div>
      </section>
      <footer className="text-muted-foreground absolute bottom-3 w-full text-center text-sm">
        © {new Date().getFullYear()} SwiftAgent
      </footer>
    </>
  );
};

export default HomePage;
