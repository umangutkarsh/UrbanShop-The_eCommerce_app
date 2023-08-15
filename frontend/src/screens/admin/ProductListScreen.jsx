import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import { 
   useGetProductsQuery, 
   useCreateProductMutation, 
   useDeleteProductMutation 
} from "../../slices/productsApiSlice";

const ProductListScreen = () => {

   const { pageNumber } = useParams();
   const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });
   // console.log(products);

   const [createProduct, { isLoading: createLoading }] = useCreateProductMutation();

   const [deleteProduct, { isLoading: deleteLoading }] = useDeleteProductMutation();

   const deleteProductHandler = async id => {
      // console.log('delete', id);

      if (window.confirm('Are you sure you want to delete the product?')) {

         try {
            await deleteProduct(id);
            toast.success('Product deleted');
            refetch();
         } catch (err) {
            toast.error(err?.data?.message || err.error); 
         }
      }
   };

   const createProductHandler = async () => {

      if (window.confirm('Are you sure you want to create a product?')) {

         try {
            await createProduct();
            refetch();
         } catch (err) {
            toast.error(err?.data?.message || err.error);
         }
      }
   };


   return (
      <>
         <Row className="align-items-center">
            <Col>
               <h1>Products</h1>
            </Col>
            <Col className="text-end">
               <Button className="btn-sm m-3" onClick={createProductHandler}>
                  <FaPlus /> Create Product
               </Button>
            </Col>
         </Row>

         {createLoading && <Loader />}
         {deleteLoading && <Loader />}

         {isLoading ? <Loader /> : (
            error ? (
               <Message variant="danger">{error.data.message}</Message>
            ) : (
               <>
                  <Table striped="true" hover responsive className="table-sm">
                     <thead>
                        <tr>
                           <th>ID</th>
                           <th>NAME</th>
                           <th>PRICE</th>
                           <th>CATEGORY</th>
                           <th>BRAND</th>
                           <th></th>
                        </tr>
                     </thead>
                     <tbody>
                        {data.products.map(product => (
                           <tr key={product._id}>
                              <td>{product._id}</td>
                              <td>{product.name}</td>
                              <td>${product.price}</td>
                              <td>{product.category}</td>
                              <td>{product.brand}</td>
                              <td>
                                 <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                    <Button variant="light" className="btn-sm mx-2" >
                                       <FaEdit />
                                    </Button>
                                 </LinkContainer>
                                 <Button 
                                    variant="danger" 
                                    className="btn-sm" 
                                    onClick={() => deleteProductHandler(product._id)}
                                 >
                                    <FaTrash style={{ color: 'white' }} />
                                 </Button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </Table>
                  <Paginate pages={data.pages} page={data.page} isAdmin={true} />
               </>
            )
         )}
      </>
   );
}

export default ProductListScreen;