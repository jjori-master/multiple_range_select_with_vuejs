var vue = new Vue({
  el: ".range-container",
  data: {
    ranges: [],
    rangeAreas: [],
    lastSelectRange: null,
    switch: true
  },
  methods: {
    selectedRange: function(range) {
      if (
        this.rangeAreas.length > 2 &&
        this.selectedRanges.length > 5 &&
        !range.selected
      ) {
        return alert("최대 3개의 영역만 선택 가능합니다.");
      }

      range.selected = !range.selected;
      range.active = !range.active;

      this.resetRangeAreas();
    },

    resetRangeAreas: function() {
      var rangesLength = this.selectedRanges.length;

      if (rangesLength < 2) {
        return [];
      }

      // 짝수라면
      if (rangesLength % 2 === 0) {
        var _self = this;
        this.rangeAreas = Array.apply(null, { length: rangesLength / 2 })
          .map(Function.call, Number)
          .map(function(index) {
            return [
              _self.selectedRanges[index * 2],
              _self.selectedRanges[index * 2 + 1]
            ];
          });
        return;
      }

      if (rangesLength === 3) {
        this.rangeAreas = [
          this.selectedRanges.slice(0, 2),
          this.selectedRanges.slice(1, 3)
        ];
        return;
      }

      // 무조건 다섯개일때 어떻게 해야 할까?
      var two = this.selectedRanges[1].value;
      var three = this.selectedRanges[2].value;
      var four = this.selectedRanges[3].value;

      var abc = Math.abs(two - three) - Math.abs(four - three);

      var a = abc < 0 || (abc === 0 && this.switch) ? 1 : 2;

      this.rangeAreas = [
        this.selectedRanges.slice(0, 2),
        this.selectedRanges.slice(a, a + 2),
        this.selectedRanges.slice(3, 5)
      ];

      this.switch = !this.switch;
    },

    isActive: function(range) {
      if (range.active) {
        return true;
      }

      return (
        this.activeAreas.filter(function(values) {
          return values.includes(range.value);
        }).length === 1
      );
    },

    isActiveLine: function(index) {
      if (this.activeAreas.length < 1) {
        return false;
      }

      return (
        this.activeAreas.filter(function(values) {
          return values.includes(index + 1) && values.includes(index + 2);
        }).length === 1
      );
    },

    getTopLabelClass: function(area) {
      return [
        "top-label-start" + (area[0] - 1),
        "top-label-width" + (area[area.length - 1] - area[0]) * 10
      ];
    }
  },
  created: function() {
    this.ranges = Array.apply(null, { length: 10 })
      .map(Function.call, Number)
      .map(function(value) {
        return {
          value: value + 1,
          selected: false,
          active: false
        };
      });

    this.ranges[0].active = true;
    this.ranges[0].selected = true;
  },
  computed: {
    selectedRanges: function() {
      return this.ranges.filter(function(range) {
        return range.selected;
      });
    },

    activeAreasForLabel: function() {
      return this.rangeAreas.map(function(area) {
        return [area[0].value, area[area.length - 1].value];
      });
    },

    activeAreas: function() {
      return this.rangeAreas.map(function(area) {
        var length = area[area.length - 1].value - area[0].value;
        length = length + 1;

        return Array.apply(null, { length: length })
          .map(Function.call, Number)
          .map(function(value) {
            return value + area[0].value;
          });
      });
    }
  }
});
