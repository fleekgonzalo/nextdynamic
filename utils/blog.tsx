import compact from 'lodash/compact';

import { PostInfo } from 'components/writing';
import { NotionClient, getPageDetails } from './notion';

export type BlogPostProperties = {
  Name: {
    type: 'title';
    title: [{ plain_text: string }];
  };
  datePublished: {
    type: 'date';
    date: {
      start: string;
    };
  };
  subtitle: {
    type: 'rich_text';
    rich_text: [
      {
        type: 'text';
        plain_text: string;
      },
    ];
  };
  postId: {
    type: 'number';
    number: number;
  };
};
export function isBlogPostProperties(
  properties?: any,
): properties is BlogPostProperties {

  const isValid = properties?.subtitle?.rich_text?.[0]?.plain_text !== undefined &&
    properties?.datePublished?.date?.start !== undefined &&
    properties?.postId?.number !== undefined &&
    properties?.Name?.title?.[0]?.plain_text !== undefined;

  return isValid;
}

export async function getBlogPostPageIdByPostId(postId?: number) {
  const databaseId = process.env.NOTION_WRITING_DATABASE_ID;
  if (!postId || !databaseId) {
    return null;
  }

  const response = await NotionClient.databases.query({
    database_id: databaseId,
    filter: {
      property: 'postId',
      number: {
        equals: postId,
      },
    },
  });

  if (!response?.results?.length) {
    return null;
  }

  return response.results[0].id;
}

export async function getPropertiesForBlogPostEntries(databaseId?: string) {
  if (!databaseId) {
    return [];
  }

  const request = { database_id: databaseId };
  const response = await NotionClient.databases.query(request);

  const itemIds = response.results.map((result) => result.id);

  const postsInfo = await Promise.all(
    itemIds.map<Promise<PostInfo | null>>(async (id) => {
      const request = { page_id: id };
      const { properties } = (await getPageDetails(id)) || {};
      if (isBlogPostProperties(properties)) {
        return {
          date: properties.datePublished.date.start,
          postId: properties.postId.number,
          subtitle: properties.subtitle.rich_text[0].plain_text,
          title: properties.Name.title[0].plain_text,
        };
      }
      return null;
    }),
  );

  return compact(postsInfo);
}
