import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AdminPanelPage from './components/AdminPanelPage';
import CaseStudyPage from './components/CaseStudyPage';
import BlogList from './components/BlogList';
import BlogPage from './components/BlogPage';
import DynamicContentPage from './components/DynamicContentPage';
import { StickyCTA, ExitIntentPopup } from './components/CRO';

// Lazy load below-the-fold components for extreme Performance / Core Web Vitals optimization
const TrustBar = lazy(() => import('./components/TrustBar'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Services = lazy(() => import('./components/Services'));
const Projects = lazy(() => import('./components/Projects'));
const Timeline = lazy(() => import('./components/Timeline'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const GitHubSection = lazy(() => import('./components/GitHubSection'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [loading, setLoading] = useState(
    window.location.pathname !== '/adminpanal' && window.location.pathname !== '/adminpanel'
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    
    // Patch pushState so we capture internal SPA link navigations cleanly
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Standalone Admin Panel Page routing rule
  if (currentPath === '/adminpanal' || currentPath === '/adminpanel') {
    return <AdminPanelPage />;
  }

  // Standalone Case Study Page routing rule (Legacy fallback)
  const caseStudyMatch = currentPath.match(/^\/case-study\/([^\/]+)/);
  if (caseStudyMatch) {
    const projectId = caseStudyMatch[1];
    return <CaseStudyPage projectId={projectId} />;
  }

  // Programmatic SEO Routes
  if (currentPath === '/blog') {
    return (
      <Suspense fallback={<LoadingScreen onComplete={() => {}} />}>
        <Navbar onContactClick={scrollToContact} />
        <BlogList />
        <Footer />
      </Suspense>
    );
  }

  const blogMatch = currentPath.match(/^\/blog\/([^\/]+)/);
  if (blogMatch) {
    return (
      <Suspense fallback={<LoadingScreen onComplete={() => {}} />}>
        <Navbar onContactClick={scrollToContact} />
        <BlogPage slug={blogMatch[1]} />
        <Footer />
      </Suspense>
    );
  }

  const servicesMatch = currentPath.match(/^\/services\/([^\/]+)/);
  if (servicesMatch) {
    return (
      <Suspense fallback={<LoadingScreen onComplete={() => {}} />}>
        <Navbar onContactClick={scrollToContact} />
        <DynamicContentPage slug={servicesMatch[1]} type="services" />
        <Footer />
      </Suspense>
    );
  }

  const locationMatch = currentPath.match(/^\/location\/([^\/]+)/);
  if (locationMatch) {
    return (
      <Suspense fallback={<LoadingScreen onComplete={() => {}} />}>
        <Navbar onContactClick={scrollToContact} />
        <DynamicContentPage slug={locationMatch[1]} type="locations" />
        <Footer />
      </Suspense>
    );
  }

  const newCaseStudyMatch = currentPath.match(/^\/case-studies\/([^\/]+)/);
  if (newCaseStudyMatch) {
    return (
      <Suspense fallback={<LoadingScreen onComplete={() => {}} />}>
        <Navbar onContactClick={scrollToContact} />
        <DynamicContentPage slug={newCaseStudyMatch[1]} type="case-studies" />
        <Footer />
      </Suspense>
    );
  }

  const authorityMatch = currentPath.match(/^\/authority\/([^\/]+)/);
  if (authorityMatch) {
    return (
      <Suspense fallback={<LoadingScreen onComplete={() => {}} />}>
        <Navbar onContactClick={scrollToContact} />
        <DynamicContentPage slug={authorityMatch[1]} type="authority" />
        <Footer />
      </Suspense>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://dhruvikvanol.com/#person",
        "name": "Dhruvik Vanol",
        "url": "https://dhruvikvanol.com",
        "jobTitle": "Senior Full Stack Developer",
        "worksFor": {
          "@type": "Organization",
          "name": "Freelance"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://dhruvikvanol.com/#website",
        "url": "https://dhruvikvanol.com",
        "name": "Dhruvik Vanol | Full Stack Developer",
        "publisher": {
          "@id": "https://dhruvikvanol.com/#person"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://dhruvikvanol.com/#localbusiness",
        "name": "Dhruvik Vanol Web Development",
        "image": "https://dhruvikvanol.com/og-image.jpg",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ahmedabad",
          "addressRegion": "Gujarat",
          "addressCountry": "IN"
        },
        "priceRange": "$$",
        "telephone": "+91XXXXXXXXXX"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Dhruvik Vanol | Premium Full-Stack & Shopify Developer in Ahmedabad</title>
        <meta name="description" content="Dhruvik Vanol is an expert Full Stack Developer, Next.js Developer, and Shopify Expert in Ahmedabad, India. I build enterprise-grade React, MERN, and Shopify applications." />
        <meta name="keywords" content="Full Stack Developer, Next.js Developer, React Developer, Node.js Developer, NestJS Developer, Shopify Developer, Shopify Expert, AI Automation Developer, n8n Developer, MERN Stack Developer, Web Developer India, Full Stack Developer India, Freelance Full Stack Developer, Freelance Shopify Developer, Ahmedabad Web Developer" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Dhruvik Vanol | Premium Full-Stack Developer" />
        <meta property="og:description" content="Expert Full Stack Developer and Shopify Expert in Ahmedabad, India." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dhruvikvanol.com" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dhruvik Vanol | Premium Full-Stack Developer" />
        <meta name="twitter:description" content="Expert Full Stack Developer and Shopify Expert in Ahmedabad, India." />

        {/* Canonical */}
        <link rel="canonical" href="https://dhruvikvanol.com/" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Supreme loading intro animation */}
      <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main Portfolio Core Flow */}
      {!loading && (
        <motion.div
          id="root-portfolio-container"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-screen bg-white text-primary"
        >
          {/* Glass header floating navigations */}
          <Navbar onContactClick={scrollToContact} />

          {/* Core main visual landing pages */}
          <main>
            <Hero 
              onContactClick={scrollToContact} 
              onViewWorkClick={scrollToProjects} 
            />
            
            <Suspense fallback={<div className="h-32 flex items-center justify-center">Loading...</div>}>
              <TrustBar />
              <About />
              <Skills />
              <Services />
              <Projects />
              <Timeline />
              <Testimonials />
              <GitHubSection />
              <Contact />
            </Suspense>
          </main>

          {/* High end visual footer layouts */}
          <Suspense fallback={null}>
            <Footer />
          </Suspense>

          <StickyCTA />
          <ExitIntentPopup />
        </motion.div>
      )}
    </>
  );
}
