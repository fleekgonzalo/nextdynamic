import { Client } from '@notionhq/client';
import compact from 'lodash/compact';

export const NotionClient = new Client({ auth: process.env.NOTION_TOKEN });

type BlockBase = { id: string; type: string;};
export type TextItem = {
  type: 'text';
  href: string | null;
  plain_text: string;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
  };
};
export type TextBlock =
  | ParagraphBlock
  | Heading1Block
  | Heading2Block
  | Heading3Block
  | Heading4Block
  | NumberedListItemBlock
  | BulletedListItem
  | DividerBlock
  | TableBlock
  | TableRowBlock;

export type ParagraphBlock = BlockBase & {
  type: 'paragraph';
  paragraph: {
    text: TextItem[];
  };
  has_children: boolean;
  id: string
};

/**
 * Type guards
 */

export function isParagraphBlock(
  blockResult: BlockBase,
): blockResult is ParagraphBlock {
  return blockResult.type === 'paragraph';
}

export type Heading1Block = BlockBase & {
  type: 'heading_1';
  heading_1: {
    text: TextItem[];
  };
  has_children: boolean;
  id: string
};

export function isHeading1Block(block: any): block is Heading1Block {
  return block?.type === 'heading_1';
}

export type Heading2Block = BlockBase & {
  type: 'heading_2';
  heading_2: {
    text: TextItem[];
  };
  has_children: boolean;
  id: string
};

export function isHeading2Block(block: any): block is Heading2Block {
  return block?.type === 'heading_2';
}

export type Heading3Block = BlockBase & {
  type: 'heading_3';
  heading_3: {
    text: TextItem[];
  };
  has_children: boolean;
};

export function isHeading3Block(block: any): block is Heading3Block {
  return block?.type === 'heading_3';
}

export type Heading4Block = BlockBase & {
  type: 'heading_4';
  heading_4: {
    text: TextItem[];
  };
  has_children: boolean;
  id: string
};

export function isHeading4Block(block: any): block is Heading4Block {
  return block?.type === 'heading_4';
}

export function isHeadingBlock(block: any): block is Heading1Block | Heading2Block | Heading3Block | Heading4Block {
  return ['heading_1', 'heading_2', 'heading_3', 'heading_4'].includes(block?.type);
}

export type NumberedListItemBlock = BlockBase & {
  type: 'numbered_list_item';
  numbered_list_item: {
    text: TextItem[];
  };
  has_children: boolean;
  id: string
};

export function isNumberedListItemBlock(
  blockResult: BlockBase,
): blockResult is NumberedListItemBlock {
  return blockResult.type === 'numbered_list_item';
}

export type BulletedListItem = BlockBase & {
  type: 'bulleted_list_item';
  bulleted_list_item: {
    text: TextItem[];
  };
  has_children: boolean;
  id: string
};

export function isBulletedListItemBlock(
  blockResult: BlockBase,
): blockResult is BulletedListItem {
  return blockResult.type === 'bulleted_list_item';
}

export type DividerBlock = BlockBase & {
  type: 'divider';
  has_children: boolean;
  id: string
};

export function isDividerBlock(
  blockResult: BlockBase,
): blockResult is DividerBlock {
  return blockResult.type === 'divider';
}

export type TableBlock = {
  type: 'table';
  table: {
    table_width: number;
    has_column_header: boolean;
    has_row_header: boolean;
  };
  has_children: boolean;
  id: string
};

export function isTableBlock(block: any): block is TableBlock {
  return block?.type === 'table';
}

export type TableRowBlock = {
  type: 'table_row';
  table_row: {
    cells: TextItem[][];
  };
  has_children: boolean;
  id: string
};

export function isTableRowBlock(block: any): block is TableRowBlock {
  return block?.type === 'table_row';
}

export function isTextBlock(blockResult: BlockBase): blockResult is TextBlock {
  return (
    isParagraphBlock(blockResult) ||
    isHeadingBlock(blockResult) ||
    isNumberedListItemBlock(blockResult) ||
    isBulletedListItemBlock(blockResult) ||
    isDividerBlock(blockResult) ||
    isTableBlock(blockResult) ||
    isTableRowBlock(blockResult)
  );
}

/**
 * Helpers
 */

export async function getPageDetails(pageId?: string) {
  if (!pageId) {
    return undefined;
  }

  const response = await NotionClient.pages.retrieve({ page_id: pageId });
  return response;
}

async function getAllBlockChildren(pageId?: string) {
  const children = [];
  let hasMore = true;
  let cursor: string | undefined;

  while (hasMore) {
    try {
      const request = { block_id: pageId as string, start_cursor: cursor };
      const response = await NotionClient.blocks.children.list(request);
      children.push(...response.results);
      cursor = response.next_cursor ?? undefined;
      hasMore = response.has_more;
    } catch (error) {
      hasMore = false;
    }
  }

  return children;
}

export async function getTextBlocksFromPage(
  pageId: string | undefined,
): Promise<TextBlock[]> {
  if (!pageId) {
    return [];
  }

  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  async function getBlockWithChildren(blockId: string): Promise<TextBlock[]> {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
    });

    const blocks = response.results as TextBlock[];
    const blocksWithChildren = await Promise.all(
      blocks.map(async (block) => {
        if (isTableBlock(block)) {
          const children = await notion.blocks.children.list({
            block_id: block.id,
            page_size: 100,
          });
          return [block, ...(children.results as TextBlock[])];
        }
        if (block.has_children) {
          const children = await getBlockWithChildren(block.id);
          return [block, ...children];
        }
        return [block];
      })
    );

    return blocksWithChildren.flat();
  }

  const response = await NotionClient.blocks.children.list({ block_id: pageId });
  const blocks = await getBlockWithChildren(pageId);
  return blocks;
}

export function isSectionDivider(blocks: TextBlock[], currentIdx: number): boolean {
  for (let i = currentIdx; i >= 0; i--) {
    if (isHeadingBlock(blocks[i])) {
      return true;
    }
  }
  return false;
}
