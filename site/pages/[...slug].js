import MdxPage from '../components/MDX';
import { allOtherPages } from 'contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import siteConfig from "../config/siteConfig"


export default function Page({ body, ...rest }) {
  const Component = useMDXComponent(body.code);
  const children = {
    Component,
    frontmatter: {
      ...rest,
      date: rest.date === "Invalid Date" ? null : rest.date,
      created: rest.created === "Invalid Date" ? null : rest.created
    },
  };

  // enable editing content only for claims, concepts, and guide for now
  const editUrl = ['claims', 'concepts', 'guide'].includes(rest._raw.sourceFileDir)
        ? siteConfig.repoRoot + siteConfig.repoEditPath + rest._raw.sourceFilePath
        : null
  
  return (
      <MdxPage children={children} editUrl={editUrl} />
  );
}

export const getStaticProps = async ({ params }) => {
  // All pages ending with .md in the /data folder are made available in allOtherPages
  // Based on the specified slug, the correct page is selected
  const urlPath = params.slug.join('/')
  const page = allOtherPages.find(p => p._raw.flattenedPath === urlPath)
  return { props: page }
}

export const getStaticPaths = async () => {
  const paths = allOtherPages.map((page) => {
    // demo => [demo]
    // abc/demo => [abc,demo]
    const parts = page._raw.flattenedPath.split('/')
    return { params: { slug: parts } }
  })

  return {
    paths,
    fallback: false,
  }
}

