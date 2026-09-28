import Modal  from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../../contexts/OrderContext";
import { toast } from "react-toastify";


function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        [action.ticket] : state[action.ticket] + 1 
      };

    case "decrement":
      return {
        ...state,
        [action.ticket]: Math.max(0, state[action.ticket] - 1)
      };

    default:
      return state;
  }
}



function TicketReserve(props){
  const navigate = useNavigate()
  const { addToOrder } = useOrder()

  const [state, dispatch] = useReducer(reducer, {adult: 0 , kids: 0});

  const adultTotal = state.adult * props.price;
  const kidsTotal = state.kids * props.price * 0.5;

  const total = (adultTotal + kidsTotal).toFixed(2);
  const tickets = ["adult", "kids"]

  const handleProceed = () => {
    if (state.adult === 0 && state.kids === 0) {
      toast.info('Please select at least one ticket')
      return
    }

    addToOrder({
      place: props.place,
      tickets: {
        adult: state.adult,
        kids: state.kids,
      },
      pricing: {
        pricePerAdult: props.price,
        pricePerKid: props.price * 0.5,
        adultTotal,
        kidsTotal,
        total,
      }
    })

    props.onHide()
    navigate('/order')
  }

return (


<>


  <Modal
    {...props}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >

  <Modal.Header closeButton>
    <Modal.Title id="contained-modal-title-vcenter">
      Ticket Reserve
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>
    

    {tickets.map((type) => (
  <div key={type} className="d-flex  align-items-center gap-2 mt-2">

    <h4 className="mb-0" style={{width: "154px"}}>{type} ticket</h4>
    
    <div className="d-flex justify-content-between align-items-center gap-2">
    <Button
      size="sm"
      variant="outline-success"
      onClick={() => dispatch({ type: "increment", ticket: type })}
    >
      +
    </Button>

    <span className="px-2  py-1 rounded border btn btn-success border d-inline-block"
      style={{width: "40px"}}>
      {state[type]}
    </span>

    <Button
      size="sm"
      variant="outline-danger"
      disabled={state[type] === 0}
      onClick={() => dispatch({ type: "decrement", ticket: type })}
    >
      -
    </Button>


  </div>
    </div>

))}
    <hr />
  <div className="d-flex flex-column align-items-start gap-2">

  <strong className="fs-5">Total: ${total}</strong>
  <Button variant="success" className="d-inline" onClick={handleProceed}>
    Proceed to Order
  </Button>

  </div>
  </Modal.Body>

    <hr />

    <div className="d-flex gap-2 align-items-center">
      <strong className="align-items-center fs-4">Note</strong>
      <p className="m-0"><strong>Adult</strong> ticket 18+ ,</p>
      <p className="m-0"><strong>Kids</strong> ticket 17 or younger</p>
    </div>

</Modal>



</>
    
)
}export default TicketReserve;