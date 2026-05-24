import { themes as prismThemes } from 'prism-react-renderer';

import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const CODE_REPO = 'https://github.com/birdofpreyru/react-themes';
const EDIT_BASE = `${CODE_REPO}/edit/master/docs`;
const NPM_URL = 'https://www.npmjs.com/package/@dr.pogodin/react-themes';

const config: Config = {
  tagline: 'User Interface theme composition with CSS Modules and React',
  title: 'React Themes',

  favicon: 'img/favicon.ico',
  markdown: {
    hooks: {
      onBrokenMarkdownImages: 'throw',
      onBrokenMarkdownLinks: 'throw',
    },
  },

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },
  onBrokenAnchors: 'throw',
  onBrokenLinks: 'throw',

  // Set the production url of your site here
  url: 'https://dr.pogodin.studio',

  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docs/react-themes/',

  plugins: ['docusaurus-plugin-sass'],
  presets: [[
    'classic',
    {
      docs: {
        editUrl: EDIT_BASE,
        sidebarPath: './sidebars.ts',
      },
      theme: {
        customCss: './src/css/custom.css',
      },
    } satisfies Preset.Options,
  ]],
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    footer: {
      copyright: `Copyright © 2019&ndash;${new Date().getFullYear()}
        <a href="https://dr.pogodin.studio" target="_blank">Dr. Pogodin Studio</a>
      `,
      links: [{
        items: [{
          label: 'API',
          to: '/docs/api',
        }, {
          label: 'Tutorial',
          to: '/docs/tutorial/getting-started',
        }],
        title: 'Docs',
      }, {
        items: [{
          href: CODE_REPO,
          label: 'GitHub',
        }, {
          href: NPM_URL,
          label: 'NPM',
        }],
        title: 'More',
      }],
      style: 'dark',
    },
    // TODO: Add one later.
    // Replace with your project's social card
    // image: 'img/docusaurus-social-card.jpg',
    navbar: {
      items: [{
        activeBaseRegex: '^/docs/react-themes/$',
        label: 'React Themes',
        to: '/',
      }, {
        docId: 'tutorial/getting-started',
        label: 'Tutorial',
        position: 'left',
        type: 'doc',
      }, {
        docId: 'api/index',
        label: 'API',
        position: 'left',
        type: 'doc',
      }, {
        href: CODE_REPO,
        label: 'GitHub',
        position: 'right',
      }, {
        href: NPM_URL,
        label: 'NPM',
        position: 'right',
      }],
      logo: {
        alt: 'Dr. Pogodin Studio Logo',
        href: 'https://dr.pogodin.studio',
        src: 'img/logo-verbose.svg',
      },
    },
    prism: {
      additionalLanguages: ['scss', 'tsx'],
      darkTheme: prismThemes.dracula,
      theme: prismThemes.github,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
