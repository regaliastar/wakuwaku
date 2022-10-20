import { configureStore } from '@reduxjs/toolkit';
import rootReducers from './reducers';
// 实例化 store，全局唯一
const store = configureStore({
  reducer: rootReducers,
});
// 导出 Store 中的状态（state）类型
export type RootState = ReturnType<typeof store.getState>;
// 导出更改状态的 Dispatch 方法类型
export type AppDispatch = typeof store.dispatch;
// 默认导出 store，用于全局的 Provieder 消费
export default store;
