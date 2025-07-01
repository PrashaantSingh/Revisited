import { useNavigate } from "react-router"
import { IoCaretBackCircle } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackSharp } from "react-icons/io5";

export default function BackBtn({className}) {
    const navigate=useNavigate()
    function handleBack(){
        if(window.history.length>=2){
            navigate(-1);
        }else{
            navigate("/")
        }
    }
  return (
    <div className={className}>
      <IoMdArrowRoundBack
        onClick={handleBack}
        className="text-4xl text-amber-500 cursor-pointer"
      />
    </div>
  );
}
