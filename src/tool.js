/*! Eretek Online Araçlar #84 — Kablolama Metrajı ve Patch Panel */
ERT.def('84', {
	run: function (v, c) {
		var groups = v.list ? c.lines(v.list, 200, 'list').map(function (l, i) {
			var p = l.split(/[;\t]/).map(function (x) { return x.trim(); }), n = ERT.parseNum(p[1], 'en'), len = ERT.parseNum(p[2], 'en');
			if (!(n > 0) || Math.floor(n) !== n || !(len > 0)) { throw c.fe('list', 'rowFmt', { r: i + 1 }); }
			return { label: p[0], n: n, len: len };
		}) : null;
		if (!groups) { if (!(v.outlets > 0) || !(v.avg > 0)) { throw c.fe('outlets', 'need'); } groups = [{ label: c.t('all'), n: v.outlets, len: v.avg }]; }
		var ppo = v.ppo || 1, slack = v.slack === null || v.slack === undefined ? 3 : v.slack, box = v.box || 305, waste = (v.waste || 0) / 100;
		var runs = 0, meters = 0, boxes = 0, long = [], rows = [];
		groups.forEach(function (g) {
			var r = g.n * ppo, rl = g.len + slack, per = Math.floor(box / (rl * (1 + waste)));
			if (per < 1) { throw c.fe(v.list ? 'list' : 'avg', 'tooLong', { m: c.n(rl, 1), b: box }); }
			var b = Math.ceil(r / per); runs += r; meters += r * rl * (1 + waste); boxes += b;
			if (g.len > 90) { long.push(g.label); }
			rows.push([g.label, g.n, r, c.n(rl, 1), per, b]);
		});
		var panels = Math.ceil(runs / (v.panel || 24)), cords = runs * 2, msgs = [];
		if (long.length) { msgs.push(['err', c.t('over90', { l: long.join(', ') })]); } else { msgs.push(['ok', c.t('ok90')]); }
		msgs.push(['info', c.t('boxNote')], ['info', c.t('spare')]);
		var kv = [[c.t('runs'), runs], [c.t('meters'), c.n(meters, 0) + ' m'], [c.t('boxes', { b: box }), boxes], [c.t('panels', { p: v.panel || 24 }), panels], [c.t('cords'), cords], [c.t('jacks'), runs * 2]];
		var cols = [c.t('c_g'), c.t('c_o'), c.t('c_r'), c.t('c_l'), c.t('c_pb'), c.t('c_b')];
		return { big: c.t('big', { r: runs, b: boxes, p: panels }), kv: kv, msgs: msgs, tables: [{ cols: cols, rows: rows }], x: { csv: { name: 'cabling', cols: cols, rows: rows.concat([['', '', runs, '', '', boxes]]) } }, v: { runs: runs, boxes: boxes, panels: panels, meters: Math.round(meters), cords: cords } };
	}
});
