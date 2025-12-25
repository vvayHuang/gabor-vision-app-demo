<template>
    <div
        class="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans selection:bg-swiss-red selection:text-white overflow-hidden relative">

        <!-- Layer 1: Base Background Color (Deep Cool Gray) -->
        <div class="fixed inset-0 bg-[#0F1115] z-0"></div>

        <!-- Layer 2: High Quality Noise Overlay -->
        <div class="fixed inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
            style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E'); background-size: 120px 120px;">
        </div>

        <!-- Top Left: Header -->
        <header v-if="gameState !== 'RESULTS'" class="absolute top-0 left-0 p-8 z-40 mix-blend-difference">
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4 text-white"
                style="letter-spacing: -0.05em;">
                GABOR<br />VISION
            </h1>

            <!-- Stats Display -->
            <transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0 translate-y-2"
                enter-to-class="opacity-100 translate-y-0">
                <div v-if="gameState === 'PLAYING'"
                    class="flex flex-col items-start gap-1 font-mono text-xs md:text-sm tracking-widest text-slate-200 font-bold mt-2">
                    <div class="flex items-center gap-4">
                        <span class="w-12 text-slate-400">LEVEL</span>
                        <span class="text-white">{{ String(level).padStart(2, '0') }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="w-12 text-slate-400">SCORE</span>
                        <span class="text-white">{{ String(score).padStart(5, '0') }}</span>
                    </div>
                </div>
            </transition>
        </header>

        <!-- Vertical Decoration -->
        <div v-if="gameState !== 'RESULTS'"
            class="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block z-0 pointer-events-none">
            <div class="writing-vertical-rl text-[10px] tracking-[0.2em] font-mono rotate-180 transition-colors duration-100 font-bold text-slate-300"
                :class="isFlashingRed ? 'text-swiss-red' : 'text-slate-300'">
                INTERNAL_SENSITIVITY_V1.0 /// NEURAL_OPTIMIZATION_PROTOCOL
            </div>
        </div>

        <!-- Main Content -->
        <main class="flex-grow flex items-center justify-center relative z-10 w-full h-full">

            <!-- START SCREEN -->
            <transition leave-active-class="transition duration-500 ease-in-out absolute inset-0 transform"
                leave-to-class="-translate-x-10 opacity-0">
                <div v-if="gameState === 'START'"
                    class="flex flex-col items-start max-w-xl px-8 w-full space-y-12 ml-0 md:ml-32 mt-32 md:mt-0">
                    <p class="text-lg font-light max-w-sm text-slate-300 leading-relaxed font-sans">
                        Enhance visual cortex via Gabor patch contrast sensitivity training.
                        <br /><br />
                        <span class="text-xs font-mono uppercase tracking-widest text-swiss-red font-bold">Warning: High
                            Ciliary Strain</span>
                    </p>

                    <button @click="startGame"
                        class="group relative px-10 py-5 border-[0.5px] border-white bg-transparent hover:bg-white hover:text-black transition-colors duration-300 text-sm tracking-widest font-black uppercase rounded-none">
                        <span>Start Training</span>
                        <div
                            class="absolute -right-3 -bottom-3 w-3 h-3 border-r-[0.5px] border-b-[0.5px] border-swiss-red opacity-0 group-hover:opacity-100 transition-all duration-300">
                        </div>
                    </button>
                </div>
            </transition>

            <!-- PLAYING SCREEN -->
            <transition enter-active-class="transition duration-700 delay-200 ease-out absolute inset-0 transform"
                enter-from-class="translate-y-20 opacity-0" enter-to-class="translate-y-0 opacity-100">
                <div v-if="gameState === 'PLAYING' || gameState === 'RESULTS'"
                    class="w-full h-full absolute inset-0 flex flex-col items-center justify-center transition-all duration-700"
                    :class="{ 'blur-md scale-95 opacity-30 grayscale': gameState === 'RESULTS' }">

                    <ClientOnly>
                        <TrainingGrid @game-over="handleGameOver" @stats-update="updateStats"
                            @wrong-answer="triggerRedFlash" ref="trainingGrid" />
                    </ClientOnly>

                    <!-- Bottom Controls -->
                    <div class="absolute bottom-12 flex items-center gap-8">
                        <button @click="abortSession"
                            class="text-[10px] text-slate-400 hover:text-swiss-red tracking-[0.2em] uppercase transition-colors rounded-none font-bold">
                            [ Abort Session ]
                        </button>

                        <div class="text-[10px] font-mono text-slate-300 tracking-widest animate-pulse font-bold">
                            SIGNAL: STABLE
                        </div>
                    </div>
                </div>
            </transition>

            <!-- RESULTS OVERLAY -->
            <transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-300 ease-in"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <ResultsOverlay v-if="gameState === 'RESULTS'" :score="score" :level="level" :avg-rt="avgRt"
                    :accuracy="accuracy" @restart="startGame" @close="resetToStart" />
            </transition>
        </main>

        <!-- Footer Decoration -->
        <div
            class="absolute bottom-0 right-0 p-8 border-t-[0.5px] border-l-[0.5px] border-white/10 w-32 h-32 hidden md:block pointer-events-none">
        </div>
    </div>
</template>

<script setup lang="ts">
type GameState = 'START' | 'PLAYING' | 'RESULTS';
const gameState = ref<GameState>('START');

const level = ref(1);
const score = ref(0);
const avgRt = ref(0);
const accuracy = ref(1);
const isFlashingRed = ref(false);

const startGame = () => {
    level.value = 1;
    score.value = 0;
    avgRt.value = 0;
    accuracy.value = 1;
    gameState.value = 'PLAYING';
};

const updateStats = (stats: { level: number, score: number, avgRt?: number, accuracy?: number }) => {
    level.value = stats.level;
    score.value = stats.score;
    if (stats.avgRt !== undefined) avgRt.value = stats.avgRt;
    if (stats.accuracy !== undefined) accuracy.value = stats.accuracy;
};

const triggerRedFlash = () => {
    isFlashingRed.value = true;
    setTimeout(() => {
        isFlashingRed.value = false;
    }, 200);
}

const handleGameOver = () => {
    gameState.value = 'RESULTS';
};

const abortSession = () => {
    handleGameOver();
};

const resetToStart = () => {
    gameState.value = 'START';
    level.value = 1;
    score.value = 0;
};
</script>

<style>
.writing-vertical-rl {
    writing-mode: vertical-rl;
}
</style>
