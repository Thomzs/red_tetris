import {useDispatch, useSelector} from "react-redux";
import {Send} from "react-bootstrap-icons";
import {useForm} from "react-hook-form";
import {sendChat} from "../../slices/roomSlice";
import {useEffect, useRef} from "react";

const SystemMessage = (props) => {
    return (
        <div className="divider d-flex align-items-center mb-2">
            <p className="text-center mx-3 mb-0" style={{color: 'rgb(131,135,147)'}}>{props.text}</p>
        </div>
    );
}

const OthersMessage = (props) => {
    return (
        <div className="d-flex flex-row justify-content-start mb-4">
            <img
                src={props.player._avatar}
                alt="avatar 1" style={{width: '45px', height: '100%'}}/>
            <div>
                <div>
                    <p className="small ms-3 mb-1 rounded-3 text-muted d-inline-block">{props.player._username}</p>
                </div>
                {props.text.map((_text, index) => {
                    return (
                        <div>
                            <p key={index} className="small p-2 ms-3 mb-1 rounded-3 text-white d-inline-block"
                               style={{backgroundColor: '#000000'}}>{_text}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const MeMessage = (props) => {
    let className = "d-flex flex-row justify-content-end mb-4 pt-1";

    if (props.text.length === 1) {
        className += " align-items-center";
    } else {
        className += " align-items-top";
    }

    return (
        <div className={className}>
            <div className="">
                {props.text.map((_text, index) => {
                    return (
                        <div className="d-flex justify-content-end">
                            <p key={index} className="small p-2 me-3 mb-1 text-white rounded-3 bg-danger d-inline-block">{_text}</p>
                        </div>
                    );
                })}
            </div>
            <img
                src={props.player._avatar}
                alt="avatar 1" style={{width: '45px', height: '100%'}}/>
        </div>
    );
}

const renderChat = (player, chat) => {
    let toDisplay = [];

    for (let i = 0; i < chat.length; i++) {
        if (chat[i].from === 'system') {
            let text = chat[i].text;
            if (chat[i].key && chat[i].key === 'join' && chat[i].playerId === player._id)
                text = 'You have joined the room';
            else if (chat[i].key && chat[i].key === 'admin' && chat[i].playerId === player._id)
                text = 'You are now the admin of the room';
            toDisplay.push(<SystemMessage key={i} text={text}/>);
        } else if (chat[i].from._id === player._id) {
            let toPush = [];

            toPush.push(chat[i].text);
            while (i + 1 < chat.length && chat[i + 1].from._id === player._id) {
                i++;
                toPush.push(chat[i].text);
            }
            toDisplay.push(<MeMessage key={i} text={toPush} player={player}/>);
        } else {
            let toPush = [];
            let tmpId = chat[i].from._id;

            toPush.push(chat[i].text);
            while (i + 1 < chat.length && chat[i + 1].from !== 'System' && chat[i + 1].from._id === tmpId) {
                i++;
                toPush.push(chat[i].text);
            }
            toDisplay.push(<OthersMessage key={i} text={toPush} player={chat[i].from}/>);
        }
    }
    return toDisplay;
}

const Chat = () => {
    const {player, room : {_chat} } = useSelector((state) => state); //useless for now
    const initialState = {message: '',};
    const {register, handleSubmit, reset} = useForm({
        defaultValues: initialState
    });
    const messagesEndRef = useRef(null);

    const dispatch = useDispatch();

    const handleForm = (data) => {
        if (data.message.trim() === '') return false;

        dispatch(sendChat({from: player, text: data.message}));
        reset(initialState);
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && !event.ctrlKey && !event.altKey) {
            handleSubmit(handleForm)();
            event.preventDefault();
            return false;
        } else if (event.keyCode === 13 && event.ctrlKey) {
            event.target.value += "\r\n";
            event.target.blur(); //Focus the cursor
            event.target.focus();
            event.preventDefault();
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom();
    }, [_chat]);

    return (
        <section style={{overflow: 'hidden'}} className="h-100 bg-light">

                <div className="w-100 h-100">

                    <div className="d-flex flex-column w-100 h-100" id="chat2">
                        <div className="card-body p-3" data-mdb-perfect-scrollbar="true"
                             style={{position: 'relative', height: '400px', overflowY: 'scroll'}}>
                            {renderChat(player, _chat)}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="card-footer w-100 text-muted justify-content-start align-items-center p-3 border-top messageBar">
                            <form className="d-inline" id="chatMessage" onSubmit={handleSubmit(handleForm)}>
                                <div className="d-flex w-100">
                                    <img src={player._avatar}
                                         alt="avatar 3" style={{width: '45px'}}/>
                                    <textarea className="form-control form-control ms-3 border border"
                                              id="exampleFormControlInput1" rows="1"
                                              placeholder="Aa" style={{resize: 'none'}}
                                              {...register('message')}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button className="btn btn-link" type="submit"><Send style={{width: '1.5rem', height: '1.5rem'}}/></button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

        </section>
    ); //TODO button send
}

export default Chat;