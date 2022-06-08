import React from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import "../css/ListItems.css";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { firestore } from "../firebase/firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";


const AddItem = ({ arrayItems, emailUser, setArrayItems }) => {

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
            
            } else {
                // create new array of items
                const newArrayItems = [...arrayItems, { id: + new Date(), text: text, done: false }];
                // update the document
                const docRef = doc(firestore, `users/${emailUser}`);
                await updateDoc(docRef, { items: [...newArrayItems] });
                // update the state
                setArrayItems(newArrayItems);
                // clean the input
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
                    <Col>
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