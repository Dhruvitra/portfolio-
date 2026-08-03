import { Helmet } from 'react-helmet-async';

export function EEATSchema({ type, data }: { type: string, data: any }) {
  const basePerson = {
    "@type": "Person",
    "@id": "https://dhruvikvanol.com/#person",
    "name": "Dhruvik Vanol",
    "jobTitle": "Senior Full Stack Developer",
    "url": "https://dhruvikvanol.com",
    "sameAs": [
      "https://www.linkedin.com/in/dhruvitra-vanol-849a51321"
    ],
    "alumniOf": {
      "@type": "Organization",
      "name": "Self-Taught / Expert Programs"
    },
    "knowsAbout": ["Full Stack Development", "SEO", "MERN Stack", "Shopify", "React", "Next.js"],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Professional Certification",
        "name": "Enterprise SEO Certification"
      }
    ]
  };

  const knowledgeGraph = {
    "@type": "WebSite",
    "@id": "https://dhruvikvanol.com/#website",
    "url": "https://dhruvikvanol.com/",
    "name": "Dhruvik Vanol Portfolio",
    "publisher": { "@id": "https://dhruvikvanol.com/#person" }
  };

  const getTargetSchema = () => {
    switch (type) {
      case 'Article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "author": basePerson,
          "publisher": {
            "@type": "Organization",
            "name": "Dhruvik Vanol Web Services"
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "xpath": [
              "/html/head/title",
              "/html/head/meta[@name='description']/@content"
            ]
          },
          "about": knowledgeGraph
        };
      case 'Service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": data.title,
          "provider": basePerson,
          "description": data.description
        };
      case 'FAQPage':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.faqs.map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };
      case 'BreadcrumbList':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.breadcrumbs.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };
      default:
        return null;
    }
  };

  const schema = getTargetSchema();
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

export function AuthorProfile() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 mt-12 mb-12 shadow-sm">
      <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-widest border-b border-slate-100 pb-2">About the Author</h3>
      <div className="flex items-start gap-4 mt-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xl shrink-0">
          DV
        </div>
        <div>
          <h4 className="font-bold text-slate-800">Dhruvik Vanol</h4>
          <p className="text-xs text-slate-500 mb-2 font-mono">Senior Full Stack Developer & SEO Architect</p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Dhruvik is a highly specialized Web Developer based in Ahmedabad with expertise spanning React, Next.js, Node.js, and complex Shopify integrations. With a relentless focus on Core Web Vitals and programmatic SEO, he builds enterprise-grade applications designed to scale.
          </p>
          <div className="flex gap-2 mt-3">
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded">100/100 Core Web Vitals Expert</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded">MERN Stack Authority</span>
          </div>
        </div>
      </div>
    </div>
  );
}
