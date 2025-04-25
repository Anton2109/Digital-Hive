import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button = ({ className, children, ...rest }: Props) => {
  return (
    <button className={`${styles.button} ${className || ""}`} {...rest}>
      {children}
    </button>
  );
};
