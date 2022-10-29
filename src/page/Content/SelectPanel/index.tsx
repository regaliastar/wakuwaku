import React, { FC } from 'react';
import { Button } from 'antd';
import { useRecoilState } from 'recoil';
import style from './index.module.less';
import { toolbarVisiable, lastLabel, selectItem } from '~store/content';

interface Params {
  onClick: () => void;
}

const SelectPanel: FC<Params> = (params: Params) => {
  const [_toolbarVisiable] = useRecoilState(toolbarVisiable);
  const [, setLastLabel] = useRecoilState(lastLabel);
  const [_selectItem] = useRecoilState(selectItem);
  const handleClick = (label: string) => {
    setLastLabel(label);
    params.onClick();
  };
  return _toolbarVisiable ? (
    <div className={style.select}>
      {_selectItem.map(item => {
        return (
          <Button
            className={style.button}
            size="large"
            block
            key={item.label}
            onClick={e => {
              e.stopPropagation();
              handleClick(item.label);
            }}
          >
            {item.text}
          </Button>
        );
      })}
    </div>
  ) : (
    <></>
  );
};

export default SelectPanel;
