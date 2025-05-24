import React from "react";

interface IInputProps {
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: any;
};

const Input = ({ name, onChange, value, }: IInputProps) => {
  return <input
    name={name}
    onChange={onChange}
    value={value}
  />;
};

export default Input;
