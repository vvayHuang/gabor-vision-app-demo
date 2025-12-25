export const useAudio = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    let ctx: AudioContext | null = null;

    const initContext = () => {
        if (!ctx) ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();
    }

    const playTone = (freq: number, type: 'sine' | 'square' | 'triangle' | 'sawtooth', duration: number) => {
        initContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Envelope
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    const playCorrect = () => {
        // High blip
        playTone(880, 'sine', 0.1);
        setTimeout(() => playTone(1760, 'sine', 0.1), 50);
    };

    const playWrong = () => {
        // Low buzz
        playTone(150, 'sawtooth', 0.3);
    };

    return {
        playCorrect,
        playWrong
    };
};
