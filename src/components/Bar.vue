<template>
  <div>
    <canvas ref="canvas" width="1080" height="2160" />
  </div>
</template>

<script>
const SEGMENT_COUNT = 5;
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 2160

const COLORS = [
  '#D32F2F',
  '#512DA8',
  '#0288D1',
  '#388E3C',
  '#FBC02D'
]

const HANDLE_COLOR = '#616161';

class Segment {
  constructor (ctx, previous, position) {
    this.ctx = ctx;
    this.previous = previous;
    this.position = position;
    this.percent = 20;
    this.color = COLORS[position];
  }

  get canvasWidth () {
    return CANVAS_WIDTH - 45;
  }

  get canvasHeight () {
    return Math.round((this.percent / 100) * CANVAS_HEIGHT);
  }

  get startY () {
    if (!this.previous) {
      return 0;
    }

    return this.previous.endY;
  }

  get endY () {
    return this.startY + this.canvasHeight;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(0, this.startY, this.canvasWidth, this.canvasHeight);

    if (this.previous) {
      this.ctx.fillStyle = HANDLE_COLOR;
      this.ctx.fillRect(0, this.startY - 10, this.canvasWidth + 20, 20);
      this.ctx.beginPath();
      this.ctx.arc(this.canvasWidth, this.startY, 45, 0, 2 * Math.PI, false);
      this.ctx.fill();
    }
  }
}

export default {
  name: 'Bar',
  data: function () {
    return {
      segments: [],
      ctx: null
    }
  },
  methods: {
    initSegments: function () {
      this.segments = [];
      var previous = null;

      for (var i = 0; i < SEGMENT_COUNT; i++) {
        var segment = new Segment(this.ctx, previous, i);
      
        this.segments.push(segment);

        previous = segment;
      }

      for (var j = 0; j < SEGMENT_COUNT; j++) {
        this.segments[j].draw();
      }
    },
  },
  mounted: function () {
    this.ctx = this.$refs.canvas.getContext('2d');
    this.initSegments();
  }
}
</script>

<style scoped lang="scss">
canvas {
  max-width: 100%;
  max-height: 100vh;
}
</style>
