import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const CANONICAL_URL = 'https://prp-docs.nnkogift.dev';
const APP_REPO_URL = 'https://github.com/nnkogift/program-rules-playground';
const DOCS_REPO_URL = 'https://github.com/nnkogift/program-rules-playground-docs';
const FORM_UTILS_URL = 'https://github.com/nnkogift/dhis2-form-utils';

// The mirror (GitHub Pages) is built from the same source with DOCS_MIRROR=true.
// It is not indexed, points canonical links at CANONICAL_URL and ships no sitemap.
const isMirror = process.env.DOCS_MIRROR === 'true';

const config: Config = {
  title: 'Program Rules Playground',
  tagline: 'Test and debug DHIS2 program rules against real metadata',
  favicon: 'img/logo.png',

  url: process.env.DOCS_URL ?? CANONICAL_URL,
  baseUrl: process.env.DOCS_BASE_URL ?? '/',
  // Keep in sync with nginx.conf (try_files) and the GitHub Pages behaviour.
  trailingSlash: false,

  organizationName: 'nnkogift',
  projectName: 'program-rules-playground-docs',

  noIndex: isMirror,
  customFields: { canonicalUrl: CANONICAL_URL, isMirror },

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
      onBrokenMarkdownImages: 'throw',
    },
  },

  i18n: { defaultLocale: 'en', locales: ['en'] },

  themes: [
    '@docusaurus/theme-mermaid',
    // TODO(search): move to Algolia DocSearch (free for developer docs) once the site is public.
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: '/',
        indexBlog: false,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  plugins: ['@docusaurus/plugin-ideal-image'],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: `${DOCS_REPO_URL}/edit/main/`,
        },
        blog: false,
        // Only the canonical build ships sitemap.xml.
        sitemap: isMirror ? false : { changefreq: 'weekly', priority: 0.5 },
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: { respectPrefersColorScheme: true },
    navbar: {
      title: 'Program Rules Playground',
      logo: { alt: 'Program Rules Playground logo', src: 'img/logo.png' },
      items: [
        { type: 'docSidebar', sidebarId: 'docs', label: 'Docs', position: 'left' },
        { to: '/help/release-notes', label: 'Release notes', position: 'left' },
        { href: APP_REPO_URL, label: 'GitHub', position: 'right' },
        // TODO(app-hub): replace with the real App Hub listing once the app is published.
        { href: 'https://apps.dhis2.org/', label: 'App Hub', position: 'right' },
        { href: FORM_UTILS_URL, label: 'dhis2-form-utils', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Project',
          items: [
            { label: 'App repository', href: APP_REPO_URL },
            { label: 'Docs repository', href: DOCS_REPO_URL },
            { label: 'dhis2-form-utils', href: FORM_UTILS_URL },
            { label: 'Report a bug', href: `${APP_REPO_URL}/issues` },
          ],
        },
      ],
      copyright: `Released under the BSD-3-Clause license. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
