import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string; // relative or absolute
  url?: string;
  type?: string;
}

/**
 * Lightweight SEO component to inject/update Open Graph & Twitter meta tags.
 * Falls back to /icon.svg when no image is provided. Ensures tags are updated (not duplicated) per page mount.
 */
const SEO: React.FC<SEOProps> = ({ title, description, image, url, type = 'website' }) => {
  useEffect(() => {
    const doc = document;
    const absoluteUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const siteName = 'Dhaka Plastic & Metal';
    const fallbackImg = (typeof window !== 'undefined' ? window.location.origin : '') + '/icon.svg';
    const resolvedImg = (() => {
      if (!image) return fallbackImg;
      // If already absolute (http/https), return as is
      if (/^https?:\/\//i.test(image)) return image;
      if (typeof window !== 'undefined') {
        return new URL(image, window.location.origin).toString();
      }
      return image;
    })();

    const upsertMeta = (key: string, content: string, attr: 'name' | 'property' = 'property') => {
      if (!content) return;
      let el = doc.head.querySelector<HTMLMetaElement>(`meta[${attr}='${key}']`);
      if (!el) {
        el = doc.createElement('meta');
        el.setAttribute(attr, key);
        doc.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard title & description
    if (title) doc.title = title;
    const descTag = doc.head.querySelector<HTMLMetaElement>("meta[name='description']");
    if (descTag) descTag.setAttribute('content', description);
    else {
      const m = doc.createElement('meta');
      m.name = 'description';
      m.content = description;
      doc.head.appendChild(m);
    }

    // Open Graph
    upsertMeta('og:title', title);
    upsertMeta('og:description', description);
    upsertMeta('og:image', resolvedImg);
    upsertMeta('og:url', absoluteUrl);
    upsertMeta('og:type', type);
    upsertMeta('og:site_name', siteName);

    // Twitter
    upsertMeta('twitter:card', 'summary_large_image', 'name');
    upsertMeta('twitter:title', title, 'name');
    upsertMeta('twitter:description', description, 'name');
    upsertMeta('twitter:image', resolvedImg, 'name');

  }, [title, description, image, url, type]);

  return null;
};

export default SEO;
