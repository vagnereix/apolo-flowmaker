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
    const flow: HTMLElement = document.querySelector('.react-flow')!;

    toPng(flow, {
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
    <button
      title='Download flow as image'
      type='button'
      onClick={onClick}
      className={styles.btn_download}
    >
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g clipPath='url(#clip0_1752_4998)'>
          <path d='M14.93 8V15H1.07V8H0V16H16V8H14.93Z' fill='#0063B8' />
          <path
            d='M12.85 6.9L12.06 6.18L8.54 10.06V0H7.47V10.06L3.94 6.18L3.16 6.9L8 12.24L12.85 6.9Z'
            fill='#0063B8'
          />
        </g>
        <defs>
          <clipPath id='clip0_1752_4998'>
            <rect width='16' height='16' fill='white' />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
}
