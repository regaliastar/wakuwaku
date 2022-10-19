import React, { FC, useState } from 'react';
import style from './index.module.less';
import WordPanel from './WordPanel';
import less from '~style/common.module.less';

const Content: FC = () => {
  const [shouldTyping, setShouldTyping] = useState(true);

  const handleClick = function () {
    setShouldTyping(false);
  };

  return (
    <div className={style.content} onClick={handleClick}>
      <div className={less.bg}>
        <div className={style.charactor}></div>
      </div>
      <WordPanel shouldTyping={shouldTyping}></WordPanel>
    </div>
  );
};

export default Content;
