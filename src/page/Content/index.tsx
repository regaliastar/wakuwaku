import React, { FC, useCallback, useEffect, useRef } from 'react';
import _ from 'lodash';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useAudio } from 'react-use';
import style from './index.module.less';
import WordPanel from './WordPanel';
import Toolbar from './Toolbar';
import SelectPanel from './SelectPanel';
import less from '~style/common.module.less';
import {
  typingDone,
  stopTyping,
  hasAllReady,
  auto,
  currentCharactarSay,
  currentBg,
  currentChangeCharactors,
  toolbarVisiable,
  hasAllReadyInAuto,
  lastLabel,
  selectVisiable,
  selectItem,
  bgm,
} from '~store/content';
import { step, hash } from '~store/script';
import { CharactarSay, IfValue, Instruction } from '~interface/parser';
import EventTree, { NextEventParams } from '~util/EventTree';

const ROOT_PATH = `../..`;

const Content: FC = () => {
  // 共享状态
  const [_stopTyping, setStopTyping] = useRecoilState(stopTyping);
  const [_auto, setAuto] = useRecoilState(auto);
  const _hasAllReady = useRecoilValue(hasAllReady);
  const _hasAllReadyInAuto = useRecoilValue(hasAllReadyInAuto);
  const [curCharactorSay, setCurCharactorSay] = useRecoilState(currentCharactarSay);
  const [curBg, setCurBg] = useRecoilState(currentBg);
  const [curCharactors, setCurCharactor] = useRecoilState<string[]>(currentChangeCharactors);
  const [_toolbarVisiable, setToolbarVisiable] = useRecoilState(toolbarVisiable);
  const [_step, setStep] = useRecoilState(step);
  const [, setHash] = useRecoilState(hash);
  const [_typingDone] = useRecoilState(typingDone);
  const [_lastLabel, setLastLabel] = useRecoilState(lastLabel);
  const [_selectVisiable, setSelectVisiable] = useRecoilState(selectVisiable);
  const [_selectItem, setSelectItem] = useRecoilState<Array<IfValue>>(selectItem);
  const [_bgm, setBgm] = useRecoilState<string>(bgm);

  // 可丢失状态
  const firstRenderRef = useRef(true);
  const [audio, , controls] = useAudio({
    src: `../../statics/sound/${_bgm}`,
    autoPlay: true,
  });

  const triggerNextEvent = async (params?: NextEventParams) => {
    const node = EventTree.getNextNode(params);
    if (node === null) return null;
    setHash(node.hash);
    let event = node?.value;
    // console.log('triggerNextEvent', _hash, event);
    if (event === null) {
      return null;
    }
    if (
      event.length === 1 &&
      event[0].type === 'label' &&
      !_.isString(event[0].value) &&
      'instructions' in event[0].value
    ) {
      event = event[0].value.instructions as Instruction[];
    }
    const res = await Promise.all(
      event.map(instruction => {
        return new Promise<void>(resolve => {
          switch (instruction.type) {
            case 'say':
              setStopTyping(false);
              setCurCharactorSay(instruction.value as CharactarSay);
              break;
            case 'aside':
              setStopTyping(false);
              setCurCharactorSay({
                name: '',
                text: instruction.value as string,
              });
              break;
            case 'charactorChange':
              setCurCharactor(instruction.value as string[]);
              break;
            case 'bgChange':
              setCurBg(instruction.value as string);
              break;
            case 'bgmChange':
              setBgm(instruction.value as string);
              break;
            case 'if':
              setSelectVisiable(true);
              setSelectItem(instruction.value as IfValue[]);
              break;
            default:
              console.log(`unsolve type ${instruction}`);
          }
          resolve();
        });
      }),
    );
    setStep(_step + 1);
    return res;
  };

  useEffect(() => {
    if (_selectItem.length > 0 && _lastLabel !== '') {
      triggerNextEvent({ label: _lastLabel });
      setLastLabel('');
    }
  }, [_lastLabel]);

  useEffect(() => {
    let autoInterval: NodeJS.Timeout | undefined;
    if (_auto) {
      if (_hasAllReadyInAuto) {
        triggerNextEvent();
      }
      autoInterval = setInterval(async () => {
        if (!_auto) {
          return;
        }
        if (_hasAllReadyInAuto) {
          await triggerNextEvent();
        }
      }, 1500);
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
      debounceTrigger.cancel();
      controls.unmute();
    };
  }, []);

  const handleClick = async () => {
    if (_selectVisiable && _toolbarVisiable) return;
    if (_hasAllReady) {
      const res = await debounceTrigger();
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
    if (_auto) {
      setAuto(false);
      return;
    }
    if (!_typingDone) {
      setStopTyping(true);
      return;
    }
  };
  const debounceTrigger = useCallback(
    _.debounce(async () => await triggerNextEvent(), 200),
    [_toolbarVisiable, _auto, _step, _typingDone],
  );

  return (
    <div className={style.content} onClick={handleClick}>
      {audio}
      <Toolbar />
      {_selectVisiable && (
        <SelectPanel
          onClick={() => {
            setSelectVisiable(false);
          }}
        />
      )}
      <div className={less.bg} style={{ backgroundImage: curBg && `url(${ROOT_PATH}/drama/bg/${curBg})` }}>
        <div className={style.charactor}>
          {curCharactors.map(name => (
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
