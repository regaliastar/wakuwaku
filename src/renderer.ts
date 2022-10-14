import { ipcRenderer } from 'electron';
import routes from './entry/routes';
import Page from '~page/index';

const root = document.getElementById('#root');
routes.registerRoot(root);
routes.registerPage('Banner', Page.Banner._el);
routes.registerPage('Content', Page.Content._el);

const initPage = () => {
  const BannerHtmlEle = Page.Banner._el;
  root?.appendChild(BannerHtmlEle);
};
initPage();

ipcRenderer.on('toRenderer', (event, args) => {
  console.log(args);
});
ipcRenderer.send('toMain', 'ping');
