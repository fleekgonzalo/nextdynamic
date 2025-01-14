import { GetStaticPaths, GetStaticProps } from 'next';

import PostHeader from 'components/writing/PostHeader';
import Head from 'next/head';
import { Page } from 'shared/Page';
import TextBlob from 'shared/TextBlob';
import {
  getBookNotesIdBySlug,
  getBooksInfo,
  isBookNotesProperties,
} from 'utils/bookshelf';
import { formatNotionDateProperty } from 'utils/general';
import { TextBlock, getPageDetails, getTextBlocksFromPage } from 'utils/notion';
export const runtime = 'edge';

type BookNotesParams = { slug: string };

type BookNotesProps = {
  textBlocks: TextBlock[];
  title: string;
  date: string;
};

export const getStaticPaths: GetStaticPaths<BookNotesParams> = async () => {
  const books = await getBooksInfo();

  return {
    paths: books.map(({ slug }) => ({
      params: { slug: String(slug) },
    })),
    // TODO: We should have fallback: true here and have a loading state
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  BookNotesProps,
  BookNotesParams
> = async ({ params }) => {
  const pageId = await getBookNotesIdBySlug(params?.slug);
  const pageDetails = await getPageDetails(pageId ?? undefined);
  const textBlocks = await getTextBlocksFromPage(pageId ?? undefined);

  const { properties } = pageDetails ?? {};
  if (!isBookNotesProperties(properties)) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  return {
    props: {
      textBlocks,
      title: properties.Name.title[0].plain_text,
      date: properties.datePublished.date.start,
    },
    revalidate: 60,
  };
};

export default function BookNotes({ date, title, textBlocks }: BookNotesProps) {
  const formattedDate = formatNotionDateProperty(date, 'MMMM do, yyyy');

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
        {/* TODO: Maybe have a subtitle here? */}
        <meta name="description" content="Book notes" key="description" />
        <meta name="og:description" content="Book notes" key="og:description" />
      </Head>
      <Page>
        <PostHeader date={formattedDate} title={title} />
        <TextBlob textBlocks={textBlocks} />
      </Page>
    </>
  );
}
