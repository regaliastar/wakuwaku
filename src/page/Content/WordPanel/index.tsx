import React, { FC } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Typist from './Typist';
import style from './index.module.less';
import { typingDone, stopTyping, currentCharactarSay, toolbarVisiable } from '~store/content';

const WordPanel: FC = () => {
  const setTypingDone = useSetRecoilState(typingDone);
  const curCharactorSay = useRecoilValue(currentCharactarSay);
  const _stopTyping = useRecoilValue(stopTyping);
  const _toolbarVisiable = useRecoilValue(toolbarVisiable);

  return _toolbarVisiable ? (
    <div className={style.wordPanel}>
      <div className={style.name}>{curCharactorSay.name}</div>
      {curCharactorSay.name && <div className={style.line}></div>}
      <div className={style.text}>
        <Typist
          text={curCharactorSay.text}
          stopTyping={_stopTyping}
          onTypingDone={() => {
            setTypingDone(true);
          }}
          onTypingStart={() => {
            setTypingDone(false);
          }}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default WordPanel;
