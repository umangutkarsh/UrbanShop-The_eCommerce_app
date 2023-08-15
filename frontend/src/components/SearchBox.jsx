import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";


const SearchBox = () => {

   const navigate = useNavigate();
   const { keyword: urlKeyword } = useParams();
   const [keyword, setKeyword] = useState(urlKeyword || '');

   const formSubmitHandler = event => {
      event.preventDefault();

      if (keyword.trim()) {
         navigate(`/search/${keyword}`);
      }

      else {
         navigate(`/`);
      }
      setKeyword('');
   };


   return (
      <Form onSubmit={formSubmitHandler} className='d-flex'>
         <Form.Control
            type="text"
            name='q'
            placeholder="Search Products..."
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            className="mr-sm-2 ml-sm-5"
         />
         <Button type="submit" variant="outline-success" className="p-2 mx-2">
            Search
         </Button>
      </Form>
   )
}

export default SearchBox;