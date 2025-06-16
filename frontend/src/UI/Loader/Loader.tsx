import { CSSProperties } from "react";
import styles from "./Loader.module.css";

interface LoaderProps {
  className?: string;
}

const Loader = ({ className }: LoaderProps) => {
  return (
    <div className={className ? `${styles.container} ${className}` : styles.container}>
      <div className={styles.wave}>
        {["З", "А", "Г", "Р", "У", "З", "К", "А", ".", ".", "."].map(
          (char, index) => (
            <span key={index} style={{ "--i": index + 1 } as CSSProperties}>
              {char}
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default Loader;
