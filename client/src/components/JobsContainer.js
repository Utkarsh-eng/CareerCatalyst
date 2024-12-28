import { useAppContext } from "../context/appContext"
import {useEffect} from "react"
import Loading from "./Loading"
import Job from "./Job"
import Wrapper from "../assets/wrappers/JobsContainer"


const JobsContainer = () =>{

    const {getJobs , jobs , isLoading , page , totalJobs,search,searchStatus,searchType,sort} = useAppContext();

    useEffect(() =>{
        getJobs()
    },[search,searchStatus,searchType,sort])
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

            {/* pagination buttons */}
            
        </Wrapper>
    )
}

export default JobsContainer