import styles from './NotificationsPopup.module.css';
import {ReactComponent as CommentIcon} from '../Assets/notifications/comment.svg';
import {ReactComponent as MentionIcon} from '../Assets/notifications/mention.svg';
import {useAPI} from '../AppState/AppState';
import React, {useEffect, useState} from 'react';
import {NotificationInfo} from '../API/NotificationsAPIHelper';
import PostLink from './PostLink';
import DateComponent from './DateComponent';

type NotificationsPopupProps = {
    onClose?: () => void;
};

export default function NotificationsPopup(props: NotificationsPopupProps) {
    const api = useAPI();
    const [notifications, setNotifications] = useState<NotificationInfo[]>();
    const [error, setError] = useState('');

    useEffect(() => {
        api.notifications.list()
            .then(list => {
                console.log('notifications', list);

                setNotifications(list);
            })
            .catch(err => {
                setError('Не удалось загрузить уведомления');
                console.log('notifications error', err);
            });
    }, []);

    const handleNotificationClick = (e: React.MouseEvent<HTMLAnchorElement>, notify: NotificationInfo) => {
        api.notifications.read(notify.id)
            .then()
            .catch();
        if (props.onClose) {
            props.onClose();
        }
    };

    const handleClearAll = () => {
        api.notifications.readAll()
            .then()
            .catch();
        if (props.onClose) {
            props.onClose();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.notifications}>
                {error}
                {notifications && notifications.map(notify => {
                    return <PostLink
                        key={notify.id}
                        className={styles.notification}
                        post={{ id: notify.source.post.id, site: notify.source.post.site }}
                        commentId={notify.source.comment?.id}
                        onClick={e => handleNotificationClick(e, notify)}
                    >
                        <div className={styles.type}>{notify.type === 'answer' ? <CommentIcon /> : <MentionIcon />}</div>
                        <div className={styles.content}>
                            <div className={styles.date}>{notify.source.byUser.username} {notify.type === 'answer' ? 'ответил вам' : 'упомянул вас'} <DateComponent date={notify.date} /></div>
                            <div className={styles.text}>{notify.source.comment?.content}</div>
                        </div>
                    </PostLink>
                })}
            </div>
            <div className={styles.buttons}>
                <button className={styles.buttonClear} onClick={handleClearAll}>Очистить</button>
                <button className={styles.buttonAll} disabled={true}>Все чпяки</button>
            </div>
        </div>
    )
}
