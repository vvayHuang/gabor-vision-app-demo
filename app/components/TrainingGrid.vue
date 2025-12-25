<template>
  <div class="flex flex-col items-center justify-center w-full h-full relative">

    <!-- Grid Container -->
    <!-- Swiss Style: gap-0, thin borders with inset shadow -->
    <div
      class="grid gap-0 bg-swiss-base border-[0.5px] border-white/20 relative transition-all duration-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
      :class="{
        'animate-shake-swiss': isWrong,
        'opacity-100': showRound,
        'opacity-0': !showRound,
        'grid-cols-2': gridSize === 2,
        'grid-cols-3': gridSize === 3
      }" :style="{ transform: `translate(${gridOffset.x}px, ${gridOffset.y}px)` }">
      <div v-for="(patch, index) in patches" :key="index"
        class="bg-swiss-bg flex items-center justify-center cursor-pointer relative overflow-hidden group border-[0.5px] border-white/5"
        :class="{
          '!invert': showFeedback && index === correctIndex,
          'w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]': gridSize === 2,
          'w-[100px] h-[100px] sm:w-[140px] sm:h-[140px]': gridSize === 3
        }" @click="handlePatchClick(index)">
        <!-- Micro-numbering (Swiss Monospace) -->
        <div class="absolute top-2 left-2 text-[10px] font-mono text-white/30 pointer-events-none z-10 font-medium">
          {{ String(index + 1).padStart(2, '0') }}
        </div>

        <!-- Border for grid separation (Internal borders) -->
        <!-- <div class="absolute inset-0 border-[0.25px] border-swiss-base/20 pointer-events-none"></div> -->

        <GaborPatch :size="gaborSize" :angle="patch.angle" :contrast="patch.contrast" :frequency="patch.frequency"
          :sigma="patch.sigma" :phase="patch.phase" />

        <!-- Hover Effect (Subtle) -->
        <div
          class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import { useAudio } from '../composables/useAudio';

// Types
interface PatchData {
  angle: number;
  frequency: number;
  phase: number;
  contrast: number;
  sigma: number;
}

const emit = defineEmits(['result', 'game-over', 'stats-update', 'wrong-answer']);

// State
const level = ref(1);
const score = ref(0);
const patches = ref<PatchData[]>([]);
const correctIndex = ref(0);
const clickedIndex = ref(-1);
const showFeedback = ref(false);
const isWrong = ref(false);
// Transition state
const showRound = ref(false);

// Metrics
const startTime = ref(0);
const responseTimes = ref<number[]>([]);
const highScore = ref(0);
const totalSessions = ref(0);
const correctClicks = ref(0);
const totalClicks = ref(0);

// Logic modes
const gridSize = ref(2);
const gridOffset = ref({ x: 0, y: 0 });

// Use audio
const { playCorrect, playWrong } = useAudio();

onMounted(() => {
  const savedHigh = localStorage.getItem('gabor_high_score');
  const savedSessions = localStorage.getItem('gabor_total_sessions');
  if (savedHigh) highScore.value = Number(savedHigh);
  if (savedSessions) totalSessions.value = Number(savedSessions);

  // Track this new session
  totalSessions.value++;
  localStorage.setItem('gabor_total_sessions', String(totalSessions.value));
});

// Responsive size
const { width } = useWindowSize();
const gaborSize = computed(() => {
  if (gridSize.value === 3) return width.value < 640 ? 100 : 130;
  return width.value < 640 ? 140 : 180;
});

const startNextRound = async () => {
  showRound.value = false;
  await new Promise(resolve => setTimeout(resolve, 300));

  showFeedback.value = false;
  clickedIndex.value = -1;
  isWrong.value = false;

  // --- 1. ADAPTIVE GRID SIZE ---
  // If consecutive RT < 1.2s for last 3 rounds, move to 3x3
  const recentRTs = responseTimes.value.slice(-3);
  const fastStreak = recentRTs.length >= 3 && recentRTs.every(rt => rt < 1200);

  if (fastStreak || (level.value > 8 && Math.random() < 0.3)) {
    gridSize.value = 3;
  } else {
    gridSize.value = 2;
  }

  // --- 2. DYNAMIC SCANNING (Level 10+) ---
  if (level.value >= 10) {
    // Random position offset to force eye scanning
    gridOffset.value = {
      x: (Math.random() - 0.5) * (width.value * 0.4),
      y: (Math.random() - 0.5) * (width.value * 0.2)
    };
  } else {
    gridOffset.value = { x: 0, y: 0 };
  }

  // --- 3. DIFFICULTY CALIBRATION ---
  let angleOffset = Math.max(5, 30 * Math.pow(0.85, level.value - 1));
  let baseContrast = Math.max(0.12, 1.0 - (level.value * 0.05));
  let baseFrequency = 0.025 + (Math.random() * 0.01 * Math.min(6, level.value));

  // 3x3 Constraints: higher angle diff, thicker lines
  if (gridSize.value === 3) {
    angleOffset = Math.max(angleOffset, 8);
    baseFrequency = 0.025 + (Math.random() * 0.005); // Force thickness
  }

  // RT Adaptation
  if (responseTimes.value.length > 0) {
    const lastRT = responseTimes.value[responseTimes.value.length - 1];
    if (lastRT !== undefined) {
      // Struggle (> 4s) -> Make easier
      if (lastRT > 4000) {
        baseFrequency = 0.02; // Very thick
        baseContrast = Math.min(1.0, baseContrast * 1.5);
      }
      // Fast (< 1.2s) -> Harder
      else if (lastRT < 1200) {
        baseContrast *= 0.85;
      }
    }
  }

  const baseAngle = Math.random() * 180;
  const direction = Math.random() > 0.5 ? 1 : -1;
  const targetAngle = baseAngle + (angleOffset * direction);

  const totalPatches = gridSize.value * gridSize.value;
  correctIndex.value = Math.floor(Math.random() * totalPatches);

  patches.value = Array(totalPatches).fill(null).map((_, i) => ({
    angle: i === correctIndex.value ? targetAngle : baseAngle,
    frequency: baseFrequency + (Math.random() * 0.002),
    phase: Math.random() * Math.PI * 2,
    contrast: baseContrast,
    sigma: 25 + Math.random() * 12
  }));

  const avgRt = responseTimes.value.length > 0
    ? responseTimes.value.reduce((a, b) => a + b, 0) / responseTimes.value.length
    : 0;

  emit('stats-update', {
    level: level.value,
    score: score.value,
    avgRt,
    accuracy: totalClicks.value > 0 ? (correctClicks.value / totalClicks.value) : 1
  });

  showRound.value = true;
  startTime.value = performance.now();
};

const handlePatchClick = async (index: number) => {
  if (showFeedback.value) return;

  totalClicks.value++;
  const rt = performance.now() - startTime.value;
  clickedIndex.value = index;

  if (index === correctIndex.value) {
    correctClicks.value++;
    score.value += 10 * level.value;
    responseTimes.value.push(rt);

    if (score.value > highScore.value) {
      highScore.value = score.value;
      localStorage.setItem('gabor_high_score', String(highScore.value));
    }

    showFeedback.value = true;
    playCorrect();
    if (navigator.vibrate) navigator.vibrate(20);

    if (score.value % 60 === 0) level.value++;

    setTimeout(() => {
      startNextRound();
    }, 150);
  } else {
    isWrong.value = true;
    playWrong();
    emit('wrong-answer');
    if (navigator.vibrate) navigator.vibrate([40, 40]);
    score.value = Math.max(0, score.value - 8);

    setTimeout(() => {
      isWrong.value = false;
    }, 400);
  }
};

onMounted(() => {
  startNextRound();
});

</script>

<style scoped>
/* Swiss Style Shake: Horizontal 2px, sharp */
@keyframes shake-swiss {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-2px);
  }

  75% {
    transform: translateX(2px);
  }
}

.animate-shake-swiss {
  animation: shake-swiss 0.1s steps(2) 3;
  /* Sharp, digital shake */
}
</style>
