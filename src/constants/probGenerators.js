import SquareRoot from '../probGenerators/squareRoot';
import Square from '../probGenerators/square';

export const GENERATOR_IDS = [
  'SQUARE_ROOT',
  'SQUARE',
];

export const GEN_ID_TO_GENERATOR = {
  'SQUARE_ROOT': SquareRoot,
  'SQUARE': Square,
};

export const GEN_ID_TO_NAME = {
  'SQUARE_ROOT': "Square Root",
  'SQUARE': "Square",
};