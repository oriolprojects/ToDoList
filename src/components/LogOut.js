import {RiLogoutBoxRLine} from 'react-icons/ri';

const LogOut = ({logout}) => {
    return (
        <div className="logout">
            <RiLogoutBoxRLine onClick={() => {
                logout();
            }} className="icon" />
        </div>
    );
}

export default LogOut;