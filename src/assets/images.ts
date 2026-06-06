export const mascotImages = {
  sunny: require('../../assets/images/mascots/mascot-sunny.png'),
  rainy: require('../../assets/images/mascots/mascot-rainy.png'),
  quest: require('../../assets/images/mascots/mascot-quest.png'),
  globe: require('../../assets/images/mascots/globe.png'),
  welcome: require('../../assets/images/mascots/mascot-welcome.png'),
  noLocation: require('../../assets/images/mascots/mascot-no-location.png'),
} as const;

export type MascotImageKey = keyof typeof mascotImages;
