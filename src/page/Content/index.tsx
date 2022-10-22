import React, { FC, useEffect, useState } from 'react';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import style from './index.module.less';
import WordPanel from './WordPanel';
import less from '~style/common.module.less';
import { stopTyping, hasAllReady, auto, currentCharactarSay } from '~store/content';
import { currentEvent, currentEventIndex } from '~store/script';
import Container from '~util/container';

const ROOT_PATH = `../..`;

const Content: FC = () => {
  // 共享状态
  const event = useRecoilValue(currentEvent);
  const [eventIndex, setEventIndex] = useRecoilState(currentEventIndex);
  const setStopTyping = useSetRecoilState(stopTyping);
  const _auto = useRecoilValue(auto);
  const _hasAllReady = useRecoilValue(hasAllReady);
  const curCharactorSay = useRecoilValue(currentCharactarSay);
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
    if (_hasAllReady && _auto) {
      setTimeout(() => {
        handleClick();
      }, 500);
    }
  }, [_auto]);

  useEffect(() => {
    Container.registerEvent('say', say);
    Container.registerEvent('charactorChange', charactorChange);
    Container.registerEvent('bgChange', bgChange);

    // 初始化
    if (eventIndex === 0 && event) {
      Container.triggerEvent(event);
      setEventIndex(eventIndex + 1);
    }
    return () => {
      Container.removeEvent(say);
      Container.removeEvent(charactorChange);
      Container.removeEvent(bgChange);
    };
  }, []);
  const handleClick = async () => {
    console.log('handleClick', _hasAllReady, event);
    if (_hasAllReady && event) {
      await Container.triggerEvent(event);
      setEventIndex(eventIndex + 1);
      return;
    }
    if (event === null) {
      // 游戏结束
      console.log('game over');
      return;
    }
    if (!_hasAllReady) {
      setStopTyping(true);
    }
  };

  return eventIndex > 0 || event ? (
    <div className={style.content} onClick={handleClick}>
      <div className={less.bg} style={{ backgroundImage: `url(${ROOT_PATH}/drama/bg/${bgImg})` }}>
        <div className={style.charactor}>
          {changeCharactors.length > 0 ? (
            changeCharactors.map(name => (
              <img
                key={name}
                className={curCharactorSay.name === name ? style.activeCharactorImg : style.charactorImg}
                src={`${ROOT_PATH}/drama/charactor/${name}.png`}
              ></img>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
      <WordPanel></WordPanel>
    </div>
  ) : (
    <>Loading</>
  );
};

export default Content;
