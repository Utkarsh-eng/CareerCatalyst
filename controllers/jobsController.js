import Job from '../models/Job.js'
import User from '../models/User.js';
import { StatusCodes } from "http-status-codes";
import { BadRequestError ,NotFoundError, UnAuthenticatedError} from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";

const createJob = async (req, res) => {
  const {position , company} = req.body
  if( !position || !company){
    throw new BadRequestError('Please provide all the values')
  }
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({job})
};

const deleteJob = async (req, res) => {
  const { id: jobId } =req.params 

  const job= await Job.findOne({ _id: jobId})

  if(!job){
    throw new NotFoundError(`no job with id :${jobId}`)
  }
  //checkPermissions(req.user, job.createdBy)

  await job.deleteOne()

  res.status(StatusCodes.OK).json({msg:'Success! job removed'})
  
};

const getAllJobs = async (req, res) => {
  const {status, jobType, sort, search}= req.query

  const queryObject ={
    createdBy:{ $ne: req.user.userId },
  }
  if(status && status!=='all'){
    queryObject.status = status
  }
  if(jobType && jobType!== 'all'){
    queryObject.jobType = jobType
  }
  if(search){
    queryObject.position = { $regex: search, $options: 'i' }
  }
  let result = Job.find(queryObject)
  if(sort==='latest'){
    result = result.sort('-createdAt')
  }
  if(sort==='oldest'){
    result = result.sort('createdAt')
  }
  if(sort=='a-z'){
    result = result.sort('position')
  }
  if(sort=='z-a'){
    result = result.sort('-position')
  }
  const jobs= await result
  // const jobs = await Job.find({createdBy:{ $ne: req.user.userId }})
  res.status(StatusCodes.OK).json({jobs , totalJobs : jobs.length ,numOfPages: 1})
};

const getMyJobs = async (req, res) => {
  const jobs = await Job.find({createdBy: req.user.userId })
  res.status(StatusCodes.OK).json({jobs , totalJobs : jobs.length ,numOfPages: 1})
};

const applyForJob = async (req, res) => {
  const { id:jobId } = req.params; // Assuming the job ID is passed as a URL parameter
  const userId = req.user.userId; // Assuming you have middleware that adds the authenticated user's ID to req.user
  const me = await User.findById(userId);
  console.log(me);

  try {
    // First, check if the user has already applied for the job
    const job = await Job.findById({_id:jobId});
    if(!job){
      throw new NotFoundError(`no job with id :${jobId}`)
    }

    // const hasAlreadyApplied = job.applications.some(application => application.equals(userId));
    // if (hasAlreadyApplied) {
    //   return res.status(400).json({ message: 'You have already applied for this job' });
    // }
   

    // Add the user's ID to the applications array
    job.applications.push(userId);
    await job.save();

    res.status(200).json({ message: 'Application successful' ,job:job});
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Failed to apply for job' });
  }
};

const getApplicants = async (req, res) => {
  try {
    const { id:jobId } = req.params;
    // console.log('req.params' , req.params , "id:jobId" , jobId);
    const job = await Job.findById({_id:jobId}).populate({
      path: 'applications',
      select: 'name email location', // Select the fields you want to include
      model: User
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error in geeting Applicants', error });
  }
};

const updateJob = async (req, res) => {
  const {id:jobId }= req.params
  const {company, position}= req.body
  if( !position || !company){
    throw new BadRequestError('Please provide all the values')
  }
  const job= await Job.findOne({ _id: jobId})

  if(!job){
    throw new NotFoundError(`no job with id :${jobId}`)
  }

 //check permissions
//  console.log(typeof req.user.userId)
//  console.log(typeof job.createdBy)

 //checkPermissions(req.user, job.createdBy)
 
 const updatedJob= await Job.findOneAndUpdate({ _id: jobId}, req.body, 
  {
    new:true, 
    runValidators:true
  })




  res.status(StatusCodes.OK).json({job:updatedJob})
};

const showStats = (req, res) => {
  res.send("Show Stats");
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats,getMyJobs,applyForJob,getApplicants };
