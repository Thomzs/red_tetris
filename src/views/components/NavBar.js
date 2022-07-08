
import {useDispatch, useSelector} from "react-redux";
import '../../assets/styles/nav.scss';
import {useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Container, Form, FormControl, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {setUsername} from "../../slices/playerSlice";
import {debounce} from "../../utils/debounce";
import {setStatusHome} from "../../slices/statusSlice";

const NavBar = () => {
    const { player, }  = useSelector((state) => state);
    const { status: {_status} } = useSelector( (state) => state);
    const dispatch = useDispatch();

    const updatePlayer = (event) => {
        let username = event.target.value;

        dispatch(setUsername(username));
    };

    const backHome = () => {
        dispatch(setStatusHome());
    }

     const inputHandler = debounce((e) => updatePlayer(e), 250);

    //TODO Change game status from GAME to HOME
    return (
        <Navbar bg="light nav-style" expand="lg">
            <Container fluid>
                <Navbar.Brand className="regularText"><span className="tetris">Red</span>Tetris.</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                    </Nav>
                    <Form className="d-flex">
                        <img src={player._avatar}
                             className="small-avatar" alt=""/>
                        <FormControl
                            type="username"
                            placeholder={player._username}
                            className="me-2"
                            aria-label="username"
                            onChange={inputHandler}
                        />
                    </Form>
                    <Button
                        variant="danger"
                        style={{ whiteSpace: "nowrap", marginLeft: 50}}
                        disabled={_status === 'HOME'}
                        onClick={backHome}
                    >Quit game</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;