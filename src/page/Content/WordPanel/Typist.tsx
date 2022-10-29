import React, { FC, useEffect } from 'react';
import TypistComponent from 'react-typist-component';

interface TypistType {
  text: string;
  disabled: boolean;
  onTypingDone?: () => void;
  onTypingStart?: () => void;
}

const Typist: FC<TypistType> = (params: TypistType) => {
  useEffect(() => {
    params.onTypingStart?.();
  }, [params.text]);

  // 强制结束触发Done事件
  useEffect(() => {
    if (params.disabled) {
      params.onTypingDone?.();
    }
  }, [params.disabled]);
  return (
    <TypistComponent
      restartKey={params.text}
      onTypingDone={() => {
        params.onTypingDone?.();
      }}
      disabled={params.disabled}
    >
      {params.text}
    </TypistComponent>
  );
};

export default Typist;
