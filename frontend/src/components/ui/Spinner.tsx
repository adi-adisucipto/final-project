import { Ring } from 'react-css-spinners'

function Spinner(props: {size: number, thickness: number}) {
  return (
    <div>
      <Ring size={props.size} thickness={props.thickness}/>
    </div>
  )
}

export default Spinner
