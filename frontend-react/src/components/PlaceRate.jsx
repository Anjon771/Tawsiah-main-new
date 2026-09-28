

// icons
import { FaStar } from "react-icons/fa";


function PlaceRate({rate}){

        var bg;
        var textColor = "white";
    
        switch(rate){
            case 1:
            case 2:
                bg = "red";
                break;
            case 3:
                bg = "yellow";
                textColor = "black";
                break;
            case 4:
            case 5:
                bg = "green";
                break;
            default:
                bg = "gray";
                break;
        }

    return (
            <>
        <div style={
            {border: `${bg} 1px solid`, 
            background: `${bg}`, 
            color: `${textColor}`}}
            className="d-inline p-2 rounded">{rate}
        </div>

        <span className="ms-2">
        {[...Array(5)].map((_, i) => (
          <FaStar
            size={18}
            key={i}
            color={i < rate ? "gold" : "#ddd"}
          />
        ))}
      </span>
        </>
    )
    


}export default PlaceRate;