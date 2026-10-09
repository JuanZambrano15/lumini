import { describe, expect, it } from 'vitest';
import { type Board, chooseComputerMove, emptyBoard, getWinner, isFull } from './logic';

const board = (cells: string): Board =>
  cells.split('').map((cell) => (cell === '.' ? null : (cell as 'X' | 'O')));

describe('tres en raya', () => {
  it('detecta ganador en filas, columnas y diagonales', () => {
    expect(getWinner(board('XXX......'))).toBe('X');
    expect(getWinner(board('O..O..O..'))).toBe('O');
    expect(getWinner(board('X...X...X'))).toBe('X');
    expect(getWinner(emptyBoard())).toBeNull();
  });

  it('detecta tablero lleno', () => {
    expect(isFull(board('XOXXOOOXX'))).toBe(true);
    expect(isFull(board('XOX.OOOXX'))).toBe(false);
  });

  it('la computadora gana cuando puede', () => {
    expect(chooseComputerMove(board('OO.XX....'))).toBe(2);
  });

  it('la computadora bloquea al niño', () => {
    expect(chooseComputerMove(board('XX..O....'))).toBe(2);
  });

  it('prefiere el centro si está libre', () => {
    expect(chooseComputerMove(board('X........'))).toBe(4);
  });
});
