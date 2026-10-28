import next from 'eslint-config-next';

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'archive/**', 'scripts/**', 'video/**', 'next-env.d.ts'] },
  ...next,
];

export default config;
