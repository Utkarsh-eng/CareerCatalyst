import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { FiAward } from "react-icons/fi";


const links = [
  { id: 1, text: "Welcome", path: "/", icon: <FiAward /> },
  { id: 2, text: "all jobs", path: "/all-jobs", icon: <MdQueryStats /> },
  { id: 3, text: "add job", path: "/add-job", icon: <FaWpforms /> },
  { id: 4, text: "profile", path: "/profile", icon: <ImProfile /> },

];

export default links;
