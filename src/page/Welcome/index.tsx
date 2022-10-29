import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import style from './index.module.less';
import less from '~style/common.module.less';
import { currentCharactarSay, currentBg, currentChangeCharactors } from '~store/content';
import { step } from '~store/script';
import EventTree from '~util/EventTree';

const Welcome: FC = () => {
  const setCurCharactorSay = useSetRecoilState(currentCharactarSay);
  const setCurBg = useSetRecoilState(currentBg);
  const setCurCharactor = useSetRecoilState<string[]>(currentChangeCharactors);
  const [_step, setStep] = useRecoilState(step);
  const [_continue, setContinue] = useState<boolean>(false);

  const init = () => {
    setStep(0);
    setCurCharactorSay({
      name: '',
      text: '',
    });
    setCurBg('');
    setCurCharactor([]);
    EventTree.init();
  };

  useEffect(() => {
    if (_step !== 0) {
      setContinue(true);
    }
  }, []);

  return (
    <div className={`${style.banner} ${less.bg}`}>
      {_continue && <Link to="/content">继续游戏</Link>}
      <Link to="/content" onClick={() => init()}>
        新游戏
      </Link>
      <Link to="/save">存档</Link>
      <Link to="/settings">设置</Link>
    </div>
  );
};

export default Welcome;
