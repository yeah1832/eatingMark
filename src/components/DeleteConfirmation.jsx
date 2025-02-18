import { useEffect } from 'react';

import ProgressBar from './ProgressBar.jsx';

const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);

    return () => {
      clearTimeout(timer);
    };
  }, [onConfirm]);

  return (
    <div id="delete-confirmation">
      <h2>확인</h2>
      <p>정말 삭제하시겠습니까?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          아니오
        </button>
        <button onClick={onConfirm} className="button">
          네
        </button>
      </div>
      <ProgressBar timer={TIMER} />
    </div>
  );
}
