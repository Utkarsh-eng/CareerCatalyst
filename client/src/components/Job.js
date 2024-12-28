import moment from "moment";
import React, { useEffect , useState } from 'react';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt} from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useAppContext } from "../context/appContext";
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';



const Job = ({
    _id, 
    position, 
    company,
    jobLocation, createdBy,
    createdAt, 
    jobType, 
    applications}) =>{

const {user,setEditJob, deleteJob , applyForJob , applicant , applicantPromise} = useAppContext();

// const [applicantData, setApplicantData] = useState([]);


// applicant(_id)
// .then(data => {
//     // setApplicantData(data);
//     console.log(data);
// })
// .catch(error => {
//     console.error("Error fetching applicant data:", error);
// });

// const data = applicant(_id)
// console.log("hello" , data);


// applicantPromise(_id).then( data => {
//   console.log(data);
// })

const [applicantData, setApplicantData] = useState([]);

useEffect(() => {
    applicantPromise(_id).then(data => {
        console.log(data);
        setApplicantData(data);
    }).catch(error => {
        console.error("Error fetching applicant data:", error);
    });
}, [_id]);


const hasApplied = applications.includes(user._id);
const isCreator = createdBy.toString() === user._id.toString();
    let date=moment(createdAt)
    date=date.format('MMM Do, YYYY')

    return (
      <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
            <h5>{position}</h5>
    
            <p>{company}</p>
        </div>
        </header>
        <div className="content-center">
            <JobInfo icon={<FaLocationArrow/>} text={jobLocation}/>
            <JobInfo icon={<FaCalendarAlt/>} text={date}/>
            <JobInfo icon={<FaBriefcase/>} text={jobType}/>
            {/* <div className={`status ${status}`}>{status}</div> */}

        </div>
        {/* <div>
          {isCreator &&(
            <div>
            <h3>Applicant Details:</h3>
            {data && data.length > 0? (
        data.map(applicant => (
          <div key={applicant._id}>
            <p>Name: {applicant.name}</p>
            <p>Email: {applicant.email}</p>
            <p>Location: {applicant.location}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>No applicants found.</p>
      )}
          </div>
          )}
        </div> */}

        <div>
            {isCreator && (
                <div className="main-applicant-div">
                    <h3>Applicant Details:</h3>
                    {applicantData && applicantData.length > 0 ? (
                        applicantData.map(applicant => (
                            <div key={applicant._id} className="applicant-detail">
                                <p><b>Name: </b> {applicant.name}</p>
                                <p><b>Email: </b>{applicant.email}</p>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>No applicants found.</p>
                    )}
                </div>
            )}
        </div>

        <footer>
           <div className="actions">
            
           {isCreator && (
          <>
            <Link to='/add-job' className="btn edit-btn" onClick={() => setEditJob(_id)}>
              Edit
            </Link>
            <button type='button' className="btn delete-btn" onClick={() => deleteJob(_id)}>
              Delete
            </button>
          </>
        )}
        <div>
            {!isCreator && (
          <button type='button' className="btn edit-btn" disabled={hasApplied} onClick={() => !hasApplied && applyForJob(_id)}>
            {hasApplied ? 'Applied' : 'Apply'}
          </button>
        )}
             </div> 
           </div> 
        </footer>
      </Wrapper>
    )
}

export default Job