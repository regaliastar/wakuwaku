import React, { FC, useEffect } from 'react';
import TypistComponent from 'react-typist-component';

interface TypistType {
  text: string;
  stopTyping: boolean;
  onTypingDone?: () => void;
  onTypingStart?: () => void;
}

const Typist: FC<TypistType> = (params: TypistType) => {
  useEffect(() => {
    params.onTypingStart?.();
  }, [params.text]);

  // 强制结束触发Done事件
  useEffect(() => {
    if (params.stopTyping) {
      params.onTypingDone?.();
    }
  }, [params.stopTyping]);
  return (
    <TypistComponent
      restartKey={params.text}
      onTypingDone={() => {
        params.onTypingDone?.();
      }}
      disabled={params.stopTyping}
    >
      {params.text}
    </TypistComponent>
  );
};

export default Typist;
