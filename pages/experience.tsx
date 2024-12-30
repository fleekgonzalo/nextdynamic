import { GetStaticProps } from 'next';

import { Page } from 'shared/Page';
import TextBlob from 'shared/TextBlob';
import { getTextBlocksFromPage, TextBlock } from 'utils/notion';

type ExperienceProps = {
  textBlocks: TextBlock[];
};

export const getStaticProps: GetStaticProps<ExperienceProps> = async () => {
  const textBlocks = await getTextBlocksFromPage(
    process.env.NOTION_EXPERIENCE_PAGE_ID,
  );
  return {
    props: {
      textBlocks,
    },
    revalidate: 60,
  };
};

export default function Experience({ textBlocks }: ExperienceProps) {
  return (
    <Page>
      <TextBlob textBlocks={textBlocks} />
    </Page>
  );
}
