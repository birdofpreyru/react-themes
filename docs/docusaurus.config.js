const { themes } = require('prism-react-renderer');

const CODE_REPO = 'https://github.com/birdofpreyru/react-themes';
const EDIT_BASE = `${CODE_REPO}/edit/master/docs`;

const NPM_URL = 'https://www.npmjs.com/package/@dr.pogodin/react-themes';

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'React Themes',
  tagline: 'User Interface theme composition with CSS Modules and React',
  url: 'https://dr.pogodin.studio',
  baseUrl: '/docs/react-themes/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  plugins: ['docusaurus-plugin-sass'],
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: EDIT_BASE,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'Dr. Pogodin Studio Logo',
          src: 'img/logo-verbose.svg',
          href: 'https://dr.pogodin.studio'
        },
        items: [
          {
            to: '/',
            label: 'React Themes',
            activeBaseRegex: '^/docs/react-themes/$',
          },
          {
            type: 'doc',
            docId: 'tutorial/getting-started',
            position: 'left',
            label: 'Tutorial',
          },
          {
            type: 'doc',
            docId: 'api/overview',
            position: 'left',
            label: 'API',
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
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
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
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: CODE_REPO,
              },
              {
                label: 'NPM',
                href: NPM_URL,
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()}
          <a href="https://dr.pogodin.studio" target="_blank">Dr. Pogodin Studio</a>
        `,
      },
      prism: {
        additionalLanguages: ['scss', 'tsx'],
        darkTheme: themes.dracula,
        theme: themes.github,
      },
    }),
});
