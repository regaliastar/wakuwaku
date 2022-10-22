import React, { FC, useEffect, useState } from 'react';
// import { Spin } from 'antd';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import style from './index.module.less';
import WordPanel from './WordPanel';
import Toolbar from './Toolbar';
import less from '~style/common.module.less';
import { stopTyping, hasAllReady, auto, currentCharactarSay, toolbarVisiable, hasAllReadyInAuto } from '~store/content';
import Container from '~util/container';

const ROOT_PATH = `../..`;

const Content: FC = () => {
  // 共享状态
  const setStopTyping = useSetRecoilState(stopTyping);
  const [_auto, setAuto] = useRecoilState(auto);
  const _hasAllReady = useRecoilValue(hasAllReady);
  const _hasAllReadyInAuto = useRecoilValue(hasAllReadyInAuto);
  const curCharactorSay = useRecoilValue(currentCharactarSay);
  const [_toolbarVisiable, setToolbarVisiable] = useRecoilState(toolbarVisiable);
  // 自身状态
  const [changeCharactors, setChangeCharactor] = useState<string[]>([]);
  const [bgImg, setBgImg] = useState('');

  const say = () => {
    setStopTyping(false);
  };
  const charactorChange = (names: string[]) => {
    setChangeCharactor(names);
  };
  const bgChange = (img: string) => {
    setBgImg(img);
  };

  useEffect(() => {
    let autoInterval: NodeJS.Timeout | undefined;
    if (_auto) {
      autoInterval = setInterval(async () => {
        if (!_auto) {
          return;
        }
        if (_hasAllReadyInAuto) {
          await Container.triggerNextEvent();
        }
      }, 1000);
    } else {
      clearInterval(autoInterval);
    }
    return () => clearInterval(autoInterval);
  }, [_auto]);

  useEffect(() => {
    Container.registerEvent('say', say);
    Container.registerEvent('aside', say);
    Container.registerEvent('charactorChange', charactorChange);
    Container.registerEvent('bgChange', bgChange);

    // 初始化
    if (Container._currentEventIndex === 0) {
      Container.triggerNextEvent();
    }
    return () => {
      Container.removeEvent(say);
      Container.removeEvent(charactorChange);
      Container.removeEvent(bgChange);
    };
  }, []);

  const handleClick = async () => {
    if (_hasAllReady) {
      const res = await Container.triggerNextEvent();
      if (res === null) {
        console.log('game over');
      }
      return;
    }
    if (!_hasAllReady) {
      // 按优先级依次执行
      if (!_toolbarVisiable) {
        setToolbarVisiable(true);
        return;
      }
      // 点击后必然要做的行为
      setStopTyping(true);
      setAuto(false);
    }
  };

  return (
    <div className={style.content} onClick={handleClick}>
      <Toolbar />
      <div className={less.bg} style={{ backgroundImage: bgImg && `url(${ROOT_PATH}/drama/bg/${bgImg})` }}>
        <div className={style.charactor}>
          {changeCharactors.map(name => (
            <img
              key={name}
              className={curCharactorSay.name === name ? style.activeCharactorImg : style.charactorImg}
              src={`${ROOT_PATH}/drama/charactor/${name}.png`}
            ></img>
          ))}
        </div>
      </div>
      <WordPanel />
    </div>
  );
};

export default Content;
