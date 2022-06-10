import React from "react";
import { Container, Stack, Row, Col, Button, Form } from "react-bootstrap";
import '../css/ListItems.css';
import Item from "./Item";
import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import Select from 'react-select'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ListLists = ({ arrayLists, arrayItems, emailUser, setArrayItems, setArrayLists, listSelected, setListSelected, newListToggle, setNewListToggle }) => {


    const options = arrayLists.map(list => {
        return {
            value: list.id,
            label: list.title
        }}
    );


    const onDeleteItem = (id) => {
        // crete new array of items without the one to delete
        const newList = [];
        arrayLists.map(list => {
            if (list.id === listSelected.id) {
                const currentList = {id: list.id, title: list.title, items: list.items.filter(item => item.id !== id)};
                newList.push(currentList);  
            } else{
                newList.push(list);
            }
        });

        // update the document on the database
        const docuRef = doc(firestore, `users/${emailUser}`);
        updateDoc(docuRef, {lists: newList});
        // update the state
        setArrayItems(arrayItems => arrayItems.filter(item => item.id !== id));
        setArrayLists(newList);
    }

    const onToggle = (id) => {
        const newList = [];
        arrayLists.map(list => {
            if (list.id === listSelected.id) {
                const currentList = {id: list.id, title: list.title, items: list.items.map(item => {
                    if (item.id === id) {
                        return {id: item.id, text: item.text, done: !item.done}
                    } else {
                        return item
                    }
                }
                )};
                setArrayItems(currentList.items);
                newList.push(currentList);
            } else{
                newList.push(list);
            }
        });

        const docuRef = doc(firestore, `users/${emailUser}`);
        updateDoc(docuRef, {lists: newList});
        // update the state
        setArrayLists(newList);
    }


    const onToggleList = (id) => {
        arrayLists.map(list => {
            if (list.id === id) {
                setListSelected(list)
                setArrayItems(list.items);
            }
        });

        if (id === 0) {
            setNewListToggle(true);
        } else {
            setNewListToggle(false);
        }
    }

    const handleSelectChange = (e) => {
        onToggleList(e.value);
    }

    var defaultValue = {
        value: 0,
        label: "Select a list..."
    }

    return (
        <Container className="container-listitems">
            <Stack>
                <Select className="select-list-input" options={options} onChange={handleSelectChange} placeholder="Select a list..."  defaultValue={defaultValue}/>
                {
                    newListToggle ?
                        <div className="add-list-form">
                            <Container className="add-list-form">
                                <Form onSubmit={(e) => {
                                            e.preventDefault();
                                            const newList = {
                                                id: + new Date(),
                                                title: document.querySelector(".input-addlist").value,
                                                items: []
                                            }
                                            const docuRef = doc(firestore, `users/${emailUser}`);
                                            updateDoc(docuRef, {lists: [...arrayLists, newList]});
                                            setArrayLists([...arrayLists, newList]);
                                            toast.success("List added successfully", {
                                                position: "top-right",
                                                autoClose: 3000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                                });
                                        }}>
                                    <Row>
                                        <Col className="add-list-container">
                                            <Form.Control className="input-addlist add-input" type="text" id="addItem" placeholder="Add list..." />
                                            <Button type="submit" className="myButton">Add list</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                            <Container className="list-lists" >
                                <ul>
                                    {
                                        arrayLists.map(list => {
                                            if (list.id !== 0) {
                                                return (
                                                    <div className="every-list" key={list.id} onClick={() => onToggleList(list.id)}>{list.title}</div>
                                                )
                                            }
                                        })
                                    }
                                </ul>
                            </Container>
                            <ToastContainer />
                        </div>
                    :
                        null
                }
                {
                    arrayItems ?
                        arrayItems.map(item => {
                            return (
                                <Item key={item.id} item={item} onDelete={onDeleteItem} onToggle={onToggle} />
                            )
                        })
                    :
                        null
                }
            </Stack>
        </Container>
    )
}

export default ListLists;