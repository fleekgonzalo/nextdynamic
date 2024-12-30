import { GetStaticProps } from 'next';

import { Page } from 'shared/Page';
import TextBlob from 'shared/TextBlob';
import { getTextBlocksFromPage, TextBlock } from 'utils/notion';

type PublicationsProps = {
  textBlocks: TextBlock[];
};

export const getStaticProps: GetStaticProps<PublicationsProps> = async () => {
  const textBlocks = await getTextBlocksFromPage(
    process.env.NOTION_PUBLICATIONS_PAGE_ID,
  );
  return {
    props: {
      textBlocks,
    },
    revalidate: 60,
  };
};

export default function Publications({ textBlocks }: PublicationsProps) {
  return (
    <Page>
      <TextBlob textBlocks={textBlocks} />
    </Page>
  );
}