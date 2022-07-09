import { Spinner } from '@chakra-ui/react'

function Loader () {
    return (
        <div className='loading'>
            <Spinner style={{width: '10rem', height: '10rem'}} />
        </div>
    );
}

export default Loader;