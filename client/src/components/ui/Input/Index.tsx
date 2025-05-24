import React from "react";

import styles from './styles.module.scss';

interface IInputProps {
  name?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: any;
};

const Input = (props: IInputProps) => {
  return <input
    {...props}
    className={
      `${styles['sl-input']} ${(props.value && props.value.length > 0) ? styles['active'] : ''}`
    }
  />
};

export default Input;
