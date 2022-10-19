import React, { FC } from 'react';
import style from './WordPanel.module.less';

interface WordPanelParams {
  shouldTyping?: boolean;
}

const WordPanel: FC<WordPanelParams> = () => {
  return (
    <div className={style.wordPanel}>
      <div>{'name'}</div>
      <div className={style.text}></div>
    </div>
  );
};

export default WordPanel;
