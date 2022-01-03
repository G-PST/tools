function flabeler() {
  let lab = []
  let anc = []
  let w = 1
  let h = 1

  let max_move = 5.0
  let max_angle = 0.5

  // weights
  let w_len = 0.2 // leader line length
  let w_inter = 1.0 // leader line intersection
  let w_lab2 = 30.0 // label-label overlap
  let w_lab_anc = 30.0 // label-anchor overlap
  let w_orient = 3.0 // orientation bias

  function energy(index, lab, anc) {
    let m = lab.length,
      ener = 0,
      dx = lab[index].x - anc[index].x,
      dy = anc[index].y - lab[index].y,
      dist = Math.sqrt(dx * dx + dy * dy),
      overlap = true

    // penalty for length of leader line
    if (dist > 0) ener += dist * w_len

    // label orientation bias
    dx /= dist
    dy /= dist
    if (dx > 0 && dy > 0) {
      ener += 0 * w_orient
    } else if (dx < 0 && dy > 0) {
      ener += 1 * w_orient
    } else if (dx < 0 && dy < 0) {
      ener += 2 * w_orient
    } else {
      ener += 3 * w_orient
    }

    let x21 = lab[index].x,
      y21 = lab[index].y - lab[index].height + 2.0,
      x22 = lab[index].x + lab[index].width,
      y22 = lab[index].y + 2.0
    let x11, x12, y11, y12, x_overlap, y_overlap, overlap_area

    for (let i = 0; i < m; i++) {
      if (i != index) {
        // penalty for intersection of leader lines
        overlap = intersect(
          anc[index].x,
          lab[index].x,
          anc[i].x,
          lab[i].x,
          anc[index].y,
          lab[index].y,
          anc[i].y,
          lab[i].y,
        )
        if (overlap) ener += w_inter

        // penalty for label-label overlap
        x11 = lab[i].x
        y11 = lab[i].y - lab[i].height + 2.0
        x12 = lab[i].x + lab[i].width
        y12 = lab[i].y + 2.0
        x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21))
        y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21))
        overlap_area = x_overlap * y_overlap
        ener += overlap_area * w_lab2
      }

      // penalty for label-anchor overlap
      x11 = anc[i].x - anc[i].r
      y11 = anc[i].y - anc[i].r
      x12 = anc[i].x + anc[i].r
      y12 = anc[i].y + anc[i].r
      x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21))
      y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21))
      overlap_area = x_overlap * y_overlap
      ener += overlap_area * w_lab_anc
    }
    return ener
  }

  function mcmove(currT) {
    // Monte Carlo translation move

    // select a random label
    let i = Math.floor(Math.random() * lab.length)

    // save old coordinates
    let x_old = lab[i].x
    let y_old = lab[i].y

    // old energy
    let old_energy = energy(i, lab, anc)

    // random translation
    lab[i].x += (Math.random() - 0.5) * max_move
    lab[i].y += (Math.random() - 0.5) * max_move

    // hard wall boundaries
    if (lab[i].x > w) lab[i].x = x_old
    if (lab[i].x < 0) lab[i].x = x_old
    if (lab[i].y > h) lab[i].y = y_old
    if (lab[i].y < 0) lab[i].y = y_old

    // new energy
    let new_energy = energy(i, lab, anc)

    // delta E
    let delta_energy = new_energy - old_energy

    if (!(Math.random() < Math.exp(-delta_energy / currT))) {
      // move back to old coordinates
      lab[i].x = x_old
      lab[i].y = y_old
    }
  }

  function mcrotate(currT) {
    // Monte Carlo rotation move

    // select a random label
    let i = Math.floor(Math.random() * lab.length)

    // save old coordinates
    let x_old = lab[i].x
    let y_old = lab[i].y

    // old energy
    let old_energy = energy(i, lab, anc)

    // random angle
    let angle = (Math.random() - 0.5) * max_angle

    let s = Math.sin(angle)
    let c = Math.cos(angle)

    // translate label (relative to anchor at origin):
    lab[i].x -= anc[i].x
    lab[i].y -= anc[i].y

    // rotate label
    let x_new = lab[i].x * c - lab[i].y * s,
      y_new = lab[i].x * s + lab[i].y * c

    // translate label back
    lab[i].x = x_new + anc[i].x
    lab[i].y = y_new + anc[i].y

    // hard wall boundaries
    if (lab[i].x > w) lab[i].x = x_old
    if (lab[i].x < 0) lab[i].x = x_old
    if (lab[i].y > h) lab[i].y = y_old
    if (lab[i].y < 0) lab[i].y = y_old

    // new energy
    let new_energy = energy(i, lab, anc)

    // delta E
    let delta_energy = new_energy - old_energy

    if (!(Math.random() < Math.exp(-delta_energy / currT))) {
      // move back to old coordinates
      lab[i].x = x_old
      lab[i].y = y_old
    }
  }

  function intersect(x1, x2, x3, x4, y1, y2, y3, y4) {
    // returns true if two lines intersect, else false
    // from http://paulbourke.net/geometry/lineline2d/

    let mua, mub
    let denom, numera, numerb

    denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
    numera = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)
    numerb = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)

    /* Is the intersection along the the segments */
    mua = numera / denom
    mub = numerb / denom
    if (!(mua < 0 || mua > 1 || mub < 0 || mub > 1)) {
      return true
    }
    return false
  }

  function cooling_schedule(currT, initialT, nsweeps) {
    // linear cooling
    return currT - initialT / nsweeps
  }

  return {
    start(nsweeps) {
      // main simulated annealing function
      let m = lab.length,
        currT = 1.0,
        initialT = 1.0

      for (let i = 0; i < nsweeps; i++) {
        for (let j = 0; j < m; j++) {
          if (Math.random() < 0.5) {
            mcmove(currT)
          } else {
            mcrotate(currT)
          }
        }
        currT = cooling_schedule(currT, initialT, nsweeps)
      }

      return this
    },

    width(x) {
      // users insert graph width
      if (!arguments.length) return w
      w = x
      return this
    },

    height(x) {
      // users insert graph height
      if (!arguments.length) return h
      h = x
      return this
    },

    label(x) {
      // users insert label positions
      if (!arguments.length) return lab
      lab = x
      return this
    },

    anchor(x) {
      // users insert anchor positions
      if (!arguments.length) return anc
      anc = x
      return this
    },
  }
}

export default flabeler
