import SquareRoot from '../probGenerators/maths/squareRoot';
import Square from '../probGenerators/maths/square';

export const SUBJECT_ID_TO_NAME = {
  'maths': 'Maths',
  'physics': 'Physics',
  'chemistry': 'Chemistry',
}

export const GEN_IDS = {
  'maths': [
    'squareroot',
    'square',
  ],
};

export const GEN_ID_TO_GEN = {
  'maths': {
    'squareroot': SquareRoot,
    'square': Square,
  },
};

export const GEN_ID_TO_GEN_NAME = {
  'maths': {
    'squareroot': "Square Root",
    'square': "Square",
  },
};