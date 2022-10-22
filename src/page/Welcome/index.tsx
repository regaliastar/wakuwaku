import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import style from './index.module.less';
import less from '~style/common.module.less';

const Welcome: FC = () => {
  return (
    <div className={`${style.banner} ${less.bg}`}>
      <Link to="/content">新的游戏</Link>
      <Link to="/save">存档</Link>
      <Link to="/settings">设置</Link>
    </div>
  );
};

export default Welcome;
