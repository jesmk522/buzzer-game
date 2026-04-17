/**
 * Buzzer 偵探 — 互動動畫版入口
 *
 * 劇本 A《老街失蹤疑雲》自動播放 + 選項互動模式：
 *   左側 62% 為 CSS + SVG 場景動畫
 *   右側 38% 為旁白走字（typewriter）
 *   關鍵節點暫停，底部滑出選項卡等用戶選擇
 */

import { CinematicPlayer } from './cinematic/renderer.js';
import { SCENES, SCENE_START } from './cinematic/script.js';

const root = document.getElementById('app');
const player = new CinematicPlayer(root, { scenes: SCENES, startId: SCENE_START });
player.start();
