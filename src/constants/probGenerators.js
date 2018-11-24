import SquareRoot from '../probGenerators/squareRoot';
import Square from '../probGenerators/square';

export const GENERATOR_IDS = [
  'squareroot',
  'square',
];

export const GEN_ID_TO_GENERATOR = {
  'squareroot': SquareRoot,
  'square': Square,
};

export const GEN_ID_TO_NAME = {
  'squareroot': "Square Root",
  'square': "Square",
};