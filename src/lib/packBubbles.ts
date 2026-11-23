export type BubbleInput = {
	name: string;
	icon: string | null;
	weight: number;
};

export type PackedBubble = BubbleInput & {
	x: number;
	y: number;
	r: number;
};

type Circle = { x: number; y: number; r: number; name: string };

const LABEL_SIZE = 11;
const LABEL_GAP = 3;
const PAD = 4;

function labelWidth(name: string) {
	return name.length * LABEL_SIZE * 0.62;
}

function labelRect(c: Circle) {
	const w = labelWidth(c.name);
	return {
		x: c.x - w / 2,
		y: c.y + c.r + LABEL_GAP,
		w,
		h: LABEL_SIZE,
	};
}

function rectsOverlap(
	a: { x: number; y: number; w: number; h: number },
	b: { x: number; y: number; w: number; h: number },
	margin = 1,
) {
	return !(
		a.x + a.w + margin < b.x ||
		b.x + b.w + margin < a.x ||
		a.y + a.h + margin < b.y ||
		b.y + b.h + margin < a.y
	);
}

function rectHitsCircle(
	rect: { x: number; y: number; w: number; h: number },
	c: Circle,
	margin = 0,
) {
	const nearestX = Math.max(rect.x, Math.min(c.x, rect.x + rect.w));
	const nearestY = Math.max(rect.y, Math.min(c.y, rect.y + rect.h));
	const dx = c.x - nearestX;
	const dy = c.y - nearestY;
	const reach = c.r + margin;
	return dx * dx + dy * dy < reach * reach;
}

function tangentPositions(a: Circle, b: Circle, r: number, pad: number) {
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	const d = Math.hypot(dx, dy);
	const r1 = a.r + r + pad;
	const r2 = b.r + r + pad;
	if (d === 0 || d > r1 + r2 || d < Math.abs(r1 - r2)) return [];
	const along = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
	const heightSq = r1 * r1 - along * along;
	if (heightSq < -0.01) return [];
	const height = Math.sqrt(Math.max(0, heightSq));
	const mx = a.x + (along * dx) / d;
	const my = a.y + (along * dy) / d;
	const ox = (-dy * height) / d;
	const oy = (dx * height) / d;
	return [
		{ x: mx + ox, y: my + oy },
		{ x: mx - ox, y: my - oy },
	];
}

function collides(c: Circle, placed: Circle[], labels: boolean) {
	const mine = labelRect(c);
	for (const other of placed) {
		const dx = c.x - other.x;
		const dy = c.y - other.y;
		const min = c.r + other.r + PAD;
		if (dx * dx + dy * dy < min * min - 0.5) return true;
		if (!labels) continue;
		const theirs = labelRect(other);
		if (rectsOverlap(mine, theirs, 2)) return true;
		if (rectHitsCircle(mine, other, 1)) return true;
		if (rectHitsCircle(theirs, c, 1)) return true;
	}
	return false;
}

export function packBubbles(items: BubbleInput[]) {
	const maxWeight = Math.max(...items.map((item) => item.weight));
	const maxR = 62;
	const minR = 20;
	const nodes = [...items]
		.map((item) => ({
			...item,
			r: minR + (maxR - minR) * Math.sqrt(item.weight / maxWeight),
		}))
		.sort((a, b) => b.r - a.r);

	const placed: PackedBubble[] = [];

	// Prefer a wide cluster so it sits in the 2-column bento tile.
	const score = (x: number, y: number) => x * x * 0.28 + y * y * 1.85;

	const choose = (node: (typeof nodes)[number], labels: boolean) => {
		let best: { x: number; y: number; score: number } | null = null;
		const consider = (x: number, y: number) => {
			const candidate = { ...node, x, y };
			if (collides(candidate, placed, labels)) return;
			const next = score(x, y);
			if (!best || next < best.score) best = { x, y, score: next };
		};

		for (let i = 0; i < placed.length; i++) {
			for (let j = i + 1; j < placed.length; j++) {
				for (const point of tangentPositions(placed[i], placed[j], node.r, PAD)) {
					consider(point.x, point.y);
				}
			}
			for (let step = 0; step < 48; step++) {
				const angle = (step / 48) * Math.PI * 2;
				const dist = placed[i].r + node.r + PAD;
				consider(
					placed[i].x + Math.cos(angle) * dist,
					placed[i].y + Math.sin(angle) * dist,
				);
			}
		}
		return best;
	};

	placed.push({ ...nodes[0], x: 0, y: 0 });

	for (let index = 1; index < nodes.length; index++) {
		const node = nodes[index];
		if (placed.length === 1) {
			placed.push({
				...node,
				x: placed[0].r + node.r + PAD,
				y: node.r * 0.15,
			});
			continue;
		}
		const spot = choose(node, true) ?? choose(node, false);
		if (!spot) {
			placed.push({ ...node, x: placed[0].x, y: placed[0].y + placed[0].r + node.r + PAD });
			continue;
		}
		placed.push({ ...node, x: spot.x, y: spot.y });
	}

	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	for (const bubble of placed) {
		const box = labelRect(bubble);
		minX = Math.min(minX, bubble.x - bubble.r, box.x);
		minY = Math.min(minY, bubble.y - bubble.r);
		maxX = Math.max(maxX, bubble.x + bubble.r, box.x + box.w);
		maxY = Math.max(maxY, box.y + box.h);
	}

	const margin = 6;
	const width = maxX - minX + margin * 2;
	const height = maxY - minY + margin * 2;
	const bubbles = placed.map((bubble) => ({
		...bubble,
		x: bubble.x - minX + margin,
		y: bubble.y - minY + margin,
	}));

	return { bubbles, width, height };
}
