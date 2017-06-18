export default function() {
    const _ = {dataDots: null};

    function svgAddDots() {
        const __ = this._;
        if (_.dataDots && __.options.showDots && !__.drag) {
            __.svg.selectAll('.dot').remove();
            if (_.dataDots && __.options.showDots) {
                const circles = [];
                _.circles.forEach(function(d) {
                    circles.push(d.circle);
                });
                __.dots = __.svg.append('g').attr('class','dot').selectAll('path')
                .data(circles).enter().append('path');
                if (_.dataDots.geometry) {
                    const _g = _.dataDots.geometry;
                    _g.lineWidth   && __.dots.style('stroke-width', _g.lineWidth);
                    _g.fillStyle   && __.dots.style('fill',         _g.fillStyle);
                    _g.strokeStyle && __.dots.style('stroke',       _g.strokeStyle);
                }
                refresh.call(this);
                return __.dots;
            }
        }
    }

    function refresh() {
        const __ = this._;
        if (__.dots && __.options.showDots) {
            __.dots.attr('d', __.path).style('display', function(d) {
                return d3.geoDistance(d.coordinates, __.proj.invert(__.center)) > 1.57 ? 'none' : 'inline';
            });
        }
    }

    function initData() {
        const geoCircle = d3.geoCircle();
        const _g = _.dataDots.geometry || {};
        const _r = _g.radius || 0.5;
        _.circles = _.dataDots.features.map(function(d) {
            const coordinates = d.geometry.coordinates;
            const r = d.geometry.radius || _r;
            const circle = geoCircle.center(coordinates).radius(r)();
            return {coordinates, circle};
        });
    }

    return {
        name: 'dotsPlugin',
        onInit() {
            this.$.svgAddDots = svgAddDots;
            this._.options.showDots = true;
        },
        onRefresh() {
            refresh.call(this);
        },
        data(data) {
            _.dataDots = data;
            initData();
        },
    }
}
