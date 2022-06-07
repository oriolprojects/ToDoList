import React from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import "../css/ListItems.css";

import { firestore } from "../firebase/firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";


const AddItem = ({ arrayItems, emailUser, setArrayItems }) => {

    async function addItem(e) {
        e.preventDefault();
        const text = e.target.addItem.value;
        // create new array of items
        const newArrayItems = [...arrayItems, { id: + new Date(), text: text, done: false }];
        // update the document
        const docRef = doc(firestore, `users/${emailUser}`);
        await updateDoc(docRef, { items: [...newArrayItems] });
        // update the state
        setArrayItems(newArrayItems);
        // clean the input
        e.target.addItem.value = "";
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
        </Container>
    )
}

export default AddItem;