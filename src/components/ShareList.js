import {AiOutlineUsergroupAdd} from 'react-icons/ai'

const ShareList = ({ setShareListToggle }) => {
    

    return (
        <div className="icon">
            <AiOutlineUsergroupAdd onClick={() => {
                setShareListToggle(true)
            }}/>
        </div>
    )

}

export default ShareList