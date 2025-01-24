import { sessionApi } from 'api';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { fetchPersonal } from 'store/personal/personalThunk';

function HostLiveFeature(props) {
    let { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();

    const { profile } = useSelector((state) => state.personal);
    const { access_token } = useSelector((state) => state.auth);

    const [sessionInfo, setSessionInfo] = useState();
    const isHostUser = useMemo(() => {
        return profile?._id === sessionInfo?.host_user;
    }, [sessionInfo, profile]);

    useEffect(() => {
        if (!profile) {
            if (access_token) {
                dispatch(fetchPersonal());
            } else {
                dispatch(fetchPersonal({ is_temp: true }));
            }
        }
    }, []);

    useEffect(async () => {
        if (location.state) {
            sessionInfo(location.state);
        } else {
            const data = await getSession(id);
            setSessionInfo(data);
        }
    }, [location]);

    const getSession = async (id) => {
        try {
            const { data } = await sessionApi.getDetail(id);

            return data;
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="relative h-screen min-h-0 overflow-hidden bg-indigo-950">
            {isHostUser ? (
                <h3 className="text-white">'Waiting player'</h3>
            ) : (
                <h3>'man hinh cua Player</h3>
            )}
        </div>
    );
}

export default HostLiveFeature;
