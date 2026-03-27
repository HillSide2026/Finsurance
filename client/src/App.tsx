import { useEffect } from "react";
import { buildSitePageMetadata, resolveSitePage } from "@shared/site";
import LegalPage from "@/pages/LegalPage";
import SiteHome from "@/pages/SiteHome";
import StrAssistant from "@/pages/StrAssistant";
import { Toaster } from "@/components/ui/toaster";

function setHeadValue(selector: string, value: string) {
  const element = document.head.querySelector(selector);

  if (element instanceof HTMLMetaElement) {
    element.content = value;
    return;
  }

  if (element instanceof HTMLLinkElement) {
    element.href = value;
  }
}

function App() {
  const page = resolveSitePage(window.location.pathname);

  useEffect(() => {
    const metadata = buildSitePageMetadata(page);

    document.title = metadata.title;
    setHeadValue('meta[name="description"]', metadata.description);
    setHeadValue('link[rel="canonical"]', metadata.canonicalUrl);
    setHeadValue('meta[property="og:title"]', metadata.openGraphTitle);
    setHeadValue('meta[property="og:description"]', metadata.openGraphDescription);
    setHeadValue('meta[property="og:url"]', metadata.openGraphUrl);
    setHeadValue('meta[name="twitter:title"]', metadata.twitterTitle);
    setHeadValue('meta[name="twitter:description"]', metadata.twitterDescription);
  }, [page]);

  return (
    <>
      {page === "product" ? (
        <StrAssistant />
      ) : page === "home" ? (
        <SiteHome />
      ) : (
        <LegalPage page={page} />
      )}
      <Toaster />
    </>
  );
}

export default App;
