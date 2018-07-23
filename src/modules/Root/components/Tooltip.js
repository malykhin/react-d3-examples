import styled from 'styled-components'

const Tooltip = styled.div`
  position: absolute;
  height: 50px;
  line-height: 50px;
  width: 100px;
  background-color: white;
  pointer-events: none;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0 , 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  left: ${props => props.x + 'px'};
  top: ${props => props.y + 'px'};
  border: solid 1px gray;
  text-align: center;
`

export default Tooltip
