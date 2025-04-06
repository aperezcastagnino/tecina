export const BackgroundKeys = {
  MAIN_MENU: "MAIN_MENU_BACKGROUND",
  LEVELS: "LEVELS_BACKGROUND",
};

export const CharacterKeys = {
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
};
export const UIComponentKeys = {
  CURSOR: "CURSOR",
  BUTTON_CIRCLE: "BUTTON_CIRCLE",
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
};

export const TileKeys = {
  GRASS: "GRASS",
  TREE: "TREE",
  FLOWER_GRASS: "FLOWER_GRASS",
};

export const ItemKeys = {
  FRUITS: {
    APPLE: {
      ASSET_KEY: "APPLE",
      ANIMATION_KEY: "APPLE_ANIMATION",
      FRAME_WIDTH: 32,
      FRAME_HEIGHT: 32,
      STAR_FRAME: 0,
      END_FRAME: 17,
    },
    BANANAS: {
      ASSET_KEY: "BANANAS",
      ANIMATION_KEY: "BANANAS_ANIMATION",
      FRAME_WIDTH: 32,
      FRAME_HEIGHT: 32,
      STAR_FRAME: 0,
      END_FRAME: 17,
    },
    CHERRIES: {
      ASSET_KEY: "CHERRIES",
      ANIMATION_KEY: "CHERRIES_ANIMATION",
      FRAME_WIDTH: 32,
      FRAME_HEIGHT: 32,
      STAR_FRAME: 0,
      END_FRAME: 17,
    },
    KIWI: {
      ASSET_KEY: "KIWI",
      ANIMATION_KEY: "KIWI_ANIMATION",
      FRAME_WIDTH: 32,
      FRAME_HEIGHT: 32,
      STAR_FRAME: 0,
      END_FRAME: 17,
    },
    MELON: {
      ASSET_KEY: "MELON",
      ANIMATION_KEY: "MELON_ANIMATION",
      FRAME_WIDTH: 32,
      FRAME_HEIGHT: 32,
      STAR_FRAME: 0,
      END_FRAME: 17,
    },
    ORANGE: {
      ASSET_KEY: "ORANGE",
      ANIMATION_KEY: "ORANGE_ANIMATION",
      FRAME_WIDTH: 32,
      FRAME_HEIGHT: 32,
      STAR_FRAME: 0,
      END_FRAME: 17,
    },
    PINEAPPLE: {
      ASSET_KEY: "PINEAPPLE",
      ANIMATION_KEY: "PINEAPPLE_ANIMATION",
      FRAME_WIDTH: 32,
      FRAME_HEIGHT: 32,
      STAR_FRAME: 0,
      END_FRAME: 17,
    },
    STRAWBERRY: {
      ASSET_KEY: "STRAWBERRY",
      ANIMATION_KEY: "STRAWBERRY_ANIMATION",
      FRAME_WIDTH: 32,
      FRAME_HEIGHT: 32,
      STAR_FRAME: 0,
      END_FRAME: 17,
    },
  },
};

export const AssetLookup = new Map<
  string,
  { category: string; key: string; path: string[] }
>();

export function findAssetKeyByValue(value: string) {
  return AssetLookup.get(value);
}

function buildLookupMap(obj: any, category: string, path: string[] = []) {
  Object.entries(obj).forEach(([key, value]) => {
    const currentPath = [...path, key];

    if (typeof value === "object" && value !== null) {
      buildLookupMap(value, category, currentPath);
    } else if (typeof value === "string") {
      AssetLookup.set(value, {
        category,
        key,
        path: currentPath,
      });
    }
  });
}

buildLookupMap(BackgroundKeys, "BACKGROUNDS");
buildLookupMap(CharacterKeys, "NPCS");
buildLookupMap(UIComponentKeys, "UI_COMPONENTS");
buildLookupMap(TileKeys, "TILES");
buildLookupMap(ItemKeys, "ITEMS");
