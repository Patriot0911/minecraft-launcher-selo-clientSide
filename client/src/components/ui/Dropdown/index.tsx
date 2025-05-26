import { useEffect, useRef, ReactNode } from 'react';
import styles from './styles.module.scss';

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  className?: string;
}

const Dropdown = ({ items, isOpen, onClose, triggerRef, className }: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.dropdown} ${className || ''}`} ref={dropdownRef}>
      {items.map((item, index) => (
        <button
          key={index}
          className={styles.dropdownItem}
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Dropdown; 