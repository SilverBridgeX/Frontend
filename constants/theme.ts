// app/constants/theme.ts

export const COLORS = {
  orange: '#FFA91D',
  lemon: '#FFE67F',
  lightLemon: '#FFF7D7',
  white: '#fff',
  gray: '#80000000',
  black: '#000000',
  background: '#000000'
};

export const FONT_SIZES = {
  title: 18,
  body: 16,
  small: 14,
  xsmall: 12,
};

export const RADIUS = {
  small: 8,
  medium: 16,
  large: 24,
  full: 30,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const INPUT_HEIGHT = 56;

export const SHADOWS = {
  bubble: {
    shadowColor: COLORS.black,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    shadowColor: COLORS.black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
};
