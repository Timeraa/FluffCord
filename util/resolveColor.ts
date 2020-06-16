export function resolveColor(color: string | number) {
	if (typeof color === "string") {
		if (color === "RANDOM") return Math.floor(Math.random() * (0xffffff + 1));
		if (color === "DEFAULT") return 0;
		color = parseInt(color.replace("#", ""), 16);
	}

	if (color < 0 || color > 0xffffff) throw new RangeError("COLOR_RANGE");
	else if (color && isNaN(color)) throw new TypeError("COLOR_CONVERT");

	return color;
}
