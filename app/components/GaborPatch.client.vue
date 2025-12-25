<template>
  <div ref="sketchContainer" class="gabor-patch"></div>
</template>

<script setup lang="ts">
import p5 from 'p5';

const props = defineProps({
  size: {
    type: Number,
    default: 200
  },
  angle: {
    type: Number,
    default: 0
  },
  frequency: {
    type: Number,
    default: 0.025 // Thicker, bolder initial lines
  },
  sigma: {
    type: Number,
    default: 25 // Slightly sharper
  },
  contrast: {
    type: Number,
    default: 1.0 // 0.0 to 1.0
  },
  phase: {
    type: Number,
    default: 0 // 0 to TWO_PI
  }
});

const sketchContainer = ref<HTMLElement | null>(null);
let myp5: p5 | null = null;

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(props.size, props.size);
    p.noLoop();
    p.pixelDensity(2); // Retin-ready for smoother look
    p.frameRate(0);
  };

  p.draw = () => {
    p.background(127);
    p.loadPixels();

    // Convert angle to radians
    const theta = p.radians(props.angle);
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    const halfSize = props.size / 2;
    const d = p.pixelDensity();
    const fullSize = props.size * d;

    // Iterate over pixels (Retina aware)
    for (let y = 0; y < fullSize; y++) {
      for (let x = 0; x < fullSize; x++) {
        // Coordinates relative to center
        // Adjust for pixel density: mapped back to 0..size
        const xNorm = x / d;
        const yNorm = y / d;

        const xCentered = xNorm - halfSize;
        const yCentered = yNorm - halfSize;

        // Rotate coordinates
        const xRot = xCentered * cosTheta + yCentered * sinTheta;
        const yRot = -xCentered * sinTheta + yCentered * cosTheta;

        // Gaussian envelope
        const distSq = xCentered * xCentered + yCentered * yCentered;
        const gauss = Math.exp(-(distSq) / (2 * props.sigma * props.sigma));

        // Sinusoidal grating with Phase shift
        const sinus = Math.sin((xRot * props.frequency * p.TWO_PI) + props.phase);

        // Blended value
        // 127 is base gray. 
        // Contrast scales the deviation from 127.
        // Val range: 127 +/- (127 * contrast)
        let val = 127 + (127 * sinus * gauss * props.contrast);

        // Add Noise Overlay (Per-pixel)
        // Adds a gritty, film-like texture.
        // +/- 15 value range for visible but subtle texture
        const noise = (Math.random() - 0.5) * 30;

        // Only apply noise where the patch is visible (weighted by gauss) to avoid hard box edges, 
        // OR apply everywhere for full "film" effect.
        // User requested "Micro-disturbance on Gabor Patch", implying on the patch itself.
        // However, a full rect noise looks more like a "layer".
        // Let's blend it slightly with gauss so it fades out, but keep some background noise.
        val = val + noise;

        // Clamp
        val = Math.max(0, Math.min(255, val));

        // Set pixel color
        const index = 4 * (y * fullSize + x); // Flat array index

        p.pixels[index] = val;
        p.pixels[index + 1] = val;
        p.pixels[index + 2] = val;
        p.pixels[index + 3] = 255;
      }
    }

    p.updatePixels();
  };
};

onMounted(() => {
  if (sketchContainer.value) {
    myp5 = new p5(sketch, sketchContainer.value);
  }
});

onUnmounted(() => {
  if (myp5) {
    myp5.remove();
  }
});

// Watch for prop changes to redraw
watch(() => [props.size, props.angle, props.frequency, props.sigma, props.contrast, props.phase], () => {
  if (myp5) {
    // Resize canvas if size changes
    if (myp5.width !== props.size || myp5.height !== props.size) {
      myp5.resizeCanvas(props.size, props.size);
    }
    myp5.redraw();
  }
});
</script>

<style scoped>
.gabor-patch {
  display: inline-block;
  line-height: 0;
}
</style>
