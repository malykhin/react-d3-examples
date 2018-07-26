import React, { Component } from 'react'
import styled from 'styled-components'

import Map from '../components/Map'
import BarChart from '../components/BarChart'
import DonutChart from '../components/DonutChart'
import SvgView from '../components/SvgView'
import { getData } from '../service'

const MainWrap = styled.div`
  margin-left: 20px;
  margin-top: 20px;


`
export default class Root extends Component {
  state = {
    data: getData()
  }

  componentDidMount () {
    setInterval(() => {
      this.setState({data: getData()})
    }, 2000)
  }

  render () {
    return (
      <MainWrap>
        <SvgView />
        <Map />
        <BarChart data={this.state.data} />
        <DonutChart data={this.state.data} />
      </MainWrap>
    )
  }
}
