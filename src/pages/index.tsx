import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const POINTS = [
  {
    title: 'See rules run as you type',
    text: 'Fields hide, show, become mandatory or receive values, and each one shows a badge for the last effect a rule had on it.',
  },
  {
    title: 'Know why a rule fired',
    text: 'The Rules, Trace and Graph tabs show which rules apply, how each was evaluated and which fields they read and change.',
  },
  {
    title: 'Check against the server',
    text: 'Verify with server runs a dry run of your values on your DHIS2 server. The app supports DHIS2 2.40 to 2.43.',
  },
];

export default function Home(): React.JSX.Element {
  const shot = useBaseUrl('/app-hub/01-event-form.png');

  return (
    <Layout
      title="Test and debug DHIS2 program rules"
      description="Program Rules Playground is an open-source DHIS2 app for testing and debugging program rules against your real metadata."
    >
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Test and debug DHIS2 program rules</h1>
          <p className={styles.lede}>
            Program Rules Playground is an open-source DHIS2 app. Fill in a form against your real
            metadata and watch the rules run.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary button--lg" to="/getting-started/install">
              Get started
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/introduction/what-is-program-rules-playground"
            >
              What is it?
            </Link>
          </div>
        </section>

        <img
          className={styles.shot}
          src={shot}
          width={1280}
          height={800}
          alt="An event form in Program Rules Playground with effect badges on the fields and the Rules panel listing the rules that fire."
        />

        <section className={styles.points}>
          {POINTS.map((point) => (
            <div key={point.title}>
              <h2 className={styles.pointTitle}>{point.title}</h2>
              <p>{point.text}</p>
            </div>
          ))}
        </section>
      </main>
    </Layout>
  );
}
