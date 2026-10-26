import { Platform } from 'react-native';

/** Android emulator gọi máy chủ qua 10.0.2.2; iOS simulator dùng localhost.
 *  Điện thoại thật: thay bằng http://<IP-LAN-của-máy-tính>:3000 */
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const BASE_URL = `http://${HOST}:3456`;
export const TIMEOUT = 10000;
export const CACHE_TTL = 5 * 60 * 1000;
