import React, { Component } from 'react'
import styled from 'styled-components'
import { select } from 'd3-selection'

const Wrapper = styled.div`
  & .area:hover {
    opacity: 0.2;
    cursor: pointer;
  }

  & input[type="file"] {
    font-size: 16px;
  }
`

const ControlRow = styled.div`
  display: flex;
  width: 300px;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  align-items: center;

  & button, label, input{
    font-size: 16px;
  }
`

const FileInput = styled.input
  .attrs({
    type: 'file',
    accept: 'image/svg+xml'
  })`
`

const Mark = styled.div`
  position: absolute;
  line-height: 18px;
  height: 20px;
  width: 20px;
  border: 1px solid black;
  border-radius: 50%;
  background-color: white;
  left: ${props => props.x + 'px'};
  top: ${props => props.y + 'px'};
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: black;
`

export default class SvgView extends Component {
  constructor (props) {
    super(props)
    this.node = React.createRef()
    this.state = {
      image: '',
      justUploaded: false,
      color: '#fff',
      number: 0,
      click: {
        clicked: false,
        areaIndex: -1,
        x: -1,
        y: -1
      },
      tenants: {}
    }
    this.width = 400
    this.height = 400
  }

  componentDidUpdate () {
    if (this.state.justUploaded) {
      this.setState({justUploaded: false}, this.embedSvg)
    }
    if (this.state.image) {
      this.renderD3()
    }
  }

  renderD3 () {
    const selector = '.area'

    select(this.node)
      .selectAll(selector)
      .on('click', (_, index, nodes) => {
        const place = nodes[index]
        const areaIndex = place.getAttribute('area-index')
        const box = nodes[index].getBoundingClientRect()
        const x = box.x + box.width / 2
        const y = box.y + box.height / 2
        this.setState({click: {
          clicked: true,
          areaIndex,
          x,
          y
        }})
      })
      .attr('fill', (_, index, nodes) => {
        const place = nodes[index]
        const areaIndex = place.getAttribute('area-index')
        const tenants = this.state.tenants
        if (tenants.hasOwnProperty(areaIndex)) {
          return tenants[areaIndex].color
        }
        return place.getAttribute('fill')
      })
  }

  embedSvg () {
    // const selector = 'rect[style="fill: rgb(255, 0, 0);"]'
    const selector = 'polygon.fil2'

    select(this.node)
      .html(this.state.image)
      .select('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .selectAll(selector)
      .attr('style', null)
      .attr('fill', '#999')
      .attr('stroke', '#333')
      .attr('class', 'area')
      .attr('area-index', (_, index) => index)
  }

  handleFileSelect = (e) => {
    const reader = new window.FileReader()

    reader.addEventListener('load', (loadEvent) => {
      if (loadEvent.target.readyState !== 2 || loadEvent.target.error) {
        return
      }
      this.setState({
        image: loadEvent.target.result,
        justUploaded: true,
        color: '#fff',
        number: 0,
        click: {
          clicked: false,
          areaIndex: -1,
          x: -1,
          y: -1
        },
        tenants: {}
      })
    })

    const file = e.target.files[0]
    if (file) {
      reader.readAsText(file)
    }
  }

  handleNumberChange = (e) => {
    const number = e.target.value
    this.setState({number})
  }

  handleColorChange = (e) => {
    const color = e.target.value
    this.setState({color})
  }

  handleSubmit = () => {
    const {
      color,
      number,
      tenants,
      click
    } = this.state

    const regexNumber = /\d/
    const regexColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

    if (regexColor.test(color) && regexNumber.test(number)) {
      tenants[click.areaIndex] = {
        ...tenants[click.areaIndex],
        x: click.x - 10,
        y: click.y - 10,
        number,
        color
      }
      this.setState({
        click: {
          clicked: false,
          areaIndex: -1,
          x: -1,
          y: -1
        },
        color: '#fff',
        number: 0,
        tenants
      })
    }
  }

  handleCancel = () => {
    this.setState({
      click: {
        clicked: false,
        areaIndex: -1,
        x: -1,
        y: -1
      },
      color: '#fff',
      number: 0
    })
  }

  getNodeRef = node => (this.node = node)

  render () {
    const {
      click,
      tenants
    } = this.state
    let {
      color,
      number
    } = this.state

    if (tenants.hasOwnProperty(click.areaIndex)) {
      const tenant = tenants[click.areaIndex]
      color = tenant.color
      number = tenant.number
    }

    return (
      <Wrapper>
        {
          Object.keys(tenants).map(key => {
            const tenant = tenants[key]
            return (
              <Mark
                key={key}
                x={tenant.x}
                y={tenant.y}
              >
                {tenant.number}
              </Mark>
            )
          })
        }
        <FileInput
          onChange={this.handleFileSelect}
        />
        <div ref={this.getNodeRef} />
        {
          click.clicked &&
          <div>
            <ControlRow>
              <label>Number:</label>
              <input
                type={'text'}
                value={number}
                onChange={this.handleNumberChange}
              />
            </ControlRow>
            <ControlRow>
              <label>Color:</label>
              <input
                type={'text'}
                value={color}
                onChange={this.handleColorChange}
              />
            </ControlRow>
            <ControlRow>
              <button onClick={this.handleSubmit}>OK</button>
              <button onClick={this.handleCancel}>Cancel</button>
            </ControlRow>
          </div>
        }
      </Wrapper>
    )
  }
}
