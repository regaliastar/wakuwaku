import Dexie from 'dexie';
import { SaveData } from '~interface/common';

const db = new Dexie('SAVE_DATA');
// id 表示位于 save 界面的坐标，因此唯一
db.version(1.2).stores({
  saveData: '&id, filename, step, date, currentCharactarSay, currentChangeCharactors, currentBg, hash',
});
db.open();

export const saveHelper = {
  add: (data: SaveData) => {
    db.table('saveData').add(data);
  },
  getAll: async () => {
    return db.table('saveData').toArray();
  },
  put: async (item: SaveData) => {
    db.table('saveData').put(item, item.id);
  },
  find: async (id: string): Promise<false | SaveData> => {
    const res = await db.table('saveData').where('id').equals(id).first();
    if (res) {
      return res;
    }
    return false;
  },
  remove: async (id: string) => {
    return db.table('saveData').where('id').equals(id).delete();
  },
};
