import {FormRow , FormRowSelect} from '.';
import {useAppContext} from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';
const SearchContainer = () =>{
    const {isLoading,
        search,
        sort,
        sortOptions,
        handleChange,
        clearFilters,
        }=useAppContext()
        const handleSearch= (e)=>{
            if(isLoading)
            return;
            handleChange({name:e.target.name,value:e.target.value})
        }
        const handleSubmit=(e)=>{
            e.preventDefault()
        }
    return (
       <Wrapper>
        <form className='form'>
            <h4>Search Jobs</h4>
            <div className='form-center'>
            {/* search position */}
                <FormRow
                type='text'
                name='search'
                value={search}
                handleChange={handleSearch}>
                </FormRow>

                <FormRowSelect
                name='sort'
                value={sort}
                handleChange={handleSearch}
                list={sortOptions} />
            </div>
            <button className='btn btn-bloack btn-danger'
             disabled={isLoading}
             onClick={handleSubmit}
             >
             Clear </button>
        </form>
       </Wrapper>
    )
}

export default SearchContainer