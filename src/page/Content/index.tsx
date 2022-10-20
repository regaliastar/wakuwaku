import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from './index.module.less';
import WordPanel from './WordPanel';
import less from '~style/common.module.less';
import { setStopTyping, setReadyState } from '~store/reducers/content';
import { RootState } from '~store/index';

const Content: FC = () => {
  const dispatch = useDispatch();
  const name = 'tt';
  const text = '我是一个测试 typing 文本';
  const handleClick = () => {
    dispatch(setStopTyping(true));
    const AllStateReady = useSelector((value: RootState) => Object.values(value.content.readyState).every(_ => _));
    // const AllStateReady = dispatch(getReadyState());
    if (AllStateReady) {
      //
      setReadyState({ typingDone: false });
    }
  };

  return (
    <div className={style.content} onClick={handleClick}>
      <div className={less.bg}>
        <div className={style.charactor}></div>
      </div>
      <WordPanel name={name} text={text}></WordPanel>
    </div>
  );
};

export default Content;
