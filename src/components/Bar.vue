<template>
  <canvas
    v-on:mousedown="down"
    v-on:touchstart="down"
    v-on:mousemove="move"
    v-on:touchmove="move"
    ref="canvas"
    width="1080"
    height="1187" />
</template>

<script>
import { SEGMENT_COLORS } from '@/common.js';

const SEGMENT_COUNT = 5;
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1187;
const HANDLE_THICKNESS = 8;
const AXIS_THICKNESS = HANDLE_THICKNESS;
const CLICK_BUFFER = 40;

const LIGHT_COLOR = '#BDBDBD';
const BACKGROUND_COLOR = '#212121';

class Segment {
  constructor (ctx, previous, index, percent = 20) {
    this.ctx = ctx;
    this.previous = previous;
    this.next = null;
    this.index = index;
    this.percent = percent;
    this.color = SEGMENT_COLORS[index];
  }

  get decimalPercent () {
    return this.percent / 100;
  } 

  get width () {
    return Math.round((2 * CANVAS_WIDTH) / 3);
  }

  get height () {
    return Math.round(this.decimalPercent * CANVAS_HEIGHT);
  }

  get startX () {
    return Math.round(CANVAS_WIDTH / 5);
  }

  get startY () {
    if (!this.previous) {
      return 0;
    }

    return this.previous.endY;
  }

  get endX () {
    return this.startX + this.width;
  }

  get endY () {
    return this.startY + this.height;
  }

  get handleStartX () {
    return this.startX;
  }

  get handleStartY () {
    return (this.startY - (HANDLE_THICKNESS / 2));
  }

  get handleEndX () {
    return this.startX + this.width - 1;
  }

  get handleEndY () {
    return this.handleStartY + HANDLE_THICKNESS;
  }

  draw () {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.startX, this.startY, this.width, this.height);

    if (!this.previous) {
      return;
    }

    this.ctx.fillStyle = LIGHT_COLOR;
    this.ctx.fillRect(this.handleStartX, this.handleStartY, this.width, HANDLE_THICKNESS);
  }

  isHandle (coords) {
    if (!this.previous) {
      return false;
    }

    return (coords.x <= (this.handleEndX + CLICK_BUFFER)) &&
            (coords.x >= (this.handleStartX - CLICK_BUFFER)) &&
            (coords.y <= (this.handleEndY + CLICK_BUFFER)) &&
            (coords.y >= (this.handleStartY - CLICK_BUFFER));
  }

  round() {
    this.percent = Math.round(this.percent);
  }
}

function canvasYPercentDelta(yStart, yStop) {
  return 100 * (yStop - yStart) / CANVAS_HEIGHT;
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
    /* Drawing Methods */
    drawBackground: function () {
      this.ctx.fillStyle = BACKGROUND_COLOR;
      this.ctx.fillRect(-0.5, -0.5, CANVAS_WIDTH, CANVAS_HEIGHT);
    },
    drawSegments: function () {
      for (var i = 0; i < SEGMENT_COUNT; i++) {
        this.segments[i].draw();
      }
    },
    drawAxis: function () {
      this.ctx.fillStyle = LIGHT_COLOR;
      this.ctx.fillRect(this.segments[0].startX - 60, 0, AXIS_THICKNESS, CANVAS_HEIGHT);
      this.ctx.fillRect(this.segments[0].startX - 60, 0, AXIS_THICKNESS, CANVAS_HEIGHT);
      this.ctx.fillRect(this.segments[0].startX - 90, 0, 60, AXIS_THICKNESS);
      this.ctx.fillRect(this.segments[0].startX - 90, CANVAS_HEIGHT - AXIS_THICKNESS, 60, AXIS_THICKNESS);
      this.ctx.save();
      this.ctx.textAlign = 'center';
      this.ctx.rotate(-Math.PI/2);
      this.ctx.font = '64px Verdana';
      this.ctx.fillText('share of wealth', CANVAS_HEIGHT / 2 - CANVAS_HEIGHT, this.segments[0].startX - 100);
      this.ctx.restore();
    },

    /* Event Handlers */
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
      this.doMove(event);
      this.dragging = null;
      this.roundPercents();
    },
    move: function (event) {
      if (this.throttled) {
        return;
      }

      this.doMove(event);

      this.throttled = true;

      setTimeout(function() { this.throttled = false; }.bind(this), 16);
    },


    /* Bar Mutation */
    doResize: function (segment, delta) {
      if (segment.percent - delta >= 1 && segment.previous.percent + delta >= 1) {
        segment.percent -= delta;
        segment.previous.percent += delta;
      }
    },
    doMove: function (event) {
      if (!this.dragging) {
        return;
      }

      let coords = getCoordsFromEvent(event);

      coords = this.convertToCanvasCoords(coords);

      this.stopCoords = coords;

      const delta = canvasYPercentDelta(this.startCoords.y, this.stopCoords.y);

      this.startCoords = this.stopCoords;

      this.doResize(this.dragging, delta);

      this.drawSegments();
      
      this.$emit('percents', this.percents());
    },
    roundPercents: function () {
      for (var i = 0; i < SEGMENT_COUNT; i++) {
        this.segments[i].round();
      }
    },

    /* Helpers */
    percents: function () {
      return this.segments.map(s => s.percent);
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
    },
    initSegments: function () {
      this.segments = [];
      var previous = null;

      for (var i = 0; i < SEGMENT_COUNT; i++) {
        var segment = new Segment(this.ctx, previous, i);

        if (previous) {
          previous.next = segment;
        }
      
        this.segments.push(segment);

        previous = segment;
      }
    }
  },
  mounted: function () {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.ctx.translate(0.5, 0.5);
    window.addEventListener('mouseup', this.up);
    window.addEventListener('touchend', this.up);
    this.initSegments();
    this.drawBackground();
    this.drawAxis();
    this.drawSegments();
  }
}
</script>

<style scoped lang="scss">
canvas {
  max-width: 1080px;
  max-height: 55vh;
}
</style>
