import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'NDE',
  tagline: 'Make digital heritage accessible to all',
  favicon: 'img/favicon.png',

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: '/img/favicon-192x192.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/img/apple-touch-icon.png',
      },
    },
  ],

  // Set the production url of your site here
  url: 'https://docs.nde.nl',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'netwerk-digitaal-erfgoed',
  projectName: 'netwerk-digitaal-erfgoed.github.io', // Usually your repo name.

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      '@whitespace-se/docusaurus-plugin-matomo',
      {
        siteId: '4',
        matomoUrl: 'https://matomo.netwerkdigitaalerfgoed.nl',
      },
    ],
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'nl'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/netwerk-digitaal-erfgoed/netwerk-digitaal-erfgoed.github.io/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/netwerk-digitaal-erfgoed/netwerk-digitaal-erfgoed.github.io/tree/main/',
          // Useful options to enforce blogging best practices
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          showLastUpdateTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Netwerk Digitaal Erfgoed',
      logo: {
        alt: 'Logo Netwerk Digitaal Erfgoed',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://status.netwerkdigitaalerfgoed.nl',
          label: 'Status',
          position: 'right',
        },
        {
          href: 'https://github.com/netwerk-digitaal-erfgoed/netwerk-digitaal-erfgoed.github.io',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Services',
          items: [
            {
              label: 'Dataset Register',
              href: 'https://datasetregister.netwerkdigitaalerfgoed.nl/',
            },
            {
              label: 'Network of Terms',
              href: 'https://network-of-terms.netwerkdigitaalerfgoed.nl/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Status',
              href: 'https://status.netwerkdigitaalerfgoed.nl/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/netwerk-digitaal-erfgoed/netwerk-digitaal-erfgoed.github.io',
            },
          ],
        },
        {
          title: 'Contact',
          items: [
            {
              label: 'tech@netwerkdigitaalerfgoed.nl',
              href: 'mailto:tech@netwerkdigitaalerfgoed.nl',
            },
            {
              label: '@NetwerkDigitaalErfgoed@mastodon.nl',
              href: 'https://mastodon.nl/@NetwerkDigitaalErfgoed',
            },
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
