import { ipcRenderer } from 'electron';
import routes from './entry/routes';
import Page from '~page/index';

const root = document.getElementById('#root');
routes.registerRoot(root);
routes.registerPage('/', Page.Banner._el);

const initPage = () => {
  const BannerHtmlEle = Page.Banner._el;
  // 只能传入 HTMLDivElement
  root?.appendChild(BannerHtmlEle);
};
initPage();

ipcRenderer.on('toRenderer', (event, args) => {
  console.log(args);
});
ipcRenderer.send('toMain', 'ping');
