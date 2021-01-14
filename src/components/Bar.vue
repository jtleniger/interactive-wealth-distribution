<template>
  <div>
    <canvas ref="canvas" width="1080" height="540" />
  </div>
</template>

<script>
const SEGMENT_COUNT = 5;
const CANVAS_WIDTH = 1080;

const COLORS = [
  '#D32F2F',
  '#512DA8',
  '#0288D1',
  '#388E3C',
  '#FBC02D'
]

class Segment {
  constructor (position) {
    this.position = position;
    this.percent = 20;
    this.color = COLORS[position];
  }

  get widthOnCanvas() {
    return Math.round((this.percent / 100) * CANVAS_WIDTH);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position * this.widthOnCanvas, 0, this.widthOnCanvas, 540);
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

      for (var i = 0; i < SEGMENT_COUNT; i++) {
        this.segments.push(new Segment(i));
        this.segments[i].draw(this.ctx);
      }

      console.log(this.segments);
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
}
</style>
