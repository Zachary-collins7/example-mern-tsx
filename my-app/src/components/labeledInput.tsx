import { useId, cloneElement } from 'react';

export interface ILabeledInputProps {
  text: string,
  children: JSX.Element
}

export default function LabeledInput({
  text,
  children
}: ILabeledInputProps) {
  const id = useId();

  return (
    <>
      <label htmlFor={ id }>{text}</label>
      {cloneElement(children, { id })}
    </>
  );
}
