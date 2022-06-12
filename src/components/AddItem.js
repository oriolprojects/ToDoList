import React from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import "../css/ListItems.css";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { error, success } from "./Toast";


import { firestore } from "../firebase/firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";


const AddItem = ({ arrayItems, arrayLists, emailUser, setArrayItems, setArrayLists, listSelected, searchDocuments, isCollaborative, setIsCollaborative}) => {

    async function addItem(e) {
        e.preventDefault();
        const text = e.target.addItem.value;
        // check if the text is empty
        if (text === "") {
            error("Please enter a text");
            } 
        else {
            // create new array of items
            const newList = [];
            const secondaryList = [];

            var email = null
            var newID = Date.now() 

            arrayLists.map(list => {
                if (list.email){
                    if (list.id === listSelected.id) {
                        email = list.email
                        const currentList = {id: list.id, title: list.title, email: list.email, items: [...list.items, {id: newID, text: text, done: false}]};
                        newList.push(currentList);
                    } else{
                        newList.push(list);
                    }
                } else{
                    if (list.id === listSelected.id) {
                        const currentList = {id: list.id, title: list.title, items: [...list.items, {id: newID, text: text, done: false}]};
                        newList.push(currentList);
                    } else{
                        newList.push(list);
                    }
                }
            });
            // update the document on the database
            const docuRef = doc(firestore, `users/${emailUser}`);
            updateDoc(docuRef, {lists: newList});

            if(email) {
                searchDocuments(email).then(data => {
                    data.map(list => {
                        if (list.id === listSelected.id) {
                            const currentList = {id: list.id, title: list.title, email: list.email, items: [...list.items, {id: newID, text: text, done: false}]};
                            secondaryList.push(currentList);
                        } else{
                            secondaryList.push(list);
                        }
                    });
                    // update the document on the database
                    const docuRef = doc(firestore, `users/${email}`);
                    updateDoc(docuRef, {lists: secondaryList});
                }
                )
            }

            // clear the input
            e.target.addItem.value = "";
            // update the state
            setArrayItems(arrayItems => [...arrayItems, {id: Date.now(), text: text, done: false}]);
            setArrayLists(newList);

            success("Item added");
        }
    }

    return (
        <Container>
            <Form onSubmit={addItem}>
                <Row>
                    <Col className="add-list-container">
                        <Form.Control className="add-input" type="text" id="addItem" placeholder="Add item..." />
                        <Button type="submit" className="myButton">Add</Button>
                    </Col>
                </Row>
            </Form>
            <ToastContainer />                 
        </Container>
    )
}

export default AddItem;