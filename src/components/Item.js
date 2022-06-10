import { Row, Col } from "react-bootstrap";
import Button from "./Button";
import { AiFillDelete } from "react-icons/ai";
import '../css/ListItems.css';
import ButtonCheck from "./ButtonCheck";

const Item = ({item, onDelete, onToggle}) => {
    const isDone = item.done ? "list-item done" : "list-item"

    return (
        <Row className={isDone}>
            <Col>
                <ButtonCheck textButton={item.text} done={isDone} onClick={
                    () => {
                        onToggle(item.id);
                    }
                }/>
            </Col>
            <Col>
                <Button type="secondary" style="button-items" size="icon" textButton={<AiFillDelete/>} onPress={
                    () => {
                        onDelete(item.id);
                    }
                }/>
            </Col>
        </Row>
    )
}

export default Item;