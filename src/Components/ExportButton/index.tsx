import styles from './styles.module.scss';

type ExportButtonProps = {
  mountToExport: () => void;
};

export function ExportButton({ mountToExport }: ExportButtonProps) {
  return (
    <button
      className={`${styles.btn_download} ${styles.btn_test}`}
      type='button'
      onClick={mountToExport}
    >
      Get mounted Flow
    </button>
  );
}
