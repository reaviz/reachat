import { create } from '@storybook/theming/create';
import ReachatLogo from './logo.svg';

export default create({
  base: 'dark',
  brandTitle: 'reachat',
  brandUrl: 'https://github.com/reaviz/reachat',
  brandImage: ReachatLogo,
  colorPrimary: '#0C77FF',
  appContentBg: '#11111F',
  appPreviewBg: '#11111F',
  fontBase: 'Inter,Arial,Helvetica,sans-serif',
  fontCode: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace',
  appBg: '#11111F',
  textColor: '#FFFFFF',
  barBg: '#11111F',
  appBorderColor: '#1f2937',
  inputBorder: '#1f2937',
  buttonBorder: '#1f2937'
});
