import { toPng } from 'html-to-image';
import styles from './styles.module.scss';

export function DownloadButton() {
  function downloadImage(dataUrl: string) {
    const a = document.createElement('a');

    a.setAttribute('download', 'reactflow.png');
    a.setAttribute('href', dataUrl);
    a.click();
  }

  const onClick = () => {
    toPng(document.querySelector('.react-flow'), {
      filter: (node) => {
        // we don't want to add the minimap and the controls to the image
        if (
          node?.classList?.contains('react-flow__minimap') ||
          node?.classList?.contains('react-flow__controls')
        ) {
          return false;
        }

        return true;
      },
    }).then(downloadImage);
  };

  return (
    <button type='button' onClick={onClick} className={styles.btn_download}>
      Dowload as image
    </button>
  );
}
