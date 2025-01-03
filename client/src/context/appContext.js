import React, { useReducer, useContext } from "react";
import axios from "axios";
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  GET_APPLICANT_BEGIN,
  GET_APPLICANT_SUCCESS,
  CLEAR_FILTERS,
} from "./actions";
import reducer from "./reducer";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const userLocation = localStorage.getItem("location");

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || "",
  showSidebar: false,
  isEditing : false,
  editJobId:"",
  position:"",
  company:"",
  jobLocation: userLocation || "",
  jobTypeOptions:['full-time' , 'part-time' , 'remote' , 'internship'],
  jobtype: 'full-time',
  statusOptions: ['interview' , 'declined' , 'pending'] ,
  status:'pending',
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  search:'',
  searchStatus:'all',
  searchType:'all',
  sort:'latest',
  sortOptions:['latest' , 'oldest' , 'a-z' , 'z-a'],
};
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //axios
  const authFetch = axios.create({
    baseURL: '/api/v1',
  })

  //request
  authFetch.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${state.token}`
    return config
  } , (error)=>{
    return Promise.reject(error)
  })

  //response
  authFetch.interceptors.response.use((response) => {
    return response
  } , 
  (error)=>{
    if(error.response.status === 401 ){
      logoutUser()
    }
    return Promise.reject(error)
  })

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };
  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };
  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("location");
  };

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post("http://localhost:3000/register/api/v1/auth/register", currentUser);
      // console.log(response);
      const { user, token, location } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, token, location },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      // console.log(error.response);
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const { data } = await axios.post("http://localhost:3000/register/api/v1/auth/login", currentUser);
      // console.log(response);
      const { user, token, location } = data;
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, token, location },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      // console.log(error.response);
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );
      // console.log(response);
      const { user, token, location } = data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, token, location, alertText },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      // console.log(error.response);
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const updateUser = async (currentUser)=>{
    dispatch({type: UPDATE_USER_BEGIN})
    try{
      const {data} = await authFetch.patch('/auth/updateUser' , currentUser)
      const {user , location , token} = data
      dispatch({type: UPDATE_USER_SUCCESS , payload:{user , location , token}})
      addUserToLocalStorage({user , location , token})
    }
    catch(error){
      if(error.response.status !== 401){
        dispatch({type: UPDATE_USER_ERROR , payload:{msg: error.response.data.msg}})
      }
    }
    clearAlert()
  }

  const handleChange = ({name , value})=>{
    dispatch({type:HANDLE_CHANGE , payload:{name , value}})
  }

  const clearValues = () =>{
    dispatch({type: CLEAR_VALUES})
  }

  const createJob = async() =>{
    dispatch({type:CREATE_JOB_BEGIN})
    try{
      const {position , company , jobLocation , jobtype , status} = state
      await authFetch.post('/jobs' , {
        position, 
        company, 
        jobLocation, 
        jobtype, 
        status,
      })
      dispatch({type:CREATE_JOB_SUCCESS})
      dispatch({type:CLEAR_VALUES})
      window.location.reload();
    }
    catch(error){
      if(error.response.status===401) return
      dispatch({
        type: CREATE_JOB_ERROR,
        payload:{msg:error.response.data.msg},
      })
    }
    clearAlert()
  }

  const getJobs = async () =>{
    const {search,searchStatus,searchType,sort}=state
    let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}`
    if(search){
      url = url +`&search=${search}`
    }
    dispatch({type:GET_JOBS_BEGIN})
    try{
      const {data} = await authFetch(url);
      // console.log("shubhi" ,data);
      const {jobs , totalJobs , numOfPages} = data ;
      dispatch({
        type:GET_JOBS_SUCCESS,
        payload:{
          jobs,
          totalJobs,
          numOfPages,
        }
      })
    }
    catch(error){
      console.log(error.response)
    }
    clearAlert();
  }

  const applicant=  async (jobId) =>{
    let url=`/jobs/applicant/${jobId}`
    try {
      const {data} = await authFetch(url)
      // console.log(data);
      return data.applications;


    } catch (error) {
      console.log(error)
    }
  }

  const applicantPromise = (_id) => {
    return new Promise((resolve, reject) => {
      applicant(_id)
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  };
  // const me = applicant(_id)

  const myJobs = async () =>{
    let url = `/jobs/myJobs`
    dispatch({type:GET_JOBS_BEGIN})
    try{
      const {data} = await authFetch(url);
      const {jobs , totalJobs , numOfPages} = data ;
      dispatch({
        type:GET_JOBS_SUCCESS,
        payload:{
          jobs,
          totalJobs,
          numOfPages,
        }
      })
    }
    catch(error){
      console.log(error.response)
    }
    clearAlert();
  }
  const applyForJob = async (jobId) => {
    try {
      await authFetch.post(`/jobs/${jobId}`);
      dispatch({ type: 'SET_HAS_APPLIED', payload: true });
      // If you need to trigger a re-render or navigate to another route after applying:
      window.location.reload();
      //setHasApplied(true); // Assume application was successful
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  };
  const setEditJob =(id) =>{
    dispatch({type:SET_EDIT_JOB, payload: { id }});
  }
  const editJob=async()=>{
    dispatch({type:EDIT_JOB_BEGIN})
    try {
      const {position,company, jobLocation,jobType,status}= state
      await authFetch.patch(`/jobs/${state.editJobId}` , {
        position,
        company,
        jobLocation,
        jobType,
        status,
      })
      dispatch({ type:EDIT_JOB_SUCCESS })
     dispatch({type:CLEAR_VALUES})
    } catch (error) {
      if(error.response.status === 401) return ;
        dispatch({type:EDIT_JOB_ERROR , payload:{msg:error.response.data.msg}})
      
    }
    clearAlert()
  }
  const deleteJob = async (jobId) =>{
    dispatch({ type:DELETE_JOB_BEGIN})
    try{
      await authFetch.delete(`/jobs/${jobId}`)
      window.location.reload();
    }catch(error){
      console.log(error.response)
      //logout
    }
  }
  const clearFilters = () =>{
   dispatch({type : CLEAR_FILTERS})
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        myJobs,
        applyForJob,
        applicant,
        applicantPromise,
        clearFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState };
