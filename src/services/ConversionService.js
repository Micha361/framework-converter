import axios from 'axios';

export const convertProject = async (folder, framework) => {
    const formData = new FormData();
    formData.append('folder', folder);
    formData.append('framework', framework);

    const response = await axios.post('/api/convert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
};
