/* global module, require */

const { themes } = require('prism-react-renderer');

const CODE_REPO = 'https://github.com/birdofpreyru/react-themes';
const EDIT_BASE = `${CODE_REPO}/edit/master/docs`;

const NPM_URL = 'https://www.npmjs.com/package/@dr.pogodin/react-themes';

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  baseUrl: '/docs/react-themes/',
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  tagline: 'User Interface theme composition with CSS Modules and React',
  title: 'React Themes',
  url: 'https://dr.pogodin.studio',

  plugins: ['docusaurus-plugin-sass'],
  presets: [
    [
      '@docusaurus/preset-classic',

      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          editUrl: EDIT_BASE,
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig:

    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()}
          <a href="https://dr.pogodin.studio" target="_blank">Dr. Pogodin Studio</a>
        `,
        links: [
          {
            items: [
              {
                label: 'API',
                to: '/docs/api/overview',
              },
              {
                label: 'Tutorial',
                to: '/docs/tutorial/getting-started',
              },
            ],
            title: 'Docs',
          },
          {
            items: [
              {
                href: CODE_REPO,
                label: 'GitHub',
              },
              {
                href: NPM_URL,
                label: 'NPM',
              },
            ],
            title: 'More',
          },
        ],
        style: 'dark',
      },
      navbar: {
        items: [
          {
            activeBaseRegex: '^/docs/react-themes/$',
            label: 'React Themes',
            to: '/',
          },
          {
            docId: 'tutorial/getting-started',
            label: 'Tutorial',
            position: 'left',
            type: 'doc',
          },
          {
            docId: 'api/overview',
            label: 'API',
            position: 'left',
            type: 'doc',
          },
          {
            href: CODE_REPO,
            label: 'GitHub',
            position: 'right',
          },
          {
            href: NPM_URL,
            label: 'NPM',
            position: 'right',
          },
        ],
        logo: {
          alt: 'Dr. Pogodin Studio Logo',
          href: 'https://dr.pogodin.studio',
          src: 'img/logo-verbose.svg',
        },
      },
      prism: {
        additionalLanguages: ['scss', 'tsx'],
        darkTheme: themes.dracula,
        theme: themes.github,
      },
    },
};
