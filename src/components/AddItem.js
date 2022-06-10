import React from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import "../css/ListItems.css";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { firestore } from "../firebase/firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";


const AddItem = ({ arrayItems, arrayLists, emailUser, setArrayItems, setArrayLists, listSelected }) => {

    async function addItem(e) {
        e.preventDefault();
        const text = e.target.addItem.value;
        // check if the text is empty
        if (text === "") {
            toast.error("Add text before adding...", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
              });
            
            } 
        else {
            // create new array of items
            const newList = [];

            arrayLists.map(list => {
                if (list.id === listSelected.id) {
                    const currentList = {id: list.id, title: list.title, items: [...list.items, {id: Date.now(), text: text, done: false}]};
                    newList.push(currentList);
                } else{
                    newList.push(list);
                }
            });
            // update the document on the database
            const docuRef = doc(firestore, `users/${emailUser}`);
            updateDoc(docuRef, {lists: newList});
            // update the state
            setArrayItems(arrayItems => [...arrayItems, {id: Date.now(), text: text, done: false}]);
            setArrayLists(newList);
            console.log(newList);
            // clear the input
            e.target.addItem.value = "";
            toast.success("Item added successfully", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
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