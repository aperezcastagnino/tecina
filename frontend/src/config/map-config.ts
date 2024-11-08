// Map generation
export const mapTiles = [0, 2, 3, 1, 5, 6, 8, 9];
export const frequency = [5, 25, 0, 5, 2, 0, 0, 1];

export const mapWidth = 19;
export const mapHeight = 40;

export const mapColors: { [key: number]: number } = {
  0: 0x6e5c4f, // Brown for 0
  1: 0x05aec8, // Cyan for 1
  2: 0x026440, // Darker green for 2
  7: 0x037d50, // Green for 7
  3: 0x00ff00, // Green for 3
  4: 0xffffff, // Blue for 4
  5: 0xffcc66, // Yellow for 5
  6: 0xff00ff, // Magenta for 6
  8: 0x0000ff, // Blue for 8
  9: 0xcc6666, // Red for 9
};
