import React, { Component } from 'react'
import styled from 'styled-components'
import {
  select
} from 'd3-selection'

import {
  scaleOrdinal,
  scaleBand,
  scaleLinear
} from 'd3-scale'

import {
  schemePaired
} from 'd3-scale-chromatic'

import {
  max
} from 'd3-array'

import {
  axisBottom,
  axisLeft
} from 'd3-axis'

import {
  transition
} from 'd3-transition'

import Tooltip from './Tooltip'

const ChartContainer = styled.div`
  position: relative;
  .bar:hover {
    opacity: 0.2;
  }
`

export default class BarChart extends Component {
  constructor () {
    super()
    this.state = {
      tooltip: {
        text: '',
        visible: false,
        x: 0,
        y: 0
      }
    }
    this.width = 500
    this.height = 300
    this.colorScale = scaleOrdinal(schemePaired).range()
  }

  componentDidMount () {
    this.renderChart()
  }

  componentDidUpdate () {
    this.renderChart()
  }

  renderChart = () => {
    const chart = select(this.svgRef)
    const container = this.containerRef
    const data = this.props.data

    const margin = {
      top: 20,
      right: 20,
      bottom: 80,
      left: 40
    }

    const xScale = scaleBand().rangeRound([0, this.width]).padding(0.1)
    const yScale = scaleLinear().rangeRound([this.height, 0])

    xScale.domain(data.map(d => d.name))
    yScale.domain([0, max(data, d => d.value)])

    const t = transition().duration(750)

    chart
      .attr('width', this.width + margin.left)
      .attr('height', this.height + margin.bottom + margin.top)

    const updateBars = () => {
      let bars = chart
        .selectAll('rect')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .data(data)

      bars
        .exit()
        .remove()

      const enter = bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('width', xScale.bandwidth())
        .attr('y', this.height)
        .attr('height', 0)
        .attr('fill', (_, index) => this.colorScale[index])
        .on('mouseover', (d, index, nodes) => {
          const bar = select(nodes[index])
          const bounds = bar.node().getBoundingClientRect()
          const containerBounds = container.getBoundingClientRect()
          this.setState({
            tooltip: {
              ...this.state.tooltip,
              text: d.value.toString(),
              visible: true,
              x: bounds.x - containerBounds.x + bounds.width / 2 + 10,
              y: bounds.y - containerBounds.y + bounds.height / 2
            }
          })
        })
        .on('mouseout', () => {
          this.setState({
            tooltip: {
              ...this.state.tooltip,
              text: '',
              visible: false,
              x: 0,
              y: 0
            }
          })
        })

      bars = enter
        .merge(bars)
        .attr('x', d => xScale(d.name))
        .attr('width', xScale.bandwidth())
        .transition(t)
        .attr('y', d => yScale(d.value))
        .attr('height', d => this.height - yScale(d.value))
    }

    const updateYAxis = () => {
      const yAxis = axisLeft().scale(yScale)

      if (chart.selectAll('.yaxis').empty()) {
        chart
          .append('g')
          .attr('class', 'axis yaxis')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
          .call(yAxis)
      } else {
        chart
          .selectAll('.yaxis')
          .transition(t)
          .call(yAxis)
      }
    }

    const updateXAxis = () => {
      const xAxis = axisBottom().scale(xScale)

      if (chart.selectAll('.xaxis').empty()) {
        chart
          .append('g')
          .attr('class', 'axis xaxis')
          .attr('transform', `translate(${margin.left}, ${this.height + margin.top})`)
          .call(xAxis)
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '-.55em')
          .attr('transform', 'rotate(-45)')
      } else {
        chart
          .selectAll('.xaxis')
          .transition(t)
          .call(xAxis)
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '-.55em')
          .attr('transform', 'rotate(-45)')
      }
    }

    updateBars()
    updateYAxis()
    updateXAxis()
  }

  render () {
    const { tooltip } = this.state
    return (
      <ChartContainer
        innerRef={node => { this.containerRef = node }}
      >
        <svg
          ref={node => { this.svgRef = node }}
        />
        {
          tooltip.visible &&
          <Tooltip
            x={tooltip.x}
            y={tooltip.y}
          >
            {tooltip.text}
          </Tooltip>
        }
      </ChartContainer>
    )
  }
}
