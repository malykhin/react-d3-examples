import React, { Component } from 'react'
import styled from 'styled-components'
import {
  select
} from 'd3-selection'

import {
  scaleOrdinal
} from 'd3-scale'

import {
  schemePaired
} from 'd3-scale-chromatic'

import {
  pie
} from 'd3-shape'

import {
  arc
} from 'd3'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const LegendWrap = styled.div`
  
`

const Row = styled.div`
  margin-bottom: 5px;
`

const ColorTag = styled.div`
  background-color: ${props => props.color};
  height: 10px;
  width: 10px;
  display: inline-block;
`

const Name = styled.span`
  margin-left: 5px;
`

const Legend = ({legend}) => {
  return (
    <LegendWrap>
      {
        legend.map(item => (
          <Row key={item.name} >
            <ColorTag
              color={item.color}
            />
            <Name>{item.name}</Name>
          </Row>
        ))
      }
    </LegendWrap>
  )
}

export default class DonutChart extends Component {
  constructor () {
    super()
    this.state = {
      legend: []
    }
    this.width = 500
    this.height = 500
    this.radius = Math.min(this.width, this.height) / 2
    this.colorScale = scaleOrdinal(schemePaired)
  }

  componentWillReceiveProps (newProps) {
    this.setLegend(newProps)
  }

  componentDidMount () {
    this.setLegend(this.props)
    this.renderChart()
  }

  componentDidUpdate () {
    this.renderChart()
  }

  setLegend = (props) => {
    const legend = props.data.map((item, index) => ({
      name: item.name,
      color: this.colorScale.range()[index]
    }))

    this.setState({legend})
  }

  renderChart = () => {
    const chart = select(this.node)
    const data = this.props.data

    const margin = {
      top: 20,
      right: 20,
      bottom: 80,
      left: 40
    }

    chart
      .attr('width', this.width + margin.left)
      .attr('height', this.height + margin.bottom + margin.top)

    const arcLayout = arc()
      .innerRadius(150)
      .outerRadius(this.radius)

    const pieChart = pie()
      .value(d => d.value)

    const updatePie = () => {
      let arcs = chart
        .selectAll('.arc')
        .attr('transform', `translate(${this.radius},${this.radius})`)
        .data(pieChart(data))

      arcs
        .exit()
        .remove()

      const enter = arcs
        .enter()
        .append('path')
        .attr('transform', `translate(${this.radius},${this.radius})`)
        .attr('class', 'arc')

      arcs = enter
        .merge(arcs)
        .attr('d', arcLayout)
        .attr('fill', (_, index) => this.colorScale.range()[index])
    }
    updatePie()
  }

  render () {
    return (
      <Wrapper>
        <svg
          ref={node => { this.node = node }}
        />
        <Legend legend={this.state.legend} />
      </Wrapper>
    )
  }
}
