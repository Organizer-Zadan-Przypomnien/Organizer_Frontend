import { useState, useEffect } from 'react';
import Sidebar from '../sidebar/sidebar';
import './home.css';
import { expandLink } from '../fetches/expandLink';

function Home() {
    const [notifications, setNotifications] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [filter, setFilter] = useState('all');
    const [isAddVisible, setIsAddVisible] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [newDateEnd, setNewDateEnd] = useState('');

    useEffect(() => {
        fetchNotifications(currentPage, filter);
    }, [filter, currentPage]);

    const fetchNotifications = async (page = 0, filterType = filter) => {
        const size = 5;
        let url = '';

        switch (filterType) {
            case 'today':
                url = expandLink(`/api/notifications/getTodayNotifications?page=${page}&size=${size}`);
                break;
            case 'last7days':
                url = expandLink(`/api/notifications/getLast7DaysNotifications?page=${page}&size=${size}`);
                break;
            case 'currentMonth':
                url = expandLink(`/api/notifications/getCurrentMonthNotifications?page=${page}&size=${size}`);
                break;
            default:
                url = expandLink(`/api/notifications/getAllNotifications?page=${page}&size=${size}`);
                break;
        }

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications);
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
            } else {
                setNotifications([]);
                setTotalPages(1);
                setCurrentPage(0);
            }
        } catch (error) {
            setNotifications([]);
            setTotalPages(1);
            setCurrentPage(0);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchNotifications(page);
    };

    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setFilter(selectedFilter);
        setCurrentPage(0);
    };

    const handleAddNotification = async () => {
        if (!newMessage || !newDateEnd) {
            alert("Wprowadź wszystkie dane powiadomienia.");
            return;
        }

        try {
            const response = await fetch(expandLink('/api/notification/postNotification'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ message: newMessage, dateEnd: newDateEnd })
            });

            if (response.ok) {
                setIsAddVisible(false);
                fetchNotifications(currentPage, filter);
            } else {
                alert("Nie udało się dodać powiadomienia.");
            }
        } catch (error) {
            alert("Wystąpił błąd podczas dodawania powiadomienia.");
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            const response = await fetch(expandLink(`/api/notification/deleteNotification/${id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                fetchNotifications(currentPage, filter);
            } else {
                alert("Nie udało się usunąć powiadomienia.");
            }
        } catch (error) {
            alert("Wystąpił błąd podczas usuwania powiadomienia.");
        }
    };

    return (
        <div className="main-container">
            <Sidebar />
            <div className="content">
                <select value={filter} onChange={handleFilterChange} className="filter-dropdown">
                    <option value="all">Wszystkie powiadomienia</option>
                    <option value="today">Dzisiejsze powiadomienia</option>
                    <option value="last7days">Powiadomienia z ostatnich 7 dni</option>
                    <option value="currentMonth">Powiadomienia z tego miesiąca</option>
                </select>

                {isAddVisible && (
                    <div className="add-form-container">
                        <textarea
                            placeholder="Wiadomość"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        ></textarea>
                        <input
                            type="datetime-local"
                            placeholder="Data zakończenia"
                            value={newDateEnd}
                            onChange={(e) => setNewDateEnd(e.target.value)}
                        />
                        <button onClick={handleAddNotification} className="save-button">Dodaj</button>
                    </div>
                )}

                {notifications.length > 0 ? (
                    <div className="notifications-container">
                        {notifications.map((notification, index) => (
                            <div key={index} className="notification-card">
                                <p>{notification.message}</p>
                                <p>Data zakończenia: {new Date(notification.date_end).toLocaleString()}</p>
                                <button 
                                    className="delete-button"
                                    onClick={() => handleDeleteNotification(notification.ID_NOTIFICATION)}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-notifications">Brak powiadomień do wyświetlenia.</p>
                )}

                <div className="pagination">
                    <button onClick={() => handlePageChange(0)} disabled={currentPage === 0}>{'<<'}</button>
                    <button onClick={() => handlePageChange(Math.max(0, currentPage - 5))} disabled={currentPage < 5}>{'< 5'}</button>
                    <button onClick={() => handlePageChange(Math.max(0, currentPage - 1))} disabled={currentPage === 0}>{'<'}</button>
                    <span>Strona {currentPage + 1} z {totalPages}</span>
                    <button onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage >= totalPages - 1}>{'>'}</button>
                    <button onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 5))} disabled={currentPage >= totalPages - 5}>{'> 5'}</button>
                    <button onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage >= totalPages - 1}>{'>>'}</button>
                </div>

                <div className="add-notification">
                    <button className="add-button" onClick={() => setIsAddVisible(!isAddVisible)}>+</button>
                </div>
            </div>
        </div>
    );
}

export default Home;
