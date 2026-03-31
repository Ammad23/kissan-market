import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { localeCookieName } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

function isSupportedLocale(locale: string): locale is (typeof siteConfig.locales)[number] {
  return siteConfig.locales.includes(locale as (typeof siteConfig.locales)[number]);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;
  const locale =
    cookieLocale && isSupportedLocale(cookieLocale)
      ? cookieLocale
      : siteConfig.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

export { localeCookieName };
