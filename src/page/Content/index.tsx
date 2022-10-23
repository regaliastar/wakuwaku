import React, { FC, useEffect, useState, useRef } from 'react';
import _ from 'lodash';
// import { Spin } from 'antd';
import { useRecoilValue, useRecoilState } from 'recoil';
import style from './index.module.less';
import WordPanel from './WordPanel';
import Toolbar from './Toolbar';
import less from '~style/common.module.less';
import {
  typingDone,
  stopTyping,
  hasAllReady,
  auto,
  currentCharactarSay,
  toolbarVisiable,
  hasAllReadyInAuto,
} from '~store/content';
import { step, currentEvent } from '~store/script';
import { CharactarSay } from '~interface/parser';

const ROOT_PATH = `../..`;

const Content: FC = () => {
  // 共享状态
  const [_stopTyping, setStopTyping] = useRecoilState(stopTyping);
  const [_auto, setAuto] = useRecoilState(auto);
  const _hasAllReady = useRecoilValue(hasAllReady);
  const _hasAllReadyInAuto = useRecoilValue(hasAllReadyInAuto);
  const [curCharactorSay, setCurCharactorSay] = useRecoilState(currentCharactarSay);
  const [_toolbarVisiable, setToolbarVisiable] = useRecoilState(toolbarVisiable);
  const [_step, setStep] = useRecoilState(step);
  const _currentEvent = useRecoilValue(currentEvent);
  const [_typingDone, setTypingDone] = useRecoilState(typingDone);
  // 自身状态
  const [changeCharactors, setChangeCharactor] = useState<string[]>([]);
  const [bgImg, setBgImg] = useState('');
  const firstRenderRef = useRef(true);

  async function triggerNextEvent() {
    console.log('triggerNextEvent', _step, _currentEvent);
    if (_currentEvent === null) {
      return null;
    }
    const res = await Promise.all(
      _currentEvent.map(instruction => {
        return new Promise<void>(resolve => {
          if (instruction.type === 'say') {
            setStopTyping(false);
            setCurCharactorSay(instruction.value as CharactarSay);
          } else if (instruction.type === 'aside') {
            setCurCharactorSay({
              name: '',
              text: instruction.value as string,
            });
          } else if (instruction.type === 'charactorChange') {
            setChangeCharactor(instruction.value as string[]);
          } else if (instruction.type === 'bgChange') {
            setBgImg(instruction.value as string);
          }
          resolve();
        });
      }),
    );
    setStep(_step + 1);
    return res;
  }

  useEffect(() => {
    let autoInterval: NodeJS.Timeout | undefined;
    if (_auto) {
      autoInterval = setInterval(async () => {
        if (!_auto) {
          return;
        }
        if (_hasAllReadyInAuto) {
          await triggerNextEvent();
        }
      }, 2000);
    } else {
      clearInterval(autoInterval);
    }
    return () => clearInterval(autoInterval);
  }, [_auto, _step, _typingDone, _stopTyping]);

  // 初始化
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (_step === 0) {
      triggerNextEvent();
    }
    return () => {
      setStep(0);
    };
  }, []);

  const handleClick = _.throttle(async () => {
    if (_hasAllReady) {
      const res = await triggerNextEvent();
      if (res === null) {
        console.log('game over');
      }
      return;
    }
    // 按优先级依次执行
    if (!_toolbarVisiable) {
      setToolbarVisiable(true);
      return;
    }
    if (!_typingDone) {
      setTypingDone(true);
      return;
    }
    // 点击后必然要做的行为
    setStopTyping(true);
    setAuto(false);
  }, 800);

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
