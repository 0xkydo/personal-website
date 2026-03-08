import { ReactNode } from "react";

interface ContentListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getUrl: (item: T) => string;
  getKey: (item: T, index: number) => string;
}

export default function ContentList<T>({
  items,
  renderItem,
  getUrl,
  getKey,
}: ContentListProps<T>) {
  return (
    <ul className="content-list">
      {items.map((item, i) => {
        const url = getUrl(item);
        return (
          <li key={getKey(item, i)}>
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {renderItem(item, i)}
              </a>
            ) : (
              <span>{renderItem(item, i)}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
