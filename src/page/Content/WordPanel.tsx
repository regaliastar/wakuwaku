import React, { FC, useEffect } from 'react';
import Typist from 'react-typist-component';
import { useDispatch, useSelector } from 'react-redux';
import style from './WordPanel.module.less';
import { RootState } from '~store/index';
import { setReadyState } from '~store/reducers/content';
import { CharactarSay } from '~interface/parser';

const WordPanel: FC<CharactarSay> = params => {
  const stopTyping = useSelector((value: RootState) => value.content.stopTyping);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!stopTyping) {
      dispatch(setReadyState({ typingDone: true }));
    }
  }, [stopTyping]);

  return (
    <div className={style.wordPanel}>
      <div>{params.name}</div>
      <div className={style.text}>
        {stopTyping ? (
          <span>{params.text}</span>
        ) : (
          <Typist onTypingDone={() => dispatch(setReadyState({ typingDone: true }))}>
            <span>{params.text}</span>
          </Typist>
        )}
      </div>
    </div>
  );
};

export default WordPanel;
