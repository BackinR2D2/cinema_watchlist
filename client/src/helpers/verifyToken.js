import url from './url';
import axios from 'axios';

const isValid = async () => {
    const token = localStorage.getItem('auth');
    if (token) {
        try {
            const response = await axios.get(`${url}/auth/validate`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return {
                status: 1,
                valid: response.data.valid
            };
        } catch (error) {
            return {
                status: 1,
                valid: false
            };
        }
    }
    return {
        status: 1,
        valid: false
    };
}

export default isValid;