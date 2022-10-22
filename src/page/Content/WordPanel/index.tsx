import React, { FC, useEffect } from 'react';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import Typist from './Typist';
import style from './index.module.less';
import { CharactarSay } from '~interface/parser';
import { typingDone, stopTyping, currentCharactarSay } from '~store/content';
import Container from '~util/container';

const WordPanel: FC = () => {
  const setTypingDone = useSetRecoilState(typingDone);
  const [curCharactorSay, setCurCharactarSay] = useRecoilState(currentCharactarSay);
  const _stopTyping = useRecoilValue(stopTyping);

  const say = (result: CharactarSay) => {
    setCurCharactarSay(result);
  };
  const aside = (text: string) => {
    setCurCharactarSay({
      name: '',
      text,
    });
  };
  useEffect(() => {
    Container.registerEvent('say', say);
    Container.registerEvent('aside', aside);
    return () => {
      Container.removeEvent(say);
      Container.removeEvent(aside);
    };
  }, []);

  return (
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
  );
};

export default WordPanel;
