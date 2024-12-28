import styled from 'styled-components'

const Wrapper = styled.section`
  margin-top: 4rem;
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
  }
  .jobs {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    padding : 5px;
    margin : 2px
    
  }
  @media (min-width: 992px) {
    .jobs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin : 2rem;
      // padding : 1rem;
    }
  }
  .num-job-heading{
    // position : absolute;
    // left: 50%;
    margin-left: 2.5rem;
    // background-color : green;
  }
`
export default Wrapper