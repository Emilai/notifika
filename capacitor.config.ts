import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uy.notifika.notifika',
  appName: 'Notifika',
  webDir: 'www',
  bundledWebRuntime: false,
  server: { iosScheme: 'ionic' }
};

export default config;
