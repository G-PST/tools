<script>
  /**
    Generates an SVG radar chart.
  */
  import { spring, tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { afterUpdate, beforeUpdate, getContext, onMount } from 'svelte'
  import { get, writable } from 'svelte/store'
  import { Svg } from 'layercake'

  import * as d3 from 'd3'
  import flabeler from '$lib/labeler'

  const { data, width, height } = getContext('LayerCake')

  $: x = d3
    .scalePoint()
    .domain([
      '',
      'instant',
      'milliseconds',
      'seconds',
      'minutes',
      'hours',
      'days',
      'months',
      'years',
      'decades',
      'N/A',
    ])
    .range([0, $width])

  $: y = d3
    .scalePoint()
    .domain([
      '',
      'component',
      'device',
      'facility',
      'municipality',
      'county',
      'state',
      'region',
      'country',
      'continent',
      'global',
      'N/A',
    ])
    .range([0, $height])

  $: color = d3.scaleOrdinal().domain($data.tools).range(d3.schemeSet3)
  $: buffer = 5

  function label_x(d, w) {
    return x_min(d) + (x_max(d) - x_min(d)) / 2
  }

  function label_y(d, w) {
    return y_min(d) + (y_max(d) - y_min(d)) / 2
  }

  function x_min(d, w) {
    return x(d['highest_temporal_resolution'] ? d['highest_temporal_resolution'] : 'N/A') - buffer
  }

  function x_max(d, w) {
    return x(d['largest_temporal_scope'] ? d['largest_temporal_scope'] : 'N/A') + buffer
  }

  function y_min(d, h) {
    return y(d['highest_spatial_resolution'] ? d['highest_spatial_resolution'] : 'N/A') - buffer
  }

  function y_max(d, h) {
    return y(d['largest_spatial_scope'] ? d['largest_spatial_scope'] : 'N/A') + buffer
  }

  function rect_width(d, w) {
    return Math.abs(x_min(d, w) - x_max(d, w))
  }

  function rect_height(d, h) {
    return Math.abs(y_min(d, h) - y_max(d, h))
  }

  let xaxis = null
  let yaxis = null

  $: {
    d3.select(xaxis).call(d3.axisTop(x))

    d3.select(yaxis).call(d3.axisLeft(y))
  }

  function name(d) {
    return d.name.toLowerCase().replace(/[^A-Za-z0-9]/g, '')
  }

  function mouseOver(d) {
    return function () {
      d3.select(this).attr('stroke-width', 3)
      d3.select('#' + name(d)).attr('font-weight', 'bold')
    }
  }

  function mouseOut(d) {
    return function () {
      d3.select(this).attr('stroke-width', 1)
      d3.select('#' + name(d)).attr('font-weight', 'normal')
    }
  }

  function xmur3(str) {
    for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
      h = (h << 13) | (h >>> 19)
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507)
      h = Math.imul(h ^ (h >>> 13), 3266489909)
      return (h ^= h >>> 16) >>> 0
    }
  }

  function sfc32(a, b, c, d) {
    return function () {
      a >>>= 0
      b >>>= 0
      c >>>= 0
      d >>>= 0
      var t = (a + b) | 0
      a = b ^ (b >>> 9)
      b = (c + (c << 3)) | 0
      c = (c << 21) | (c >>> 11)
      d = (d + 1) | 0
      t = (t + d) | 0
      c = (c + t) | 0
      return (t >>> 0) / 4294967296
    }
  }
  function rand(d) {
    // Create xmur3 state:
    var seed = xmur3(d.name)
    // Output four 32-bit hashes to provide the seed for sfc32.
    return sfc32(seed(), seed(), seed(), seed())
  }

  let labels = null
  let _labels = { label: () => [] }
  $: _labels = flabeler()
    .label(
      $data.ftools.map((d) => {
        const x = label_x(d)
        const y = label_y(d)
        return {
          name: d.name,
          x,
          y,
          org_x: x,
          org_y: y,
          width: 18.0,
          height: 7.2,
        }
      }),
    )
    .anchor(
      $data.ftools.map((d) => {
        return {
          x: label_x(d),
          y: label_y(d),
          r: 10,
        }
      }),
    )
    .width($width)
    .height($height)
    .start(1500)

  function get_labels(d, w, h) {
    return _labels.label()
  }

  let rendered_labels = []
  $: rendered_labels = get_labels($data.ftools, $width, $height)
</script>

<Svg>
  <g class="main" transform="translate({$width / 10} {$height / 5}) scale(0.8 1)">
    <g class="xaxis" bind:this={xaxis}>
      <text
        opacity="1"
        fill="currentColor"
        y="9"
        dy="0.71em"
        font-size="12px"
        text-anchor="middle"
        transform="translate({$width / 2} -50)"
      >
        Temporal Span
      </text>
    </g>
    <g class="yaxis" bind:this={yaxis}>
      <text
        opacity="1"
        fill="currentColor"
        y="9"
        dy="0.71em"
        font-size="12px"
        text-anchor="middle"
        transform="rotate(270) translate({-$height / 2} {-$width / 15})"
      >
        Spatial Span
      </text>
    </g>
    <g class="rects">
      {#each $data.ftools as d (d.name)}
        <rect
          fill={color(d)}
          stroke-dasharray="4"
          fill-opacity="0.25"
          x={x_min(d, $width)}
          y={y_min(d, $height)}
          width={rect_width(d, $width)}
          height={rect_height(d, $height)}
          stroke-width="1"
          stroke="black"
          on:mouseover={mouseOver(d)}
          on:focus={() => {}}
          on:mouseout={mouseOut(d)}
          on:blur={() => {}}
        />
      {/each}
    </g>
    <g class="labels" bind:this={labels}>
      {#each rendered_labels as d (d.name)}
        <text class="place-label" id={name(d)} x={d.x} y={d.y}>
          {d.name}
        </text>
        <line x1={d.x} y1={d.y} x2={d.org_x} y2={d.org_y} stroke="black" />
        <circle cx={d.org_x} cy={d.org_y} r="2" fill="black" />
      {/each}
    </g>
  </g>
</Svg>
