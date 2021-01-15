<template>
  <canvas v-on:mousedown="down" v-on:touchstart="down" ref="canvas" width="1080" height="2160" />
</template>

<script>
const SEGMENT_COUNT = 5;
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 2160
const HANDLE_THICKNESS = 6;

const COLORS = [
  '#CE93D8',
  '#9FA8DA',
  '#81D4FA',
  '#80CBC4',
  '#C5E1A5'
]

const HANDLE_COLOR = '#EEEEEE';

const CLICK_BUFFER = 20;

class Segment {
  constructor (ctx, previousSegment, index, percent = 20) {
    this.ctx = ctx;
    this.previousSegment = previousSegment;
    this.index = index;
    this.percent = percent;
    this.color = COLORS[index];
  }

  get width () {
    return Math.round((2 * CANVAS_WIDTH) / 3);
  }

  get height () {
    return Math.round((this.percent / 100) * CANVAS_HEIGHT);
  }

  get startX () {
    return Math.round(CANVAS_WIDTH / 6);
  }

  get startY () {
    if (!this.previousSegment) {
      return 0;
    }

    return this.previousSegment.endY;
  }

  get endX () {
    return this.startX + this.width;
  }

  get endY () {
    return this.startY + this.height;
  }

  get handleStartX() {
    return this.startX;
  }

  get handleStartY() {
    return (this.startY - (HANDLE_THICKNESS / 2));
  }

  get handleEndX() {
    return this.startX + this.width;
  }

  get handleEndY() {
    return this.handleStartY + HANDLE_THICKNESS;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.startX, this.startY, this.width, this.height);

    if (this.previousSegment) {
      this.ctx.fillStyle = HANDLE_COLOR;
      this.ctx.fillRect(this.handleStartX, this.handleStartY, this.width, HANDLE_THICKNESS);
    }
  }

  isHandle(coords) {
    if (!this.previousSegment) {
      return false;
    }

    return (coords.x <= (this.handleEndX + CLICK_BUFFER)) &&
            (coords.x >= (this.handleStartX - CLICK_BUFFER)) &&
            (coords.y <= (this.handleEndY + CLICK_BUFFER)) &&
            (coords.y >= (this.handleStartY - CLICK_BUFFER));
  }
}

function lerp(value, fromMin, fromMax, toMin, toMax) {
  return ((toMin * (fromMax - value)) + (toMax * (value - fromMin)) / (fromMax - fromMin));
}

function getCoordsFromEvent(event) {
  const rect = event.target.getBoundingClientRect();

  let subEvent;

  if (event instanceof MouseEvent) {
    subEvent = event;
  } else if (event instanceof TouchEvent) {
    subEvent = event.changedTouches[0];
  } else {
    throw `Unexpected event type: ${typeof(event)}`;
  }

  return {
    x: subEvent.clientX - rect.left,
    y: subEvent.clientY - rect.top
  }
}

export default {
  name: 'Bar',
  data: function () {
    return {
      dragging: null,
      segments: [],
      ctx: null,
      startCoords: null,
      stopCoords: null
    }
  },
  methods: {
    initSegments: function () {
      this.segments = [];
      var previousSegment = null;

      for (var i = 0; i < SEGMENT_COUNT; i++) {
        var segment = new Segment(this.ctx, previousSegment, i);
      
        this.segments.push(segment);

        previousSegment = segment;
      }

      for (var j = 0; j < SEGMENT_COUNT; j++) {
        this.segments[j].draw();
      }
    },
    down: function (event) {
      let coords = getCoordsFromEvent(event);

      coords = this.convertToCanvasCoords(coords);

      this.dragging = this.clickedSegment(coords);

      if (!this.dragging) {
        return;
      }

      this.startCoords = coords;
    },
    up: function (event) {
      const coords = getCoordsFromEvent(event);

      const dragged = this.dragging;

      this.dragging = null;

      if (!dragged) {
        return;
      }

      this.stopCoords = coords;

      console.log(`Start: ${coords}`);
      console.log(`Stop: ${coords}`);
    },
    clickedSegment: function (coords) {
      for (var i = 0; i < SEGMENT_COUNT; i++) {
        if (this.segments[i].isHandle(coords)) {
          return this.segments[i];
        }
      }

      return null;
    },
    convertToCanvasCoords: function (coords) {
      return {
        x: lerp(coords.x, 0, this.$refs.canvas.clientWidth, 0, CANVAS_WIDTH),
        y: lerp(coords.y, 0, this.$refs.canvas.clientHeight, 0, CANVAS_HEIGHT)
      }
    }
  },
  mounted: function () {
    this.ctx = this.$refs.canvas.getContext('2d');
    window.addEventListener('mouseup', this.up);
    window.addEventListener('touchend', this.up);
    this.initSegments();
  }
}
</script>

<style scoped lang="scss">
canvas {
  max-width: 100%;
  max-height: 80vh;
}
</style>
