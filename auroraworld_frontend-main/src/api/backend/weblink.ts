import { axiosAuthInstance } from '../axiosInstance';

type Category = 'favorites' | 'work' | 'reference' | 'education';
type getCategory = 'all' | 'favorites' | 'work' | 'reference' | 'education' | 'shared';

export const createWeblink = async (credentials: { name: string; url: string; category: Category }) => {
    await axiosAuthInstance.post('/weblink/', credentials);
};

export const deleteWeblink = async (weblink_id: number) => {
    await axiosAuthInstance.delete('/weblink/delete/', {
        data: { weblink_id },
    });
};

export const updateWeblink = async (credentials: { weblink_id: number; name: string; url: string; category: Category }) => {
    await axiosAuthInstance.patch('/weblink/update/', credentials);
};

export const getWeblink = async (category: getCategory, keyword: string) => {
    const response = await axiosAuthInstance.get('/weblink/search', {
        params: {
            category,
            keyword,
        },
    });

    return response;
};

export const getShareUser = async (weblinkId: number) => {
    const response = await axiosAuthInstance.get('/weblink/search/share/user', {
        params: {
            weblinkId,
        },
    });

    return response;
};

export const getSearchUser = async (keyword: string) => {
    const response = await axiosAuthInstance.get('/weblink/search/user', {
        params: {
            keyword,
        },
    });

    return response;
};

export const createShare = async (credentials: { userId: number; weblinkId: number; isNewUser: boolean }) => {
    await axiosAuthInstance.post('/weblink/share/', credentials);
};

export const updateShare = async (credentials: { userId: number; weblinkId: number; permission: 'read' | 'write' }) => {
    await axiosAuthInstance.patch('/weblink/share/update/', credentials);
};

export const deleteShare = async (userId: number, weblinkId: number, isUserExist: boolean) => {
    await axiosAuthInstance.delete('/weblink/share/delete/', {
        data: { userId, weblinkId, isUserExist },
    });
};
