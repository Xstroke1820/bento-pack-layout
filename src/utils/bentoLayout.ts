export interface ImageItem {
  id: string;
  src: string;
  width: number;
  height: number;
}

export interface LayoutItem extends ImageItem {
  colStart: number;
  rowStart: number;
  colSpan: number;
  rowSpan: number;
}

interface BlockSize {
  cols: number;
  rows: number;
}

const BLOCK_SIZES: BlockSize[] = [
  { cols: 2, rows: 2 },
  { cols: 2, rows: 1 },
  { cols: 1, rows: 2 },
  { cols: 1, rows: 1 },
];

/**
 * Calculate the best block size for an image based on its aspect ratio
 */
function getBestBlockSize(aspectRatio: number, availableSizes: BlockSize[]): BlockSize[] {
  // Sort by how close the block's aspect ratio matches the image's
  return [...availableSizes].sort((a, b) => {
    const ratioA = a.cols / a.rows;
    const ratioB = b.cols / b.rows;
    const diffA = Math.abs(ratioA - aspectRatio);
    const diffB = Math.abs(ratioB - aspectRatio);
    return diffA - diffB;
  });
}

/**
 * Check if a block fits at a given position
 */
function canFitBlock(
  grid: boolean[][],
  col: number,
  row: number,
  colSpan: number,
  rowSpan: number,
  maxCols: number
): boolean {
  // Check bounds
  if (col + colSpan > maxCols) return false;

  // Ensure grid has enough rows
  while (grid.length < row + rowSpan) {
    grid.push(new Array(maxCols).fill(false));
  }

  // Check if cells are free
  for (let r = row; r < row + rowSpan; r++) {
    for (let c = col; c < col + colSpan; c++) {
      if (grid[r][c]) return false;
    }
  }

  return true;
}

/**
 * Mark cells as occupied in the grid
 */
function occupyBlock(
  grid: boolean[][],
  col: number,
  row: number,
  colSpan: number,
  rowSpan: number
): void {
  for (let r = row; r < row + rowSpan; r++) {
    for (let c = col; c < col + colSpan; c++) {
      grid[r][c] = true;
    }
  }
}

/**
 * Find the next available position in the grid
 */
function findNextPosition(grid: boolean[][], maxCols: number): { col: number; row: number } {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < maxCols; col++) {
      if (!grid[row][col]) {
        return { col, row };
      }
    }
  }
  // If all cells are occupied, return the next row
  return { col: 0, row: grid.length };
}

/**
 * Generate a bento grid layout with minimal gaps
 */
export function generateBentoLayout(
  images: ImageItem[],
  gridColumns: number = 6,
  shuffle: boolean = true
): LayoutItem[] {
  const items = shuffle ? [...images].sort(() => Math.random() - 0.5) : [...images];
  const layout: LayoutItem[] = [];
  const grid: boolean[][] = [];

  for (const image of items) {
    const aspectRatio = image.width / image.height;
    
    // Get block sizes sorted by aspect ratio match
    const preferredSizes = getBestBlockSize(aspectRatio, BLOCK_SIZES);
    
    // Find the next available position
    let position = findNextPosition(grid, gridColumns);
    let placed = false;

    // Try to place the item with preferred sizes
    for (const size of preferredSizes) {
      if (canFitBlock(grid, position.col, position.row, size.cols, size.rows, gridColumns)) {
        // Place the item
        layout.push({
          ...image,
          colStart: position.col + 1, // CSS grid is 1-indexed
          rowStart: position.row + 1,
          colSpan: size.cols,
          rowSpan: size.rows,
        });

        occupyBlock(grid, position.col, position.row, size.cols, size.rows);
        placed = true;
        break;
      }
    }

    // If we couldn't place it at the ideal position, try other positions
    if (!placed) {
      let attempts = 0;
      const maxAttempts = gridColumns * 3;

      while (!placed && attempts < maxAttempts) {
        for (const size of preferredSizes) {
          // Try each column in the current and next few rows
          const startRow = position.row;
          for (let row = startRow; row < startRow + 3; row++) {
            for (let col = 0; col < gridColumns; col++) {
              if (canFitBlock(grid, col, row, size.cols, size.rows, gridColumns)) {
                layout.push({
                  ...image,
                  colStart: col + 1,
                  rowStart: row + 1,
                  colSpan: size.cols,
                  rowSpan: size.rows,
                });

                occupyBlock(grid, col, row, size.cols, size.rows);
                placed = true;
                break;
              }
            }
            if (placed) break;
          }
          if (placed) break;
        }
        attempts++;
        position = findNextPosition(grid, gridColumns);
      }
    }

    // Fallback: if still not placed, force place with smallest size
    if (!placed) {
      const smallestSize = { cols: 1, rows: 1 };
      const fallbackPos = findNextPosition(grid, gridColumns);
      
      // Ensure grid has space
      while (grid.length <= fallbackPos.row) {
        grid.push(new Array(gridColumns).fill(false));
      }

      layout.push({
        ...image,
        colStart: fallbackPos.col + 1,
        rowStart: fallbackPos.row + 1,
        colSpan: smallestSize.cols,
        rowSpan: smallestSize.rows,
      });

      occupyBlock(grid, fallbackPos.col, fallbackPos.row, smallestSize.cols, smallestSize.rows);
    }
  }

  return layout;
}
