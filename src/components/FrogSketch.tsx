import { useEffect, useRef } from "react";

export default function FrogSketch() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cleanupRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Load p5 as a UMD global to avoid Bun/ESM bundler issues
        function loadP5AndInit() {
            if ((window as any).p5) {
                initSketch((window as any).p5);
                return;
            }
            const script = document.createElement("script");
            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js";
            script.onload = () => initSketch((window as any).p5);
            document.head.appendChild(script);
        }

        function initSketch(p5Constructor: any) {
            if (!container) return;

            const sketch = (p: any) => {
                // ── Math helpers (replaces PVector) ──────────────────────────────────
                const TAU = Math.PI * 2;
                const HALF_PI = Math.PI / 2;

                type V = { x: number; y: number };

                const v = (x: number, y: number): V => ({ x, y });
                const vadd = (a: V, b: V): V => ({ x: a.x + b.x, y: a.y + b.y });
                const vsub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y });
                const vmag = (a: V) => Math.sqrt(a.x * a.x + a.y * a.y);
                const vcopy = (a: V): V => ({ x: a.x, y: a.y });
                const vset = (a: V, m: number): V => {
                    const l = vmag(a);
                    return l === 0 ? v(0, 0) : v((a.x / l) * m, (a.y / l) * m);
                };
                const vlerp = (a: V, b: V, t: number): V =>
                    v(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
                const vrot = (a: V, ang: number): V => {
                    const c = Math.cos(ang), s = Math.sin(ang);
                    return v(a.x * c - a.y * s, a.x * s + a.y * c);
                };
                const vhead = (a: V) => Math.atan2(a.y, a.x);
                const vdist = (a: V, b: V) => vmag(vsub(a, b));
                const vang = (a: number): V => v(Math.cos(a), Math.sin(a));

                // ── Angle helpers ────────────────────────────────────────────────────
                const simplify = (a: number) => {
                    while (a >= TAU) a -= TAU;
                    while (a < 0) a += TAU;
                    return a;
                };
                const relDiff = (a: number, anchor: number) => {
                    a = simplify(a + Math.PI - anchor);
                    return Math.PI - a;
                };
                const clampAngle = (a: number, anchor: number, constraint: number) => {
                    if (Math.abs(relDiff(a, anchor)) <= constraint) return simplify(a);
                    return relDiff(a, anchor) > constraint
                        ? simplify(anchor - constraint)
                        : simplify(anchor + constraint);
                };

                // ── BlobPoint ────────────────────────────────────────────────────────
                class BlobPoint {
                    pos: V; ppos: V; disp: V; dw: number;
                    constructor(pos: V) {
                        this.pos = vcopy(pos); this.ppos = vcopy(pos);
                        this.disp = v(0, 0); this.dw = 0;
                    }
                    integrate() {
                        const tmp = vcopy(this.pos);
                        const vel = vsub(this.pos, this.ppos);
                        vel.x *= 0.99; vel.y *= 0.99;
                        this.pos = vadd(this.pos, vel); this.ppos = tmp;
                    }
                    gravity() { this.pos.y += 1; }
                    accumulate(offset: V) {
                        this.disp.x += offset.x; this.disp.y += offset.y; this.dw++;
                    }
                    apply() {
                        if (this.dw > 0) {
                            this.disp.x /= this.dw; this.disp.y /= this.dw;
                            this.pos = vadd(this.pos, this.disp);
                            this.disp = v(0, 0); this.dw = 0;
                        }
                    }
                    bounds() {
                        this.pos.x = p.constrain(this.pos.x, 0, p.width);
                        this.pos.y = p.constrain(this.pos.y, 0, p.height);
                    }
                    mouse() {
                        const m = v(p.mouseX, p.mouseY);
                        if (p.mouseIsPressed && vdist(this.pos, m) < 100) {
                            this.pos = vadd(m, vset(vsub(this.pos, m), 100));
                        }
                    }
                }

                // ── Blob ─────────────────────────────────────────────────────────────
                class Blob {
                    pts: BlobPoint[]; area: number; circ: number; chord: number;
                    constructor(origin: V, n: number, r: number, puff: number) {
                        this.area = r * r * Math.PI * puff;
                        this.circ = r * TAU;
                        this.chord = this.circ / n;
                        this.pts = Array.from({ length: n }, (_, i) => {
                            const a = (TAU * i) / n - HALF_PI;
                            return new BlobPoint(vadd(origin, v(Math.cos(a) * r, Math.sin(a) * r)));
                        });
                    }
                    getArea() {
                        let area = 0;
                        for (let i = 0; i < this.pts.length; i++) {
                            const c = this.pts[i].pos;
                            const nx = this.pts[(i + 1) % this.pts.length].pos;
                            area += ((c.x - nx.x) * (c.y + nx.y)) / 2;
                        }
                        return area;
                    }
                    update() {
                        for (const pt of this.pts) { pt.integrate(); pt.gravity(); }
                        for (let j = 0; j < 10; j++) {
                            // Distance constraints
                            for (let i = 0; i < this.pts.length; i++) {
                                const c = this.pts[i];
                                const nx = this.pts[(i + 1) % this.pts.length];
                                const d = vsub(nx.pos, c.pos);
                                if (vmag(d) > this.chord) {
                                    const e = (vmag(d) - this.chord) / 2;
                                    const off = vset(d, e);
                                    c.accumulate(off);
                                    nx.accumulate(v(-off.x, -off.y));
                                }
                            }
                            // Dilation
                            const err = this.area - this.getArea();
                            const om = err / this.circ;
                            for (let i = 0; i < this.pts.length; i++) {
                                const prev = this.pts[(i - 1 + this.pts.length) % this.pts.length];
                                const c = this.pts[i];
                                const nx = this.pts[(i + 1) % this.pts.length];
                                const sec = vsub(nx.pos, prev.pos);
                                c.accumulate(vset(vrot(sec, -HALF_PI), om));
                            }
                            for (const pt of this.pts) pt.apply();
                            for (const pt of this.pts) { pt.bounds(); pt.mouse(); }
                        }
                    }
                }

                // ── LimbPoint ────────────────────────────────────────────────────────
                class LimbPoint {
                    pos: V; ppos: V; angle: number;
                    constructor(pos: V) {
                        this.pos = vcopy(pos); this.ppos = vcopy(pos); this.angle = 0;
                    }
                    integrate() {
                        const tmp = vcopy(this.pos);
                        const vel = vsub(this.pos, this.ppos);
                        vel.x *= 0.95; vel.y *= 0.95;
                        this.pos = vadd(this.pos, vel); this.ppos = tmp;
                    }
                    gravity() { this.pos.y += 1; }
                    constrain(anchor: V, normal: number, dist: number, range: number, offset: number) {
                        const target = normal + offset;
                        const cur = vhead(vsub(anchor, this.pos));
                        this.angle = clampAngle(cur, target, range);
                        this.pos = vsub(anchor, vset(vang(this.angle), dist));
                    }
                    bounds() {
                        this.pos.x = p.constrain(this.pos.x, 0, p.width);
                        this.pos.y = p.constrain(this.pos.y, 0, p.height);
                    }
                }

                // ── Limb ─────────────────────────────────────────────────────────────
                class Limb {
                    elbow: LimbPoint; foot: LimbPoint;
                    dist: number; er: number; eo: number; fr: number; fo: number;
                    constructor(origin: V, dist: number, er: number, eo: number, fr: number, fo: number) {
                        this.dist = dist; this.er = er; this.eo = eo; this.fr = fr; this.fo = fo;
                        this.elbow = new LimbPoint(vadd(origin, v(0, dist)));
                        this.foot = new LimbPoint(vadd(this.elbow.pos, v(0, dist)));
                    }
                    resolve(anchor: V, normal: number) {
                        this.elbow.integrate(); this.elbow.gravity();
                        this.elbow.constrain(anchor, normal, this.dist, this.er, this.eo);
                        this.elbow.bounds();
                        this.foot.integrate(); this.foot.gravity();
                        this.foot.constrain(this.elbow.pos, this.elbow.angle, this.dist, this.fr, this.fo);
                        this.foot.bounds();
                    }
                }

                // ── Frog ─────────────────────────────────────────────────────────────
                class Frog {
                    blob: Blob; lfl: Limb; rfl: Limb; lhl: Limb; rhl: Limb;
                    constructor(origin: V) {
                        this.blob = new Blob(origin, 16, 128, 1.5);
                        this.lfl = new Limb(vsub(origin, v(80, 0)), 56, Math.PI / 4, Math.PI / 8, Math.PI / 5, -Math.PI / 4);
                        this.rfl = new Limb(vadd(origin, v(80, 0)), 56, Math.PI / 4, -Math.PI / 8, Math.PI / 5, Math.PI / 4);
                        this.lhl = new Limb(vsub(origin, v(100, 0)), 100, 1.9 * Math.PI / 5, 2 * Math.PI / 5, 2 * Math.PI / 5, -2 * Math.PI / 5);
                        this.rhl = new Limb(vadd(origin, v(100, 0)), 100, 1.9 * Math.PI / 5, -2 * Math.PI / 5, 2 * Math.PI / 5, 2 * Math.PI / 5);
                    }
                    update() {
                        this.blob.update();
                        const pts = this.blob.pts;
                        const lf = pts[12].pos, rf = pts[4].pos;
                        const lfa = vadd(vlerp(lf, rf, 0.25), v(0, 10));
                        const rfa = vadd(vlerp(lf, rf, 0.75), v(0, 10));
                        const ms = vset(vsub(rf, lf), 64);
                        const mn = vhead(vrot(ms, -HALF_PI));
                        const lha = vadd(vadd(pts[11].pos, ms), v(0, 16));
                        const rha = vadd(vsub(pts[5].pos, ms), v(0, 16));
                        this.lfl.resolve(lfa, mn); this.rfl.resolve(rfa, mn);
                        if (p.height - this.lhl.foot.pos.y < 100) { this.lhl.elbow.pos.y -= 1.5; this.lhl.foot.pos.x += 0.5; }
                        if (p.height - this.rhl.foot.pos.y < 100) { this.rhl.elbow.pos.y -= 1.5; this.rhl.foot.pos.x -= 0.5; }
                        this.lhl.resolve(lha, mn); this.rhl.resolve(rha, mn);
                    }

                    display() { this.hindLegs(); this.body(); this.head(); this.frontLegs(); }

                    body() {
                        const pts = this.blob.pts;
                        p.strokeWeight(8); p.stroke(0); p.fill(85, 145, 127);
                        p.beginShape();
                        p.curveVertex(pts[pts.length - 2].pos.x, pts[pts.length - 2].pos.y);
                        p.curveVertex(pts[pts.length - 1].pos.x, pts[pts.length - 1].pos.y);
                        for (const pt of pts) p.curveVertex(pt.pos.x, pt.pos.y);
                        p.curveVertex(pts[0].pos.x, pts[0].pos.y);
                        p.curveVertex(pts[1].pos.x, pts[1].pos.y);
                        p.endShape();
                    }

                    head() {
                        const pts = this.blob.pts;
                        const top = pts[0].pos;
                        const tn = vhead(vsub(pts[2].pos, pts[pts.length - 2].pos));
                        p.push(); p.translate(top.x, top.y); p.rotate(tn);
                        p.strokeWeight(8); p.stroke(0); p.fill(85, 145, 127);
                        p.arc(0, 75, 250, 225, -Math.PI, 0);
                        p.noStroke(); p.ellipse(0, 75, 244, 219);
                        p.stroke(0); p.noFill();
                        p.arc(-75, -10, 75, 75, -Math.PI - Math.PI / 4.6, -Math.PI / 5.6);
                        p.arc(75, -10, 75, 75, -Math.PI + Math.PI / 5.6, Math.PI / 4.6);
                        p.noStroke(); p.fill(85, 145, 127);
                        p.ellipse(-75, -10, 70, 70); p.ellipse(75, -10, 70, 70);
                        p.strokeWeight(4); p.stroke(0); p.fill(240, 153, 91);
                        p.ellipse(-75, -10, 48, 48); p.ellipse(75, -10, 48, 48);
                        p.noStroke(); p.fill(0);
                        p.push(); p.translate(-75, -10); p.rotate(-Math.PI / 24); p.ellipse(0, 0, 32, 18); p.pop();
                        p.push(); p.translate(75, -10); p.rotate(Math.PI / 24); p.ellipse(0, 0, 32, 18); p.pop();
                        p.strokeWeight(7); p.stroke(0); p.noFill();
                        p.arc(0, 80, 92, 48, Math.PI / 8, Math.PI - Math.PI / 8);
                        p.strokeWeight(5);
                        p.beginShape();
                        p.vertex(-90, 40); p.bezierVertex(-45, 60, -35, 15, -10, 25);
                        p.bezierVertex(-5, 27, 5, 27, 10, 25); p.bezierVertex(35, 15, 45, 60, 90, 40);
                        p.endShape();
                        p.push(); p.translate(-9, 5); p.rotate(Math.PI / 6); p.ellipse(0, 0, 2, 5); p.pop();
                        p.push(); p.translate(9, 5); p.rotate(-Math.PI / 6); p.ellipse(0, 0, 2, 5); p.pop();
                        p.pop();
                    }

                    frontLegs() {
                        const pts = this.blob.pts;
                        const l = pts[12].pos, r = pts[4].pos;
                        this.drawFront(vadd(vlerp(l, r, 0.25), v(0, 10)), this.lfl);
                        this.drawFront(vadd(vlerp(l, r, 0.75), v(0, 10)), this.rfl);
                    }

                    hindLegs() {
                        const pts = this.blob.pts;
                        const l = pts[12].pos, r = pts[4].pos;
                        const ms = vset(vsub(r, l), 64);
                        this.drawHind(vadd(vadd(pts[11].pos, ms), v(0, 16)), this.lhl, false);
                        this.drawHind(vadd(vsub(pts[5].pos, ms), v(0, 16)), this.rhl, true);
                    }

                    drawFront(anchor: V, limb: Limb) {
                        p.noFill(); p.strokeWeight(48); p.stroke(0);
                        p.beginShape();
                        p.curveVertex(anchor.x, anchor.y); p.curveVertex(anchor.x, anchor.y);
                        p.curveVertex(limb.elbow.pos.x, limb.elbow.pos.y);
                        p.curveVertex(limb.foot.pos.x, limb.foot.pos.y);
                        p.curveVertex(limb.foot.pos.x, limb.foot.pos.y);
                        p.endShape();
                        p.strokeWeight(34); p.stroke(85, 145, 127);
                        p.beginShape();
                        p.curveVertex(anchor.x, anchor.y); p.curveVertex(anchor.x, anchor.y);
                        p.curveVertex(limb.elbow.pos.x, limb.elbow.pos.y);
                        p.curveVertex(limb.foot.pos.x, limb.foot.pos.y);
                        p.curveVertex(limb.foot.pos.x, limb.foot.pos.y);
                        p.endShape();
                        const fn_ = vhead(vsub(limb.elbow.pos, limb.foot.pos)) + HALF_PI;
                        p.strokeWeight(6); p.stroke(0); p.fill(85, 145, 127);
                        p.push(); p.translate(limb.foot.pos.x, limb.foot.pos.y); p.rotate(fn_ - Math.PI / 4);
                        p.ellipse(0, 16, 16, 55); p.rotate(Math.PI / 6); p.ellipse(0, 28, 16, 55);
                        p.rotate(Math.PI / 6); p.ellipse(0, 28, 16, 55); p.rotate(Math.PI / 6); p.ellipse(0, 16, 16, 55);
                        p.noStroke(); p.rotate(-Math.PI / 6); p.ellipse(0, 28, 10, 49);
                        p.rotate(-Math.PI / 6); p.ellipse(0, 28, 10, 49); p.rotate(-Math.PI / 6); p.ellipse(0, 16, 10, 49);
                        p.pop();
                        const sn = vhead(vsub(anchor, limb.elbow.pos));
                        p.noStroke(); p.fill(85, 145, 127);
                        p.arc(anchor.x, anchor.y, 49, 49, -HALF_PI + sn, HALF_PI + sn);
                        p.ellipse(limb.foot.pos.x, limb.foot.pos.y, 35, 35);
                    }

                    drawHind(anchor: V, limb: Limb, right: boolean) {
                        const off = right ? -Math.PI / 8 : Math.PI / 8;
                        const fn_ = vhead(vsub(limb.elbow.pos, limb.foot.pos)) + HALF_PI + off;
                        const fs = vadd(limb.foot.pos, vset(vang(fn_ + HALF_PI), 24));
                        p.noFill(); p.strokeWeight(48); p.stroke(0);
                        p.beginShape();
                        p.curveVertex(anchor.x, anchor.y); p.curveVertex(anchor.x, anchor.y);
                        p.curveVertex(limb.elbow.pos.x, limb.elbow.pos.y);
                        p.curveVertex(limb.foot.pos.x, limb.foot.pos.y);
                        p.curveVertex(fs.x, fs.y); p.curveVertex(fs.x, fs.y);
                        p.endShape();
                        p.strokeWeight(34); p.stroke(85, 145, 127);
                        p.beginShape();
                        p.curveVertex(anchor.x, anchor.y); p.curveVertex(anchor.x, anchor.y);
                        p.curveVertex(limb.elbow.pos.x, limb.elbow.pos.y);
                        p.curveVertex(limb.foot.pos.x, limb.foot.pos.y);
                        p.curveVertex(fs.x, fs.y); p.curveVertex(fs.x, fs.y);
                        p.endShape();
                        p.strokeWeight(6); p.stroke(0); p.fill(85, 145, 127);
                        p.push(); p.translate(fs.x, fs.y); p.rotate(fn_ - Math.PI / 4 + off);
                        p.ellipse(0, 16, 16, 55); p.rotate(Math.PI / 6); p.ellipse(0, 28, 16, 55);
                        p.rotate(Math.PI / 6); p.ellipse(0, 28, 16, 55); p.rotate(Math.PI / 6); p.ellipse(0, 16, 16, 55);
                        p.noStroke(); p.rotate(-Math.PI / 6); p.ellipse(0, 28, 10, 49);
                        p.rotate(-Math.PI / 6); p.ellipse(0, 28, 10, 49); p.rotate(-Math.PI / 6); p.ellipse(0, 16, 10, 49);
                        p.pop();
                        const sn = vhead(vsub(anchor, limb.elbow.pos));
                        p.noStroke(); p.fill(85, 145, 127);
                        p.arc(anchor.x, anchor.y, 49, 49, -HALF_PI + sn, HALF_PI + sn);
                        p.ellipse(fs.x, fs.y, 35, 35);
                    }
                }

                // ── Sketch lifecycle ─────────────────────────────────────────────────
                let frog: Frog;

                p.setup = () => {
                    const w = container.clientWidth || 600;
                    const h = Math.min(w * 0.83, 500);
                    const canvas = p.createCanvas(w, h);
                    canvas.parent(container);
                    p.frameRate(60);
                    frog = new Frog(v(p.width / 2, p.height - 300));
                };

                p.draw = () => {
                    p.background(247, 246, 243);
                    frog.update();
                    frog.display();
                };

                p.windowResized = () => {
                    const w = container.clientWidth || 600;
                    p.resizeCanvas(w, Math.min(w * 0.83, 500));
                };
            };

            const instance = new p5Constructor(sketch);
            cleanupRef.current = () => instance.remove();
        }

        loadP5AndInit();

        return () => {
            cleanupRef.current?.();
            cleanupRef.current = null;
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", aspectRatio: "6/5", maxHeight: 500 }}
            aria-label="Interactive frog animation — click or drag to play"
        />
    );
}