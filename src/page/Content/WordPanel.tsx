import React, { FC, useEffect } from 'react';
import Typist from 'react-typist-component';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import style from './WordPanel.module.less';
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
  useEffect(() => {
    if (!_stopTyping) {
      setReadyState({ typingDone: true });
    }
  }, [_stopTyping]);

  return (
    <div className={style.wordPanel}>
      <div>{curCharactorSay.name}</div>
      <div className={style.text}>
        {_stopTyping ? (
          <span>{curCharactorSay.text}</span>
        ) : (
          <Typist onTypingDone={() => setReadyState({ typingDone: true })}>
            <span>{curCharactorSay.text}</span>
          </Typist>
        )}
      </div>
    </div>
  );
};

export default WordPanel;
