import { readFileSync } from "fs";
import { join } from "path";

type TemplateName = "welcome";

interface WelcomeTemplateData {
  logoUrl: string;
  heroImageUrl: string;
  dashboardUrl: string;
  unsubscribeUrl: string;
}

type TemplateDataMap = {
  welcome: WelcomeTemplateData;
};

const TEMPLATE_DIR = join(__dirname);

export function renderEmailTemplate<T extends TemplateName>(
  template: T,
  data: TemplateDataMap[T],
): string {
  const filePath = join(TEMPLATE_DIR, `${template}.html`);
  let html = readFileSync(filePath, "utf-8");

  for (const [key, value] of Object.entries(data)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }

  return html;
}
