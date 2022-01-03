<script>
  /**
    Generates an SVG radar chart.
  */
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { getContext, onMount } from 'svelte'
  import { get } from 'svelte/store'
  import { Svg } from 'layercake'

  import * as d3 from 'd3'

  const { data, width, height } = getContext('LayerCake')

  const partition = (data, w, h) => {
    const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
    const r = d3.partition().size([2 * Math.PI, root.height + 1])(root)
    r.each((d) => (d.current = d))
    return r
  }

  function interpolate(current, target) {
    const results = []
    for (const [index, c] of current.entries()) {
      const t = target[index]
      const f = d3.interpolate(c.current, t.target)
      results.push({ c, f })
    }
    return (t) => {
      return results.map(({ c, f }) => {
        c.current = f(t)
        return c
      })
    }
  }

  $: radius = Math.min($width / 2.5, $height / 2.5) / 2
  $: root = partition($data, $width, $height)
  $: descendants = tweened(root.descendants().slice(1), {
    duration: 500,
    easing: cubicOut,
    interpolate: interpolate,
  })

  $: arc = function (data, r) {
    const f = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(r * 1.5)
      .innerRadius((d) => d.y0 * r)
      .outerRadius((d) => Math.max(d.y0 * r, d.y1 * r - 1))
    return f(data)
  }

  $: color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, $data.children.length + 1))
  const fillColor = function (d) {
    while (d.depth > 1) d = d.parent
    return color(d.data.name)
  }

  const pathMouseOver = function () {
    d3.select(this).attr('stroke-width', 2).attr('stroke', 'black')
  }

  const pathMouseMove = function () {
    d3.select(this).attr('stroke-width', 2).attr('stroke', 'black')
  }

  const pathMouseOut = function () {
    d3.select(this).attr('stroke-width', null).attr('stroke', null)
  }

  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 0 && d.x1 > d.x0
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 0 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03
  }

  function labelTransform(d, n) {
    const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI
    const y = ((d.y0 + d.y1) / 2) * radius
    const dx = x < 90 || x > 270 ? 1.5 * n : -1.5 * n
    return `rotate(${x - 90 - dx}) translate(${y},0) rotate(${x < 90 || x > 270 ? dx : 180 + dx})`
  }

  function clicked(event, p) {
    descendants.update((data) => {
      return data.map((d) => {
        d.target = {
          x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth),
        }
        return d
      })
    })
  }

  function textSplit(str, cols) {
    var formatedString = '',
      wordsArray = []

    wordsArray = str.split(' ')

    formatedString = wordsArray[0]

    for (var i = 1; i < wordsArray.length; i++) {
      if (wordsArray[i].length > cols) {
        formatedString += '\n' + wordsArray[i]
      } else {
        if (formatedString.length + wordsArray[i].length > cols) {
          formatedString += '\n' + wordsArray[i]
        } else {
          formatedString += ' ' + wordsArray[i]
        }
      }
    }

    return formatedString.split('\n')
  }
</script>

<Svg>
  <g class="main" transform="translate({$width / 2}, {($height / 2) * 1.25}) rotate(90)">
    <g class="paths">
      {#each $descendants as d (d.parent.data.name + '-' + d.data.name)}
        {#if d.x1 - d.x0 > 0.01}
          <path
            d={arc(d.current, radius)}
            fill={fillColor(d)}
            fill-opacity={arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0}
            style="cursor: pointer"
            on:mouseover={pathMouseOver}
            on:mouseout={pathMouseOut}
            on:mousemove={pathMouseMove}
            on:focus={() => {}}
            on:blur={() => {}}
            on:click={(e) => clicked(e, d)}
          />
        {/if}
      {/each}
    </g>
    <g
      class="texts"
      pointer-events="none"
      text-anchor="middle"
      user-select="none"
      font-size={radius / 10}
      font-family="sans-serif"
    >
      {#each $descendants as d (d.parent.data.name + '-' + d.data.name)}
        {#if d.x1 - d.x0 > 0.01}
          <text
            transform={labelTransform(d.current, textSplit(d.data.name, 10).length)}
            fill-opacity={labelVisible(d.current) ? (d.children ? 1 : 1) : 0}
          >
            {#each textSplit(d.data.name, 10) as t}
              <tspan x="0" dy="1.2em">
                {t}
              </tspan>
            {/each}
          </text>
        {/if}
      {/each}
    </g>
    <circle
      class="root"
      r={radius}
      fill="none"
      pointer-events="all"
      cursor="pointer"
      on:mouseover={function (d, i) {
        d3.select(this).attr('stroke-width', 2).attr('stroke', 'black')
      }}
      on:mousemove={function (d, i) {
        d3.select(this).attr('stroke-width', 2).attr('stroke', 'black')
      }}
      on:mouseout={function (d, i) {
        d3.select(this).attr('stroke-width', null).attr('stroke', 'null')
      }}
      on:focus={() => {}}
      on:blur={() => {}}
      on:click={(e) => clicked(e, root)}
    />
  </g>
</Svg>
