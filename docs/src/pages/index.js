import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { ThemeProvider } from '@dr.pogodin/react-themes';

import styles from './index.module.css';

import Calendar from '../components/Calendar';
import darkContextCalendarTheme
  from '../components/Calendar/dark-context.module.scss';
import redContextCalendarTheme
  from '../components/Calendar/red-context.module.scss';
import calendarWithGrid from '../components/Calendar/with-grid.module.scss';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p>
          Inspired by &zwnj;
          <a
            className={styles.whiteLink}
            href="https://www.npmjs.com/package/@friendsofreactjs/react-css-themr"
            target="_blank"
          >
            react-css-themr
          </a> this library allows to easily reuse the same core component
          in different applications and contexts, modifying its appearance
          <em>via</em> default, context, and <em>ad hoc</em> themes. Powered
          by CSS modules and core HTML/CSS mechanics it does not require any
          unstable dependencies, and does not restrict you from using any other
          (S)CSS tools of your choice.
        </p>
        <p>
          <a
            className={styles.install}
            href="https://www.npmjs.com/package/@dr.pogodin/react-themes"
            target="_blank"
          >
            <code>
              npm install --save @dr.pogodin/react-themes
            </code>
          </a>
        </p>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main className={styles.main}>
        <div>
          Here is a simple example of React Themes library in action.
          TO BE CONTINUED...
        </div>
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
        </div>
      </main>
    </Layout>
  );
}
