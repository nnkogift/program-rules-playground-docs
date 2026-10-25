import React from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SiteMetadata from '@theme-original/SiteMetadata';
import type SiteMetadataType from '@theme/SiteMetadata';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof SiteMetadataType>;

/**
 * On the mirror build, point every page's canonical URL at the same page on the
 * canonical host. react-helmet lets this later <Head> override the default tags.
 */
export default function SiteMetadataWrapper(props: Props): React.JSX.Element {
  const {
    siteConfig: { baseUrl, customFields },
  } = useDocusaurusContext();
  const { pathname } = useLocation();

  if (customFields?.isMirror !== true) {
    return <SiteMetadata {...props} />;
  }

  const pathWithinSite = pathname.startsWith(baseUrl) ? pathname.slice(baseUrl.length) : pathname;
  const canonicalUrl = `${String(customFields.canonicalUrl)}/${pathWithinSite.replace(/^\//, '')}`;

  return (
    <>
      <SiteMetadata {...props} />
      <Head>
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
      </Head>
    </>
  );
}
