<template>
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F1115] text-white overflow-hidden font-sans">

        <!-- Crosshair Grid Overlay -->
        <div class="absolute inset-0 pointer-events-none z-0">
            <!-- Vertical Line -->
            <div class="absolute left-1/2 top-0 bottom-0 w-[0.5px] bg-white/10 -translate-x-1/2"></div>
            <!-- Horizontal Line -->
            <div class="absolute top-1/2 left-0 right-0 h-[0.5px] bg-white/10 -translate-y-1/2"></div>

            <!-- Corner Accents -->
            <div class="absolute top-12 left-12 w-4 h-4 border-t-[0.5px] border-l-[0.5px] border-white/40"></div>
            <div class="absolute top-12 right-12 w-4 h-4 border-t-[0.5px] border-r-[0.5px] border-white/40"></div>
            <div class="absolute bottom-12 left-12 w-4 h-4 border-b-[0.5px] border-l-[0.5px] border-white/40"></div>
            <div class="absolute bottom-12 right-12 w-4 h-4 border-b-[0.5px] border-r-[0.5px] border-white/40"></div>
        </div>

        <div
            class="relative z-10 w-full max-w-6xl px-8 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border-[0.5px] border-white/10">

            <!-- Quadrant 1: Title & Sensitivity -->
            <div
                class="p-8 md:p-16 border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-white/10 flex flex-col justify-between min-h-[300px]">
                <div>
                    <h2 class="text-xs font-mono tracking-[0.4em] text-swiss-red font-black mb-4 uppercase">Analysis
                        Report</h2>
                    <h3 class="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8">
                        CALIBRATION<br />COMPLETE</h3>
                </div>

                <div class="flex flex-col gap-2">
                    <span class="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">Sensitivty Index</span>
                    <span class="text-6xl md:text-8xl font-black tracking-tighter">{{ Math.round(score * (accuracy || 1)
                        / 10) }}</span>
                </div>
            </div>

            <!-- Quadrant 2: Neural Speed & Success Rate -->
            <div class="p-8 md:p-16 flex flex-col justify-center gap-12 min-h-[300px]">
                <div class="flex flex-col gap-4">
                    <div class="flex items-baseline justify-between border-b-[0.5px] border-white/10 pb-4">
                        <span class="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">Neural Speed</span>
                        <div class="text-4xl font-black">
                            {{ avgRt ? Math.round(avgRt) : '---' }}<span
                                class="text-sm font-mono text-white/20 ml-2">MS</span>
                        </div>
                    </div>

                    <div class="flex items-baseline justify-between border-b-[0.5px] border-white/10 pb-4">
                        <span class="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">Success Rate</span>
                        <div class="text-4xl font-black">
                            {{ Math.round((accuracy || 0) * 100) }}<span
                                class="text-sm font-mono text-white/20 ml-2">%</span>
                        </div>
                    </div>

                    <div class="flex items-baseline justify-between border-b-[0.5px] border-white/10 pb-4">
                        <span class="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">Level
                            Attained</span>
                        <div class="text-4xl font-black">
                            {{ String(level).padStart(2, '0') }}
                        </div>
                    </div>
                </div>

                <!-- Professional Comment -->
                <div class="bg-white/5 p-6 border-l-2 border-swiss-red">
                    <p class="font-mono text-[11px] leading-relaxed text-slate-300">
                        <span class="text-white font-bold block mb-1 uppercase tracking-widest">Diagnostic
                            Verdict:</span>
                        NEURAL SIGNAL: {{ accuracy && accuracy > 0.8 ? 'STABLE_OPTIMAL' : 'CALIBRATING_SENSORY' }}<br />
                        REMEDY_PATH: {{ level > 10 ? 'PROCEDE_TO_ADVANCED_SCANNING' : 'CONTINUE_CONTRAST_REINFORCEMENT'
                        }}
                    </p>
                </div>
            </div>

            <!-- Quadrant 3 & 4 (Actions) -->
            <div class="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 border-t-[0.5px] border-white/10">
                <button @click="$emit('restart')"
                    class="p-6 md:p-10 bg-white text-black hover:bg-swiss-red hover:text-white transition-all duration-500 font-black tracking-[0.4em] uppercase text-xs md:text-sm border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-white/10">
                    [ RE-CALIBRATE ]
                </button>
                <button @click="$emit('close')"
                    class="p-6 md:p-10 hover:bg-white hover:text-black transition-all duration-500 font-black tracking-[0.4em] uppercase text-xs md:text-sm">
                    [ SAVE & EXIT ]
                </button>
            </div>
        </div>

        <!-- Bottom Decoration -->
        <div
            class="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/20 tracking-[1em] uppercase">
            Gabor_Vision_Precision_Calibration // Protocol_01
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    score: number;
    level: number;
    avgRt?: number;
    accuracy?: number;
}>();

defineEmits(['close', 'restart']);
</script>
