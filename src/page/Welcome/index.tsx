import React, { FC } from 'react';
import style from './index.module.less';
import less from '~style/common.module.less';

const Welcome: FC = () => {
  return (
    <div className={`${style.banner} ${less.bg}`}>
      <a href="#/content">新的游戏</a>
      <a href="#/save">存档</a>
      <a href="#/settings">设置</a>
    </div>
  );
};

export default Welcome;
