import React, { Component } from 'react'
import styled from 'styled-components'
import { select } from 'd3-selection'

import Tooltip from './Tooltip'

import { mapElements } from '../mapElements'

const Container = styled.div`
  position: relative;
`

export default class Map extends Component {
  constructor () {
    super()
    const mapData = mapElements.map(item => ({...item, fill: 'white'}))
    this.state = {
      mapData,
      tooltip: {
        text: '',
        visible: false,
        x: 0,
        y: 0
      }
    }
  }

  componentDidMount () {
    this.renderD3()
  }

  componentDidUpdate () {
    this.renderD3()
  }

  renderD3 = () => {
    const node = this.svgRef
    const container = this.containerRef
    const mapData = this.state.mapData

    select(node)
      .selectAll('path')
      .data(mapData)
      .enter()
      .append('path')

    select(node)
      .selectAll('path')
      .data(mapData)
      .exit()
      .remove()

    select(node)
      .selectAll('path')
      .data(mapData)
      .attr('d', d => d.path)
      .attr('stroke', 'black')
      .attr('fill', d => d.fill)
      .style('cursor', 'pointer')

    select(node)
      .selectAll('path')
      .data(mapData)
      .on('mouseover', (d, index, nodes) => {
        const bounds = nodes[index].getBoundingClientRect()
        const containerBounds = container.getBoundingClientRect()
        const mapData = this.state.mapData
        mapData[index].fill = 'gray'
        this.setState({
          mapData,
          tooltip: {
            ...this.state.tooltip,
            text: index.toString(),
            visible: true,
            x: bounds.x - containerBounds.x + bounds.width / 2,
            y: bounds.y - containerBounds.y + bounds.height / 2
          }
        })
      })
      .on('mouseout', (d, index) => {
        const mapData = this.state.mapData
        mapData[index].fill = 'white'
        this.setState({
          mapData,
          tooltip: {
            ...this.state.tooltip,
            text: '',
            visible: false,
            x: 0,
            y: 0
          }
        })
      })
      .on('click', (d, index, nodes) => {
        const node = select(nodes[index]).node()

        const mapData = this.state.mapData
        mapData[index].clicked = !mapData[index].clicked
        this.setState({...this.state, mapData})
        select(node)
          .transition()
          .duration(500)
          .style('opacity', mapData[index].clicked ? 0.1 : 1)
      })
  }

  fixTooltip = (state) => {
    const {tooltip} = this.state
    tooltip.fixed = state
    if (!state) {
      tooltip.visible = false
      tooltip.x = 0
      tooltip.y = 0
    }
    this.setState({tooltip})
  }

  render () {
    const { tooltip } = this.state

    return (
      <Container
        innerRef={node => { this.containerRef = node }}
      >
        <svg
          ref={node => { this.svgRef = node }}
          width={500}
          height={500}
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
      </Container>
    )
  }
}
