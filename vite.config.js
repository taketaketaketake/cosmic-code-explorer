import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg'],
  base: './', // Ensures assets are resolved correctly after build
});
