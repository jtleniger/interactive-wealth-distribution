<template>
  <canvas
    v-on:mousedown="down"
    v-on:touchstart="down"
    v-on:mousemove="move"
    v-on:touchmove="move"
    ref="canvas"
    width="1080"
    height="2160" />
</template>

<script>
const SEGMENT_COUNT = 5;
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 2160
const HANDLE_THICKNESS = 10;
const AXIS_THICKNESS = HANDLE_THICKNESS;

const COLORS = [
  '#CE93D8',
  '#9FA8DA',
  '#81D4FA',
  '#80CBC4',
  '#C5E1A5'
]

const HANDLE_COLOR = '#B0BEC5';
const AXIS_COLOR = HANDLE_COLOR;

const CLICK_BUFFER = 20;

class Segment {
  constructor (ctx, previousSegment, index, percent = 0.20) {
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
    return Math.round(this.percent * CANVAS_HEIGHT);
  }

  get startX () {
    return Math.round(CANVAS_WIDTH / 3);
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

function canvasYPercentDelta(yStart, yStop) {
  return (yStop - yStart) / CANVAS_HEIGHT;
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
      canvas: null,
      ctx: null,
      startCoords: null,
      stopCoords: null,
      throttled: false,
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

      this.draw();
    },
    draw: function () {
      this.ctx.fillStyle = '#263238';
      this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      for (var j = 0; j < SEGMENT_COUNT; j++) {
        this.segments[j].draw();
      }

      this.ctx.fillStyle = AXIS_COLOR;
      this.ctx.fillRect(this.segments[0].startX - 60, 0, AXIS_THICKNESS, CANVAS_HEIGHT);
      this.ctx.fillRect(this.segments[0].startX - 60, 0, AXIS_THICKNESS, CANVAS_HEIGHT);
      this.ctx.fillRect(this.segments[0].startX - 90, 0, 60, AXIS_THICKNESS);
      this.ctx.fillRect(this.segments[0].startX - 90, CANVAS_HEIGHT - AXIS_THICKNESS, 60, AXIS_THICKNESS);    
      this.ctx.save();
      this.ctx.textAlign = 'center';
      this.ctx.rotate(-Math.PI/2);
      this.ctx.font = '128px Helvetica';
      this.ctx.fillText('share of wealth', CANVAS_HEIGHT / 2 - CANVAS_HEIGHT, this.segments[0].startX - 100);
      this.ctx.restore();
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
    doMove: function (event) {
      if (!this.dragging) {
        return;
      }

      let coords = getCoordsFromEvent(event);

      coords = this.convertToCanvasCoords(coords);

      this.stopCoords = coords;

      const delta = canvasYPercentDelta(this.startCoords.y, this.stopCoords.y);

      this.dragging.percent -= delta;
      this.dragging.previousSegment.percent += delta;

      this.draw();

      this.startCoords = this.stopCoords;
    },
    up: function (event) {
      this.doMove(event);
      this.dragging = null;
    },
    move: function (event) {
      if (this.throttled) {
        return;
      }

      this.doMove(event);

      this.throttled = true;

      setTimeout(function() { this.throttled = false; }.bind(this), 16);
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
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    window.addEventListener('mouseup', this.up);
    window.addEventListener('touchend', this.up);
    this.initSegments();
  }
}
</script>

<style scoped lang="scss">
canvas {
  max-width: 100%;
  max-height: 70vh;
}
</style>
