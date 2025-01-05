import { useAppContext } from "../context/appContext"
import {useEffect} from "react"
import Loading from "./Loading"
import Job from "./Job"
import Wrapper from "../assets/wrappers/JobsContainer"


const MyJobsContainer = () =>{

    const {myJobs , jobs , isLoading , page , totalJobs } = useAppContext();

    useEffect(() =>{
        myJobs()
    },[])
    if(isLoading){
        return <Loading center/>
    }

    if( jobs.length  === 0){
        return <Wrapper>
            <h1>No jobs to display...</h1>
        </Wrapper>
    }
    return (
        <Wrapper>
            <h5 className="num-job-heading">{totalJobs} {jobs.length == 1 &&'job'}  {jobs.length > 1 &&'jobs'}</h5>
            <div className="jobs">
                {
                    jobs.map((job) => {
                        return <Job key = {job._id}{...job}/>
                    })
                }
            </div>    
        </Wrapper>
    )
}

export default MyJobsContainer;