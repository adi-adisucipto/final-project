import { Ring } from 'react-css-spinners'

function Spinner(props: {size: number, thickness: number}) {
  return (
    <div>
      <Ring size={props.size} thickness={props.thickness} color='rgba(0,0,0,1)'/>
    </div>
  )
}

export default Spinner
