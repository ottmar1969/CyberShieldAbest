import { useState, useEffect } from 'react';

interface FingerprintData {
  fingerprint: string;
  confidence: number;
}

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string>('');

  useEffect(() => {
    generateFingerprint().then(setFingerprint);
  }, []);

  return fingerprint;
}

async function generateFingerprint(): Promise<string> {
  const components: string[] = [];

  // Screen information
  components.push(screen.width.toString());
  components.push(screen.height.toString());
  components.push(screen.colorDepth.toString());

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Language
  components.push(navigator.language);

  // User agent
  components.push(navigator.userAgent);

  // Canvas fingerprint
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('CyberGuard fingerprint', 2, 2);
      components.push(canvas.toDataURL());
    }
  } catch (e) {
    components.push('canvas-blocked');
  }

  // WebGL fingerprint
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const renderer = gl.getParameter(gl.RENDERER);
      const vendor = gl.getParameter(gl.VENDOR);
      components.push(`${vendor}~${renderer}`);
    }
  } catch (e) {
    components.push('webgl-blocked');
  }

  // Audio context fingerprint
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const analyser = audioCtx.createAnalyser();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(analyser);
    analyser.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = 1000;
    gainNode.gain.value = 0;
    
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);
    
    components.push(Array.from(frequencyData.slice(0, 10)).join(','));
    
    oscillator.disconnect();
    analyser.disconnect();
    gainNode.disconnect();
  } catch (e) {
    components.push('audio-blocked');
  }

  // Create hash from components
  const fingerprint = await hashString(components.join('|'));
  return fingerprint;
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}