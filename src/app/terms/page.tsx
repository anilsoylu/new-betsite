import type { Metadata } from "next";
import { SITE, SEO } from "@/lib/constants";

export const metadata: Metadata = {
  title: SEO.terms.title,
  description: SEO.terms.description,
  alternates: {
    canonical: `${SITE.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">
          Last updated: December 10, 2025
        </p>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            Acceptance of Terms
          </h2>
          <p>
            By accessing and using {SITE.name}, you accept and agree to be bound
            by the terms and conditions of this agreement. If you do not agree
            to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">Use of Service</h2>
          <p>
            {SITE.name} provides football statistics, live scores, fixtures,
            standings, and related information. This service is provided for
            informational and entertainment purposes only. We do not guarantee
            the accuracy, completeness, or timeliness of any information
            provided.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">User Conduct</h2>
          <p>Users agree not to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Use the service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the service</li>
            <li>
              Scrape or collect data from the service without permission
            </li>
            <li>Use automated systems to access the service excessively</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            Intellectual Property
          </h2>
          <p>
            All content on {SITE.name}, including text, graphics, logos, and
            software, is the property of {SITE.name} or its content suppliers
            and is protected by copyright and other intellectual property laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">Disclaimer</h2>
          <p>
            The information provided on {SITE.name} is for general informational
            purposes only. We make no warranties about the accuracy,
            completeness, or reliability of any information on this site. Any
            reliance you place on such information is strictly at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            Limitation of Liability
          </h2>
          <p>
            {SITE.name} shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages resulting from your use
            of or inability to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">Changes to Terms</h2>
          <p>
            We may revise these terms at any time without notice. By continuing
            to use {SITE.name} after revisions become effective, you agree to be
            bound by the revised terms.
          </p>
        </section>
      </div>
    </main>
  );
}
