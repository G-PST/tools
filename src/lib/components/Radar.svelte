<script>
  /**
    Generates an SVG radar chart.
  */
  import { getContext } from 'svelte'
  import { line, curveCardinalClosed } from 'd3-shape'

  const { data, width, height, xGet, config } = getContext('LayerCake')

  $: angleSlice = (Math.PI * 2) / $config.x.length

  $: path = line()
    .curve(curveCardinalClosed)
    .x((d, i) => d * Math.cos(angleSlice * i - Math.PI / 2))
    .y((d, i) => d * Math.sin(angleSlice * i - Math.PI / 2))

  $: cx = (circleR, i) => circleR * Math.cos(angleSlice * i - Math.PI / 2)
  $: cy = (circleR, i) => circleR * Math.sin(angleSlice * i - Math.PI / 2)
</script>

<g transform="translate({$width / 2}, {$height / 2})">
  {#each $data as row}
    <!-- Draw a line connecting all the dots -->
    <path class="path-line" d={path($xGet(row))} stroke="#f0c" fill="#f0c" fill-opacity="0.5" />

    <!-- Plot each dots -->
    {#each $xGet(row) as circleR, i}
      <circle
        cx={cx(circleR, i)}
        cy={cy(circleR, i)}
        r="4.5"
        fill="#f0c"
        stroke="#fff"
        stroke-width="1"
      />
    {/each}
  {/each}
</g>

<style>
  .path-line {
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2;
  }
</style>
