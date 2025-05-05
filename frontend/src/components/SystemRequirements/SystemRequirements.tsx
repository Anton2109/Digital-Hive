import styles from '@/pages/Games/GameDetails/GameDetails.module.css';
import { ISystemRequirementsProps } from '@/interfaces/game';

const SystemRequirements = ({title, requirements}: ISystemRequirementsProps) => {
  return (
    <div className={styles.requirementsSection}>
      <h2 className={styles.requirementsTitle}>{title}</h2>
      <div className={styles.requirementsList}>
        <div className={styles.requirementItem}>
          <span className={styles.requirementLabel}>Windows</span>
          <span className={styles.requirementValue}>
            {requirements.windows}
          </span>
        </div>
        <div className={styles.requirementItem}>
          <span className={styles.requirementLabel}>Процессор</span>
          <span className={styles.requirementValue}>
            {requirements.processor}
          </span>
        </div>
        <div className={styles.requirementItem}>
          <span className={styles.requirementLabel}>Оперативная память</span>
          <span className={styles.requirementValue}>{requirements.RAM} GB</span>
        </div>
        <div className={styles.requirementItem}>
          <span className={styles.requirementLabel}>Видеокарта</span>
          <span className={styles.requirementValue}>
            {requirements.graphicsCard}
          </span>
        </div>
        <div className={styles.requirementItem}>
          <span className={styles.requirementLabel}>DirectX</span>
          <span className={styles.requirementValue}>
            {requirements.DirectX}
          </span>
        </div>
        <div className={styles.requirementItem}>
          <span className={styles.requirementLabel}>Место на диске</span>
          <span className={styles.requirementValue}>
            {requirements.DiskSpace}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemRequirements;
