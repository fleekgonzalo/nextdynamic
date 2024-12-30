import {
  isBulletedListItemBlock,
  isDividerBlock,
  isHeading1Block,
  isHeading2Block,
  isHeading3Block,
  isHeading4Block,
  isNumberedListItemBlock,
  isSectionDivider,
  isParagraphBlock,
  isTableBlock,
  isTableRowBlock,
  TextBlock,
  TextItem,
  Heading3Block,
} from 'utils/notion';
import { useEffect, useRef, useState, useMemo } from 'react';

type TextBlobProps = {
  textBlocks: TextBlock[];
};

const TextBlob = ({ textBlocks }: TextBlobProps) => {
  let listItemNumber = 0;

  const memoizedIsInNewsSection = useMemo(() => {
    return (blocks: TextBlock[], currentIdx: number): boolean => {
      for (let i = currentIdx; i >= 0; i--) {
        if (isHeading3Block(blocks[i])) {
          const heading3Block = blocks[i] as Heading3Block; // Type assertion here
          if (heading3Block.heading_3.text[0]?.plain_text === 'Recent News') {
            return true;
          }
        }
      }
      return false;
    };
  }, []);

  return (
    <>
      {textBlocks.map((textBlock, idx) => {
        if (textBlock.type === 'numbered_list_item') {
          listItemNumber += 1;
        } else {
          listItemNumber = 0;
        }

        return (
          <TextBlockElements
            key={JSON.stringify(textBlock)}
            textBlocks={textBlocks}
            idx={idx}
            listItemNumber={listItemNumber}
            isInNewsSection={memoizedIsInNewsSection}
          />
        );
      })}
    </>
  );
};

type TextBlockElementsProps = {
  textBlocks: TextBlock[];
  idx: number;
  listItemNumber: number;
  isInNewsSection: (blocks: TextBlock[], currentIdx: number) => boolean;
};
function TextBlockElements({
  textBlocks,
  idx,
  listItemNumber,
  isInNewsSection,
}: TextBlockElementsProps) {
  const textBlock = textBlocks[idx];
  const { id } = textBlock;

  if (isParagraphBlock(textBlock)) {
    const textItems = textBlock.paragraph.text;

    // Check if the paragraph text is empty
    if (textItems.length === 0) {
      return <br key={id} />; // Render a line break for empty paragraphs
    }

    return (
      <div
        className={
          idx < textBlocks.length - 1 &&
          textBlocks[idx + 1].type === 'numbered_list_item'
            ? 'mb-2'
            : 'mb-3'
        }
      >
        <TextItemElement
          textBlockId={id}
          textItems={textItems}
        />
      </div>
    );
  }

  if (isHeading1Block(textBlock)) {
    return (
      <h1 className={`text-4xl font-bold mb-4 ${idx === 0 ? '' : 'mt-12'}`}>
        <TextItemElement
          textBlockId={id}
          textItems={textBlock.heading_1.text}
        />
      </h1>
    );
  }

  if (isHeading2Block(textBlock)) {
    return (
      <h2 className={`text-3xl font-semibold mb-3 ${idx === 0 ? '' : 'mt-10'}`}>
        <TextItemElement
          textBlockId={id}
          textItems={textBlock.heading_2.text}
        />
      </h2>
    );
  }

  if (isHeading3Block(textBlock)) {
    const headingText = textBlock.heading_3.text[0]?.plain_text;
    return (
      <h3 className={`text-2xl font-medium mb-2 ${idx === 0 ? '' : 'mt-8'}`}>
        <TextItemElement
          textBlockId={id}
          textItems={textBlock.heading_3.text}
        />
      </h3>
    );
  }

  if (isHeading4Block(textBlock)) {
    return (
      <h4 className={`text-xl font-medium mb-2 ${idx === 0 ? '' : 'mt-6'}`}>
        <TextItemElement
          textBlockId={id}
          textItems={textBlock.heading_4.text}
        />
      </h4>
    );
  }

  if (isNumberedListItemBlock(textBlock)) {
    return (
      <div className="mb-2 ml-4">
        {`${listItemNumber}. `}
        <TextItemElement
          textBlockId={id}
          textItems={textBlock.numbered_list_item.text}
        />
      </div>
    );
  }

  if (isBulletedListItemBlock(textBlock)) {
    return (
      <div className="flex">
        <span className="mr-2">•</span>
        <div>
          <TextItemElement
            textBlockId={id}
            textItems={textBlock.bulleted_list_item.text}
          />
        </div>
      </div>
    );
  }

  if (isDividerBlock(textBlock)) {
    const inNewsSection = isInNewsSection(textBlocks, idx);
    const isSectionDiv = isSectionDivider(textBlocks, idx);
    return (
      <div className={`flex justify-center ${inNewsSection ? 'my-48' : isSectionDiv ? 'my-6' : 'my-8'}`}>
        <hr className="border-t border-gray-300 w-3/4" />
      </div>
    );
  }

  if (isTableBlock(textBlock)) {
    // Get table rows
    const tableRows = textBlocks.slice(idx + 1).filter(isTableRowBlock);
    const hasMoreRows = tableRows.length > 3;
    const tableRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState<number | null>(null);

    useEffect(() => {
      if (tableRef.current && hasMoreRows) {
        // Get the first 3 rows
        const rows = tableRef.current.querySelectorAll('tr:nth-child(-n+3)');
        let totalHeight = 0;
        rows.forEach(row => {
          totalHeight += row.getBoundingClientRect().height;
        });
        setContainerHeight(totalHeight);
      }
    }, [hasMoreRows]);

    return (
      <div className="mt-4">
        <div 
          ref={tableRef}
          className={`${hasMoreRows ? 'overflow-y-auto' : ''} no-scrollbar`}
          style={{ maxHeight: containerHeight ? `${containerHeight}px` : 'auto' }}
        >
          <table className="w-full">
            <tbody>
              {tableRows.map((rowBlock, rowIdx) => (
                <tr key={rowIdx} className="border-b border-gray-700">
                  {rowBlock.table_row.cells.map((cell, cellIdx) => (
                    <td 
                      key={`${rowIdx}-${cellIdx}`} 
                      className={`py-4 ${cellIdx === 0 ? 'w-24 text-gray-500 dark:text-white' : ''}`}
                    >
                      <TextItemElement
                        textBlockId={rowBlock.id}
                        textItems={cell}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (isTableRowBlock(textBlock)) {
    // Skip rendering individual table rows as they're handled by the table block
    return null;
  }

  return null;
}

type TextItemElementProps = {
  textItems: TextItem[];
  textBlockId: string;
};
function TextItemElement({ textBlockId, textItems }: TextItemElementProps) {
  return (
    <>
      {textItems.map((textItem) => {
        const { href, plain_text: text, annotations } = textItem;
        let className = '';
        if (annotations.bold) {
          className += ' font-semibold';
        }
        if (annotations.italic) {
          className += ' italic';
        }
        if (annotations.underline) {
          className += ' underline';
        }
        if (annotations.strikethrough) {
          className += ' line-through';
        }
        className.trim();

        if (href) {
          return (
            <a
              key={`${textBlockId}-${href}-${text}`}
              aria-label={`${href} link`}
              className={`${className} underline cursor-pointer`}
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {text}
            </a>
          );
        }

        return (
          <span key={`${textBlockId}-${text}`} className={className}>
            {text}
          </span>
        );
      })}
    </>
  );
}

export default TextBlob;
