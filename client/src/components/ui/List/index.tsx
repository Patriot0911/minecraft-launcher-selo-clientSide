import { CgSearchLoading } from "react-icons/cg";
import { ReactNode } from "react";
import styles from './styles.module.scss';

export interface IListProps {
  items: {
    name: string;
    displayName: string;
    node?: ReactNode;
  }[];
  selectedItem: string;
  setSelectedItem: (name: string) => void;
};

const List = ({ items, selectedItem, setSelectedItem, }: IListProps) => {
  return (
    <ul className={`${styles['items-wrapper']} ${items.length < 1 ? styles['empty'] : ''}`}>
      {items.map((item) => (
        <li
          key={item.name}
          className={
              `${styles.item} ${
              item.name === selectedItem ? styles.active : ''
            }`
          }
          onClick={() => setSelectedItem(item.name)}
        >
          {item.node ?? item.displayName}
        </li>
      ))}
      {
        items.length < 1 && (
          <div className={styles['empty-text-wrapper']}>
            No results
          </div>
        )
      }
    </ul>
  );
};

export default List;
