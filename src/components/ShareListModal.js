import Button from "./Button";
import { Container, Form, Row, Col, Button as FormButton } from "react-bootstrap";
import { doc, updateDoc } from "firebase/firestore"
import { error, success } from "./Toast";
import { firestore } from '../firebase/firebaseConfig';
import "../css/shareListModal.css";
import { AiFillDelete } from 'react-icons/ai';
import { BsFillPersonPlusFill, BsCheckLg } from 'react-icons/bs';
import { CgPlayListAdd } from 'react-icons/cg';


const ShareListModal = ({ searchDocuments, emailUser, username, setUsername, arrayUsers, arrayLists, setArrayLists, listSelected, friends, setFriends, friendsRequests, setFriendsRequests, collaboratorsRequests, setCollaboratorsRequests, setShareListToggle }) => {
    var isFriendRequested = false;

    const onSaveUsername = async (e) => {
        e.preventDefault();
        const newUsername = e.target.username.value;
        if (newUsername === "") {
            error("Username is required");
        } else{
            arrayUsers.forEach((user) => {
                if (user.username === newUsername) {
                    error("Username already exists");
                } else {
                    setUsername(newUsername);
                    updateDoc(doc(firestore, `users/${emailUser}`), {username: newUsername});
                    success("Username updated");
                }
            });
        }
    }

    const onAddFriend = async (e) => {
        e.preventDefault();
        const newFriend = e.target.friendUsername.value;

        if (newFriend === "") {
            error("Please enter a username");
        } else if (!username){
            error("First you need to have a username");
        } else {                
            await arrayUsers.forEach((user) => {
                if (user.username === newFriend) {
                    isFriendRequested = true;
                    if (friends.includes(newFriend)) {
                        error("User already added");
                    } else if(user.friendsRequests.includes(newFriend)) {
                        error("User already requested");
                    } else if(emailUser === user.email) {
                        error("You can't add yourself");
                    } else {
                        const docuRef = doc(firestore, `users/${user.email}`);
                        updateDoc(docuRef, {friendsRequests: [...friendsRequests, {username: username, email: emailUser}]});
                        success("Friend request sent");
                    }
                }
            })
            if (isFriendRequested === false) {
                error("User not found");
            } else {
                isFriendRequested = false;
            }
        }
    }


    return (
        <div className="share-list-container">
            {
                username ?
                    <div>
                        <div className="username-container">
                            <p><b>Username: </b> {username}</p>
                        </div>
                    </div>
                :
                    <div>
                        <Form onSubmit={onSaveUsername}>
                            <Row>
                                <Col className="add-list-container">
                                    <Form.Control className="add-input" type="text" id="username" placeholder="Username..." />
                                    <FormButton type="submit" className="myButton">Save</FormButton>
                                </Col>
                            </Row>
                        </Form>              
                    </div>
            }
            <div>
              <h2>Collaborators:</h2>
              <p>No collaborators</p>
            </div>
            <div>
              <h2>Friends:</h2>
                {
                    friends.length > 0 ?
                        friends.map(friend => {
                            return (
                                <div className="friend-container" key={friend}>
                                    <p>{friend.username}</p>
                                    <Button className="myButton" style="collaborate-button" onPress={() => {
                                        searchDocuments(emailUser).then(data => {
                                            updateDoc(doc(firestore, `users/${friend.email}`), {collaboratorsRequests: [...collaboratorsRequests, {listID: listSelected.id, email: emailUser, username: username, data: data }]});
                                            success("Collaborator request sent");
                                        })
                                    }} textButton={<CgPlayListAdd />} size="icon"/>
                                </div>
                            )
                        })
                    :
                        <p>No friends</p>
                }
            </div>
            <div>
              <h2>Requests:</h2>
                <h4>Friends requests:</h4>
                {
                    friendsRequests.length > 0 ?
                        friendsRequests.map(friendRequest => {
                            return (
                                <div className="friend-request-container" key={friendRequest}>
                                    <p>{friendRequest.username}</p>
                                    <Button className="myButton" style="cancel-accept-button" onPress={() => {
                                        updateDoc(doc(firestore, `users/${emailUser}`), {friendsRequests: friendsRequests.filter(friend => friend !== friendRequest)});
                                        setFriendsRequests(friendsRequests.filter(friend => friend !== friendRequest));
                                        error("Friend request canceled");
                                    }} textButton={<AiFillDelete />} type="secondary" size="icon"/>
                                    <Button className="myButton" style="cancel-accept-button" onPress={() => {
                                        updateDoc(doc(firestore, `users/${emailUser}`), {friends: [...friends, friendRequest], friendsRequests: friendsRequests.filter(friend => friend !== friendRequest)});
                                        updateDoc(doc(firestore, `users/${friendRequest.email}`), {friends: [...friends, {email: emailUser, username: username}]});
                                        setFriends([...friends, friendRequest]);
                                        setFriendsRequests(friendsRequests.filter(friend => friend !== friendRequest));
                                        success("Friend added");
                                    }} textButton={<BsFillPersonPlusFill />} size="icon"/>
                                </div>
                            )
                        })
                    :
                        <p>No friends requests</p>
                }
                <h4>List collaborator requests:</h4>
                {
                    collaboratorsRequests.length > 0 ?
                        collaboratorsRequests.map(collaboratorRequest => {
                            return (
                                <div className="friend-request-container" key={collaboratorRequest}>
                                    {
                                        collaboratorRequest.data.map(col =>{
                                            if(col.id === collaboratorRequest.listID){
                                                {
                                                    console.log(collaboratorRequest)
                                                }
                                                return (
                                                    <div className="friend-request-container" key={col.id}>
                                                        <p>{col.title + " (" + collaboratorRequest.username + ")"}</p>
                                                        <Button className="myButton" style="cancel-accept-button" onPress={() => {
                                                            updateDoc(doc(firestore, `users/${emailUser}`), {collaboratorsRequests: collaboratorsRequests.filter(collaborator => collaborator !== collaboratorRequest)});
                                                            setCollaboratorsRequests(collaboratorsRequests.filter(collaborator => collaborator !== collaboratorRequest));
                                                            error("Collaborator request canceled");
                                                        }} textButton={<AiFillDelete />} type="secondary" size="icon"/>
                                                        <Button className="myButton" style="cancel-accept-button" onPress={() => {
                                                            // changes isCollaborative list to true
                                                            const newList = { id: col.id, title: col.title, items: col.items, email: collaboratorRequest.email}
                                                            const secondNewList = { id: col.id, title: col.title, items: col.items, email: emailUser}
                                                            searchDocuments(collaboratorRequest.email).then(data => {
                                                                // deletes collaborator request
                                                                updateDoc(doc(firestore, `users/${emailUser}`), {collaboratorsRequests: [...collaboratorsRequests.filter(collaborator => collaborator !== collaboratorRequest)], });
                                                                // adds collaborator to collaborator list
                                                                updateDoc(doc(firestore, `users/${emailUser}`), {lists: [...arrayLists, newList], });
                                                                // adds collaborator to first user's collaborator list
                                                                updateDoc(doc(firestore, `users/${collaboratorRequest.email}`), {lists: [...data.filter(collaborator => 
                                                                    collaborator.id !== collaboratorRequest.listID ), secondNewList], });
                                                                setArrayLists([...arrayLists, newList]);
                                                                setCollaboratorsRequests(collaboratorsRequests.filter(collaborator => collaborator !== collaboratorRequest));
                                                            })
                                                            success("List added");
                                                        }} textButton={<BsCheckLg />} size="icon"/>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            )
                        })
                    :
                        <p>No collaborator list requests</p>
                }
                <Container className="edit-title">
                    <Form onSubmit={onAddFriend}>
                        <Row>
                            <Col className="add-list-container">
                                <Form.Control className="add-input" type="text" id="friendUsername" placeholder="Friend username..." />
                                <FormButton type="submit" className="myButton add-friend">Add Friend</FormButton>
                            </Col>
                        </Row>
                    </Form>              
                </Container>
            </div>
            <Button onPress={() => {
              setShareListToggle(false);
            }} type="primary" size="large" style="close-button" textButton="Close"/>
          </div>
    );

}

export default ShareListModal;