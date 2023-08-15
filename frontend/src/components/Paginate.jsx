import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";


const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
   return (
      pages > 1 && (
         <Pagination>
            {[...Array(pages).keys()].map(currPage => (
               <LinkContainer 
                  key={currPage + 1}
                  to={!isAdmin ? (keyword ? `/search/${keyword}/page/${currPage + 1}` : `/page/${currPage + 1}`) : `/admin/productlist/${currPage + 1}`}
               >
                  <Pagination.Item active={currPage + 1 === page}>{currPage + 1}</Pagination.Item>
               </LinkContainer>
            ))}
         </Pagination>
      )
   )
}

export default Paginate;