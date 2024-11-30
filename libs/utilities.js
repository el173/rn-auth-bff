import { Platform } from 'react-native';
export const getDeepLink = (path = '') => {
  const scheme = 'myapp';
  const prefix = Platform.OS === 'android' ? `${scheme}://bffAuth/` : `${scheme}://`;
  return prefix + path;
};
