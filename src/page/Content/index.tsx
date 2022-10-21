import React, { FC, useEffect, useState } from 'react';
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import style from './index.module.less';
import WordPanel from './WordPanel';
import less from '~style/common.module.less';
import { stopTyping, hasAllReady } from '~store/content';
import { currentEvent, currentEventIndex } from '~store/script';
import Container from '~util/container';
// import { CharactarSay } from '~interface/parser';

const Content: FC = () => {
  const event = useRecoilValue(currentEvent);
  const [eventIndex, setEventIndex] = useRecoilState(currentEventIndex);
  const setStopTyping = useSetRecoilState(stopTyping);
  const _hasAllReady = useRecoilValue(hasAllReady);
  const [changeCharactors, setChangeCharactor] = useState<string[]>([]);

  const say = () => {
    console.log('say');
  };
  const changeCharactor = (names: string[]) => {
    setChangeCharactor(names);
  };
  useEffect(() => {
    Container.registerEvent('say', say);
    Container.registerEvent('charactorChange', changeCharactor);
    return () => {
      Container.removeEvent(say);
      Container.removeEvent(changeCharactor);
    };
  }, []);
  const handleClick = async () => {
    if (_hasAllReady && event) {
      console.log(event);
      await Container.triggerEvent(event);
      setEventIndex(eventIndex + 1);
    }
    if (event === null) {
      // 游戏结束
      console.log('game over');
    }
    setStopTyping(true);
  };

  return eventIndex > 0 || event ? (
    <div className={style.content} onClick={handleClick}>
      <div className={less.bg}>
        <div className={style.charactor}>
          {changeCharactors.length > 0 ? (
            changeCharactors.map(name => (
              <img className="selector charactorImg" src={`../../drama/charactor/${name}.png`}></img>
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
