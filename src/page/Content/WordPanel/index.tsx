import React, { FC, useEffect } from 'react';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import Typist from './Typist';
import style from './index.module.less';
import { CharactarSay } from '~interface/parser';
import { readyState, stopTyping, currentCharactarSay } from '~store/content';
import Container from '~util/container';

const WordPanel: FC = () => {
  const setReadyState = useSetRecoilState(readyState);
  const [curCharactorSay, setCurCharactarSay] = useRecoilState(currentCharactarSay);
  const _stopTyping = useRecoilValue(stopTyping);

  const say = (result: CharactarSay) => {
    setCurCharactarSay(result);
  };
  useEffect(() => {
    Container.registerEvent('say', say);
    return () => {
      Container.removeEvent(say);
    };
  }, []);

  return (
    <div className={style.wordPanel}>
      <div>{curCharactorSay.name}</div>
      <div className={style.text}>
        <Typist
          text={curCharactorSay.text}
          stopTyping={_stopTyping}
          onTypingDone={() => {
            setReadyState({ typingDone: true });
          }}
          onTypingStart={() => {
            setReadyState({ typingDone: false });
          }}
        />
      </div>
    </div>
  );
};

export default WordPanel;
