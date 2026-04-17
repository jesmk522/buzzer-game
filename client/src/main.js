/**
 * Buzzer 偵探 — 動畫版入口
 *
 * 劇本 A《老街失蹤疑雲》自動播放模式：
 *   左側 62% 為 CSS + SVG 場景動畫
 *   右側 38% 為旁白走字（typewriter）
 */

import { CinematicPlayer } from './cinematic/renderer.js';
import { CINEMATIC_SCRIPT } from './cinematic/script.js';

const root = document.getElementById('app');
const player = new CinematicPlayer(root, CINEMATIC_SCRIPT);
player.start();
