import { useColorMode } from '@docusaurus/theme-common';
import { clsx } from 'clsx';

// TODO: I believe, these are internally replaced by Docusaurus during
// the compilation. We should check their docs, if there is a better way
// to configure something so that TS/ESLint find these correctly?
/* eslint-disable import/no-unresolved */
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
/* eslint-enable import/no-unresolved */

import { ThemeProvider } from '@dr.pogodin/react-themes';

import Calendar from '../components/Calendar';
import darkContextCalendarTheme
  from '../components/Calendar/dark-context.module.scss';
import redContextCalendarTheme
  from '../components/Calendar/red-context.module.scss';
import calendarWithGrid from '../components/Calendar/with-grid.module.scss';

// TODO: I guess, no better way to share this asset?
// eslint-disable-next-line import/no-relative-packages
import SponsorImg from '../../../.README/sponsor.svg';

import S from './index.module.scss';

function HomepageHeader() {
  const isDarkTheme = useColorMode().colorMode === 'dark';
  const { siteConfig } = useDocusaurusContext();
  return (
    <header
      className={
        clsx(
          'hero hero--primary',
          S.heroBanner,
          isDarkTheme ? S.dark : S.light,
        )
      }
    >
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p>
          Inspired by &zwnj;
          <Link
            className={S.whiteLink}
            to="https://www.npmjs.com/package/@friendsofreactjs/react-css-themr"
          >
            react-css-themr
          </Link>, this library allows to easily reuse the same core component
          in different applications and contexts, modifying its appearance
          &zwnj; <em>via</em> default, context, and <em>ad hoc</em> themes.
          Powered by CSS modules and core HTML/CSS mechanics it does not require
          any unstable dependencies, and does not restrict you from using any
          other (S)CSS tools of your choice.
        </p>
        <p>
          <Link
            className={S.install}
            to="https://www.npmjs.com/package/@dr.pogodin/react-themes"
          >
            <code>
              npm install --save @dr.pogodin/react-themes
            </code>
          </Link>
        </p>
        <p className={S.repoBadges}>
          <Link to="https://www.npmjs.com/package/@dr.pogodin/react-themes">
            <img
              alt="Latest NPM Release"
              src="https://img.shields.io/npm/v/@dr.pogodin/react-themes.svg"
            />
          </Link>
          <Link to="https://www.npmjs.com/package/@dr.pogodin/react-themes">
            <img
              alt="NPM monthly downloads"
              src="https://img.shields.io/npm/dm/@dr.pogodin/react-themes"
            />
          </Link>
          <Link to="https://app.circleci.com/pipelines/github/birdofpreyru/react-themes">
            <img
              alt="CircleCI"
              src="https://dl.circleci.com/status-badge/img/gh/birdofpreyru/react-themes/tree/master.svg?style=shield"
            />
          </Link>
          <Link to="https://github.com/birdofpreyru/react-themes">
            <img
              alt="GitHub Repo stars"
              src="https://img.shields.io/github/stars/birdofpreyru/react-themes?style=social"
            />
          </Link>
        </p>
        <p>
          <a
            href="https://github.com/sponsors/birdofpreyru"
            target="blank"
          >
            <SponsorImg />
          </a>
        </p>
        <div className={S.contributors}>
          <h3>
            <a href="https://github.com/birdofpreyru/react-themes/graphs/contributors">
              Contributors
            </a>
          </h3>
          <a href="https://github.com/mrazauskas">
            <img
              alt="avatar"
              src="https://avatars.githubusercontent.com/u/72159681?v=4&s=36"
              width="36"
            />
          </a>
          <a href="https://github.com/birdofpreyru">
            <img
              alt="avatar"
              src="https://avatars.githubusercontent.com/u/20144632?v=4&s=36"
              width="36"
            />
          </a>
        </div>
      </div>
    </header>
  );
}

const CODE_SNIPPLET_01
  = `// "calendarWithGrid" and "darkContextCalendarTheme" are just
// imported SCSS theme modules.

<div className={styles.columns}>
  <div>
    <Calendar />
    <Calendar theme={calendarWithGrid} />
  </div>
  <ThemeProvider themes={{Calendar: darkContextCalendarTheme}}>
    <div className={styles.darkBackground}>
      <Calendar />
      <Calendar theme={calendarWithGrid} />
    </div>
  </ThemeProvider>
  <ThemeProvider themes={{Calendar: redContextCalendarTheme}}>
    <div className={styles.redBackground}>
      <Calendar />
      <Calendar theme={calendarWithGrid} />
    </div>
  </ThemeProvider>
</div>`;

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      description={siteConfig.tagline}
      title={`${siteConfig.title} | Dr. Pogodin Studio`}
    >
      <HomepageHeader />
      <main className={S.main}>
        <div className={S.centerText}>
          Here is a simple example of React Themes library in action
          (see explanations <Link to="#explanations">below</Link>).
        </div>
        <div className={S.columns}>
          <div>
            <Calendar />
            <Calendar theme={calendarWithGrid} />
          </div>
          <ThemeProvider
            themes={{
              Calendar: darkContextCalendarTheme,
            }}
          >
            <div className={S.darkBackground}>
              <Calendar />
              <Calendar theme={calendarWithGrid} />
            </div>
          </ThemeProvider>
          <ThemeProvider
            themes={{
              Calendar: redContextCalendarTheme,
            }}
          >
            <div className={S.redBackground}>
              <Calendar />
              <Calendar theme={calendarWithGrid} />
            </div>
          </ThemeProvider>
        </div>
        <div>
          <Link id="explanations" />
          <p>
            The base &zwnj;
            <Link
              to="https://github.com/birdofpreyru/react-themes/blob/master/docs/src/components/Calendar/index.jsx"
            >
              Calendar
            </Link>
            &zwnj; component renders a generic HTML representation of
            the current
            month, and accepts the classnames for its elements via &zwnj;
            <code>theme</code> prop. It is wrapped with React Themes library
            to compose the actual <code>theme</code> it gets.
            The &zwnj;
            <Link to="https://github.com/birdofpreyru/react-themes/blob/master/docs/src/components/Calendar/default.module.scss">
              default theme
            </Link>
            &zwnj; implements necessary layout styling, and it looks good
            against
            a bright background. As the default style does not shine against
            dark
            and red backgrounds, &zwnj;
            <Link to="/docs/api/components/themeprovider">
              ThemeProvider
            </Link>
            &zwnj; is used to
            to instruct React Themes to apply additional &zwnj;
            <Link to="https://github.com/birdofpreyru/react-themes/blob/master/docs/src/components/Calendar/dark-context.module.scss">
              &ldquo;black context theme&rdquo;
            </Link> and &zwnj;
            <Link to="https://github.com/birdofpreyru/react-themes/blob/master/docs/src/components/Calendar/red-context.module.scss">
              &ldquo;red context theme&rdquo;
            </Link>
            &zwnj; to all
            <code>&lt;Calendar&gt;</code> instances within corresponding
            contexts. These additional &ldquo;context themes&rdquo; are very
            simple, as they only override necessary colors, while all layout
            styling is automatically inherited from the default theme. Finally,
            a simple &zwnj;
            <Link to="https://github.com/birdofpreyru/react-themes/blob/master/docs/src/components/Calendar/with-grid.module.scss">
              &ldquo;with-grid theme&rdquo;
            </Link> &zwnj; is applied as an <em>ad hoc</em> theme to the last
            three <code>Calendar</code> instances in this example
            to add visible grid lines to these particular component instances.
          </p>
          <p>
            The main point is &mdash; while <code>Calendar</code>, its default
            theme, and light additional themes are reusable components, not much
            complicated by the use of React Themes library, their actual use in
            this example becomes extremely simple, with most of styling nuances
            hidden from the high-level code of this example (but easily
            accessible and adjustable if necessary):
          </p>
          <CodeBlock className="language-jsx">{CODE_SNIPPLET_01}</CodeBlock>
          <p>
            Note, most of this example snipplet is conserned to nicely layout
            the example, while the actual <code>Calendar</code> &zwnj;
            instances are created either without parameters at all
            (as they pick up the default and context theme via React Themes
            mechanics), or with the necessary <em>ad hoc</em> theme passed in
            via <code>theme</code> prop.
          </p>
          <p>
            <strong>Read next:</strong> &zwnj;
            <Link to="/docs/tutorial/getting-started">Getting Started</Link>
          </p>
        </div>
      </main>
    </Layout>
  );
}
