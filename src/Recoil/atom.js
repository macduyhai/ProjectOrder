import { atom } from 'recoil';

const OPEN_MENU = 'openMenu';

const openMenuState = atom({
  key: OPEN_MENU,
  default: false
});

export { openMenuState };