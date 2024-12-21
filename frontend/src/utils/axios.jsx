import axios from 'axios';
import { message } from 'antd';

axios.execute = async (method, url, payload = null, options = {}) => {
    const { enableMessage = true, log = false } = options;
    try {
        // 1. Lấy token
        const token = JSON.parse(localStorage.getItem('token')) || null;

        // 2. Tạo headers
        const headers = {
            'x-api-key': token?.['x-api-key'],
            'x-user-id': token?.['x-user-id'],
        };

        // 3. Cấu hình request
        let response;
        const config = {
            headers,
            ...(options?.config || {}) // Cho phép custom config
        };

          if(log) {
                console.log('Request:', {
                    method,
                    url,
                    payload,
                    config
                })
            }

        switch (method.toLowerCase()) {
            case 'get':
                response = await axios.get(url, config);
                break;
            case 'post':
                response = await axios.post(url, payload, config);
                break;
            case 'put':
                response = await axios.put(url, payload, config);
                break;
            case 'patch':
                response = await axios.patch(url, payload, config);
                break;
            case 'delete':
                response = await axios.delete(url, config);
                break;
            default:
                if (enableMessage) message.error('Invalid method');
                if (log) console.error('Invalid method');
                return; // Kết thúc nếu method không hợp lệ
        }


        // 4. Xử lý response
        if (response.status === 200) {
            if (enableMessage && response?.data?.message) message.success(response.data.message);
            if(log) console.log('Response success:', response)
            return response.data.metadata;
        } else {
            if (enableMessage && response?.data?.message) message.error(response.data.message);
            if(log) console.error('Response failed:', response)
        }
    } catch (error) {
        if(log) console.error('Request error:', error)
          if (error.response) {
            if (enableMessage) message.error(error.response.data.message);
            } else if (error.request) {
                 if (enableMessage) message.error('Network Error. Could not connect to the server');
            } else {
                 if (enableMessage) message.error(`An error occurred: ${error.message}`);
            }
    }
};

export default axios;