export const BackgroundKeys = {
  MAIN_MENU: "MAIN_MENU_BACKGROUND",
  LEVELS: "LEVELS_BACKGROUND",
};

export const CharacterAssets = {
  PLAYER: "PLAYER",
  NPC: "NPC",
  OLD_MAN: {
    ASSET_KEY: "NPC",
    FRAME: 10,
  },
  GUY: {
    ASSET_KEY: "NPC",
    FRAME: 20,
  },
  GIRL: {
    ASSET_KEY: "NPC",
    FRAME: 30,
  },
  SCIENTIST: {
    ASSET_KEY: "NPC",
    FRAME: 40,
  },
  GOBLIN: {
    ASSET_KEY: "NPC",
    FRAME: 100,
  },
  WARRIOR: {
    ASSET_KEY: "NPC",
    FRAME: 110,
  },
  VIKING: {
    ASSET_KEY: "NPC",
    FRAME: 130,
  },
  WIZARD: {
    ASSET_KEY: "NPC",
    FRAME: 140,
  },
  DETECTIVE: {
    ASSET_KEY: "NPC",
    FRAME: 150,
  },
  BLONDE_GIRL: {
    ASSET_KEY: "NPC",
    FRAME: 160,
  },
  PINK_GIRL: {
    ASSET_KEY: "NPC",
    FRAME: 190,
  },
};
export const UIComponentKeys = {
  CURSOR: "CURSOR",
  BUTTON_CIRCLE: "BUTTON_CIRCLE",
  BUTTON_SHADOW: "BUTTON_SHADOW",
  HEALTH_BAR: {
    LEFT: {
      ASSET_KEY: "HEALTH_BAR_FILL_LEFT",
      WIDTH: 235,
    },
    RIGHT: {
      ASSET_KEY: "HEALTH_BAR_FILL_RIGHT",
      WIDTH: 690,
    },
    BACKGROUND: {
      ASSET_KEY: "HEALTH_BAR_BACKGROUND",
      WIDTH: 928,
    },
  },
  TITLE: "TITLE",
  START_BUTTON: "START_BUTTON",
  LOAD_BUTTON: "LOAD_BUTTON",
  CROSS: "CROSS",
  INSTRUCTIONS: "INSTRUCTIONS",
  HOW_TO_PLAY: "HOW_TO_PLAY",
  ARROWS: "ARROWS",
  SPACE: "SPACE",
  GAME_OVER: "GAME_OVER",
  WIN_TITLE: "WIN_TITLE",
};

export const TileKeys = {
  GRASS: "GRASS",
  TREE: "TREE",
  FLOWER_GRASS: "FLOWER_GRASS",
  DRY_GRASS: "DRY_GRASS",
  LEAVES_GRASS: "LEAVES_GRASS",
  YELLOW_TREE: "YELLOW_TREE",
  DRY_TREE: "DRY_TREE",
};

export const FruitAssets = {
  APPLE: {
    assetKey: "APPLE",
    animationKey: "APPLE_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
    scale: 2,
  },
  BANANAS: {
    assetKey: "BANANAS",
    animationKey: "BANANAS_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
    scale: 2,
  },
  CHERRIES: {
    assetKey: "CHERRIES",
    animationKey: "CHERRIES_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
    scale: 2,
  },
  KIWI: {
    assetKey: "KIWI",
    animationKey: "KIWI_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
    scale: 2,
  },
  MELON: {
    assetKey: "MELON",
    animationKey: "MELON_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
    scale: 2,
  },
  ORANGE: {
    assetKey: "ORANGE",
    animationKey: "ORANGE_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
    scale: 2,
  },
  PINEAPPLE: {
    assetKey: "PINEAPPLE",
    animationKey: "PINEAPPLE_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
    scale: 2,
  },
  STRAWBERRY: {
    assetKey: "STRAWBERRY",
    animationKey: "STRAWBERRY_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
    scale: 2,
  },
} as const;

export const AnimalAssets = {
  BUNNY: {
    assetKey: "BUNNY",
    animationKey: "BUNNY_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 6,
    frameRate: 8,
    scale: 3,
  },
  CAT: {
    assetKey: "CAT",
    animationKey: "CAT_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
    frameRate: 6,
    scale: 3,
  },
  CHICKEN: {
    assetKey: "CHICKEN",
    animationKey: "CHICKEN_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
    frameRate: 5,
    scale: 1.3,
  },
  DEER: {
    assetKey: "DEER",
    animationKey: "DEER_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 3,
    frameRate: 6,
    scale: 3,
  },
  FOX: {
    assetKey: "FOX",
    animationKey: "FOX_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 3,
    frameRate: 3,
    scale: 3,
  },
  FROG: {
    assetKey: "FROG",
    animationKey: "FROG_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
    frameRate: 2,
    scale: 1.5,
  },
  PIGEON: {
    assetKey: "PIGEON",
    animationKey: "PIGEON_ANIMATION",
    frameWidth: 16,
    frameHeight: 16,
    starFrame: 0,
    endFrame: 17,
    frameRate: 3,
    scale: 1.5,
  },
} as const;

export const ItemAssets = {
  ...FruitAssets,
  ...AnimalAssets,
} as const;

export type AssetKey = keyof typeof ItemAssets;
