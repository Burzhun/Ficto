export type SelectProps = {
  name?: string;
  required?: boolean;
  multiple?: boolean;
  label?: string;
  value?: string;
  children?: any;
  onChange?(e: React.ChangeEvent<any>): void;
};
