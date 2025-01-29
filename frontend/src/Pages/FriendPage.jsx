import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Page.css/FriendPage.css';


const FriendPage = () => {
    
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
  
    useEffect(() => {
        // Fetch user's friends
        axios.get('/api/friend/friends')
            .then(response => {
                setFriends(response.data);
            })
            .catch(error => {
                console.error('Error fetching friends:', error);
            });

        // Fetch friend recommendations
        axios.get('/api/friend/recommendations')
            .then(response => {
                setRecommendations(response.data);
            })
            .catch(error => {
                console.error('Error fetching recommendations:', error);
            });
    }, []);
  
    // Handle friend search
    const handleSearch = () => {
        if (searchTerm.trim()) {
            axios.get(`/api/friend/search/${searchTerm}`)
                .then(response => {
                    setSearchResults(response.data);
                })
                .catch(error => {
                    console.error('Error searching users:', error);
                });
        } else {
            setSearchResults([]);
        }
    };
  
    // Handle send friend request
    const sendFriendRequest = (friendId) => {
        axios.post(`/api/friend/send-request/${friendId}`)
            .then(response => {
                alert('Friend request sent!');
            })
            .catch(error => {
                console.error('Error sending friend request:', error);
            });
    };

    // Handle accept friend request
    const acceptFriendRequest = (friendId) => {
        axios.post(`/api/friend/accept-request/${friendId}`)
            .then(response => {
                alert('Friend request accepted!');
            })
            .catch(error => {
                console.error('Error accepting friend request:', error);
            });
    };

    // Handle reject friend request
    const rejectFriendRequest = (friendId) => {
        axios.post(`/api/friend/reject-request/${friendId}`)
            .then(response => {
                alert('Friend request rejected!');
            })
            .catch(error => {
                console.error('Error rejecting friend request:', error);
            });
    };

    return (
        <div className="friend-page">
            <h2>Your Friends</h2>
            <div className="friends-list">
                {friends.map(friend => (
                    <div key={friend._id} className="friend-item">
                        <p>{friend.username}</p>
                        <button onClick={() => rejectFriendRequest(friend._id)}>Unfriend</button>
                    </div>
                ))}
            </div>
            
            <h3>Recommended Friends</h3>
            <div className="recommendations-list">
                {recommendations.map(friend => (
                    <div key={friend._id} className="friend-item">
                        <p>{friend.username}</p>
                        <button onClick={() => sendFriendRequest(friend._id)}>Send Friend Request</button>
                    </div>
                ))}
            </div>

            <h3>Search Friends</h3>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by username"
            />
            <button onClick={handleSearch}>Search</button>
            <div className="search-results">
                {searchResults.length > 0 ? (
                    searchResults.map(user => (
                        <div key={user._id} className="search-item">
                            <p>{user.username}</p>
                            <button onClick={() => sendFriendRequest(user._id)}>Send Friend Request</button>
                        </div>
                    ))
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </div>
    );
};

export default FriendPage;
