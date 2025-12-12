import type { Metadata } from "next";
import { SITE, SEO } from "@/lib/constants";
import { env } from "@/lib/env";
import { ContactForm } from "@/components/contact/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: SEO.contact.title,
  description: SEO.contact.description,
  alternates: {
    canonical: `${SITE.url}/contact`,
  },
  openGraph: {
    title: SEO.contact.title,
    description: SEO.contact.description,
    url: `${SITE.url}/contact`,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.contact.title,
    description: SEO.contact.description,
  },
};

export default function ContactPage() {
  const siteKey = env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
        <p className="mt-2 text-muted-foreground">
          Have questions, suggestions, or partnership opportunities? We&apos;d
          love to hear from you.
        </p>
      </header>

      {siteKey ? (
        <ContactForm siteKey={siteKey} />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <AlertCircle className="size-12 text-muted-foreground" />
            <div>
              <h2 className="font-semibold">Form Unavailable</h2>
              <p className="text-sm text-muted-foreground">
                The contact form is currently not configured. Please try again
                later.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
