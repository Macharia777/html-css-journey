// Parse CSV data
function parseCSV(data) {
  const rows = data.trim().split('\n');
  const headers = rows[0].split(' ');
  const dataRows = rows.slice(1).map(row => row.split(' ').map(Number));

  return dataRows.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    obj.Year = parseInt(obj.Year);
    return obj;
  });
}

// Create vertical waterfall chart
function createVerticalWaterfallChart(data) {
  const width = 800;
  const height = 600;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  const y = d3.scaleBand()
    .domain(data.map(d => d.Year))
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d3.sum(d3.values(d).slice(1)))])
    .range([margin.left, width - margin.right]);

  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const group = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const rects = group.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('y', d => y(d.Year))
    .attr('x', d => x(0))
    .attr('height', y.bandwidth())
    .attr('width', d => x(d3.sum(d3.values(d).slice(1))))
    .attr('fill', (d, i) => i % 2 ? 'steelblue' : 'lightsteelblue');

  group.append('g')
    .call(d3.axisLeft(y))
    .selectAll('text')
    .attr('transform', 'translate(-10,0)rotate(-45)');

  group.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .attr('x', -10)
    .attr('y', 6)
    .style('text-anchor', 'end');
}

// Load data
const csvData = `
Year Farming Casual Business Employed Dependants
2019 6.8% 8.1% 9.2% 17.0% 3.0%
2021 6.7% 7.4% 12.2% 16.5% 3.3%
`.trim();

createVerticalWaterfallChart(parseCSV(csvData));