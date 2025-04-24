import { CSSProperties } from "react";
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.container}>
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
