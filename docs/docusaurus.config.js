const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const DOCS_REPO = 'https://github.com/birdofpreyru/react-themes';
const EDIT_BASE = `${DOCS_REPO}/edit/master/docs`;

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'React Themes',
  tagline: 'User Interface theme composition with CSS Modules and React',
  url: 'https://dr.pogodin.studio',
  baseUrl: '/docs/react-themes/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  plugins: ['docusaurus-plugin-sass'],
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: `${EDIT_BASE}/docs/`,
        },
        /*
          NOTE: No use for blog for now.
        blog: {
          showReadingTime: true,
          editUrl: `${EDIT_BASE}/blog/`,
        },
        */
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true
      },
      navbar: {
        logo: {
          alt: 'Dr. Pogodin Studio Logo',
          src: 'img/logo-verbose.svg',
          srcDark: 'img/logo-verbose-white.svg',
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
            docId: 'intro',
            position: 'left',
            label: 'Tutorial',
          },
          /*
            NOTE: For now, no need for blog.
            {to: '/blog', label: 'Blog', position: 'left'},
          */
          {
            href: 'https://github.com/birdofpreyru/react-themes',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      /*
        TODO: To be configured
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Dr. Pogodin Studio`,
      },
      */
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
});
