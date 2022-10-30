import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useAudio } from 'react-use';
import style from './index.module.less';
import less from '~style/common.module.less';
import { currentCharactarSay, currentBg, currentChangeCharactors, selectVisiable, selectItem } from '~store/content';
import { step, filename } from '~store/script';
import EventTree from '~util/EventTree';
import { scriptDir, scriptEntry } from '~store/global';
import { loadScript } from '~util/common';

const Welcome: FC = () => {
  const setCurCharactorSay = useSetRecoilState(currentCharactarSay);
  const setCurBg = useSetRecoilState(currentBg);
  const setCurCharactor = useSetRecoilState<string[]>(currentChangeCharactors);
  const [_step, setStep] = useRecoilState(step);
  const [, setSelectVisiable] = useRecoilState(selectVisiable);
  const [, setSelectItem] = useRecoilState(selectItem);
  const [_filename, setFilename] = useRecoilState(filename);
  const [_continue, setContinue] = useState<boolean>(false);
  const [audio, , controls] = useAudio({
    src: '../../statics/sound/welcome.mp3',
    autoPlay: true,
  });

  const init = () => {
    if (_filename !== scriptEntry) {
      setFilename(scriptEntry);
      EventTree.loadEvents(loadScript(`${scriptDir}/${scriptEntry}`));
    }
    setStep(0);
    setCurCharactorSay({
      name: '',
      text: '',
    });
    setCurBg('');
    setCurCharactor([]);
    setSelectVisiable(false);
    setSelectItem([]);
    EventTree.init();
  };

  useEffect(() => {
    if (_step !== 0) {
      setContinue(true);
    }
    return () => controls.unmute();
  }, []);

  return (
    <div className={`${style.banner} ${less.bg}`}>
      {audio}
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
