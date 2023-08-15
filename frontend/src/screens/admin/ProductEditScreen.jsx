import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { 
   useUpdateProductMutation, 
   useGetProductDetailsQuery, 
   useUploadProductImageMutation 
} from '../../slices/productsApiSlice';


const ProductEditScreen = () => {

   const { id: productId } = useParams();

   const [name, setName] = useState('');
   const [price, setPrice] = useState(0);
   const [image, setImage] = useState('');
   const [brand, setBrand] = useState('');
   const [category, setCategory] = useState('');
   const [countInStock, setCountInStock] = useState(0);
   const [description, setDescription] = useState('');

   const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
   // console.log(product);

   const [updateProduct, { isLoading: updateLoading }] = useUpdateProductMutation();

   const [uploadProductImage, { isLoading: uploadLoading }] = useUploadProductImageMutation();

   const navigate = useNavigate();


   useEffect(() => {
      if (product) {
         setName(product.name);
         setPrice(product.price);
         setImage(product.image);
         setBrand(product.brand);
         setCategory(product.category);
         setCountInStock(product.countInStock);
         setDescription(product.description);
      }
   }, [product]);

   const formSubmitHandler = async event => {
      event.preventDefault();

      const updatedProduct = {
         productId,
         name,
         price,
         image,
         brand,
         category,
         countInStock,
         description
      };

      const result = await updateProduct(updatedProduct);

      if (result.error) {
         toast.error(result.error);
      }

      else {
         toast.success('Product updated successfully');
         refetch();
         navigate('/admin/productlist');
      }

   };

   const uploadFileHandler = async event => {
      // console.log(event.target.files[0]);

      const formData = new FormData();
      formData.append('image', event.target.files[0]);

      try {
         const responseData = await uploadProductImage(formData).unwrap();
         toast.success(responseData.message);
         setImage(responseData.image); 
      } catch (err) {
         toast.error(err?.data?.message || err.error);
      }
   };


   return (
      <>
         <Link to='/admin/productlist' className='btn btn-light my-3'>
            Go Back
         </Link>

         <FormContainer>
            <h1>Edit Product</h1>
            {updateLoading && <Loader />}

            {isLoading ? <Loader /> : (
               error ? (
                  <Message variant='danger'>{error.data.message}</Message>
               ) : (
                  <Form onSubmit={formSubmitHandler}>
                     <Form.Group controlId='name' className='my-2'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                           type='text'
                           placeholder='Enter Name'
                           value={name}
                           onChange={event => setName(event.target.value)} 
                        />
                     </Form.Group>

                     <Form.Group controlId='price' className='my-2'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control 
                           type='number'
                           placeholder='Enter Price'
                           value={price}
                           onChange={event => setPrice(event.target.value)} 
                        />
                     </Form.Group>

                     <Form.Group controlId='image' className='my-2'>
                        <Form.Label>Image</Form.Label>
                        <Form.Control 
                           type='text' 
                           placeholder='Enter image URL' 
                           value={image}
                           onChange={event => setImage}
                        />
                        <Form.Control 
                           type='file'
                           label='Choose an image'
                           onChange={uploadFileHandler}
                        />
                     </Form.Group>
                     {uploadLoading && <Loader />}

                     <Form.Group controlId='brand' className='my-2'>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control 
                           type='text'
                           placeholder='Enter Brand'
                           value={brand}
                           onChange={event => setBrand(event.target.value)} 
                        />
                     </Form.Group>

                     <Form.Group controlId='category' className='my-2'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control 
                           type='text'
                           placeholder='Enter Category'
                           value={category}
                           onChange={event => setCategory(event.target.value)} 
                        />
                     </Form.Group>

                     <Form.Group controlId='countInStock' className='my-2'>
                        <Form.Label>Count in Stock</Form.Label>
                        <Form.Control 
                           type='number'
                           placeholder='Enter count in stock'
                           value={countInStock}
                           onChange={event => setCountInStock(event.target.value)} 
                        />
                     </Form.Group>

                     <Form.Group controlId='description' className='my-2'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                           type='text'
                           placeholder='Enter Description'
                           value={description}
                           onChange={event => setDescription(event.target.value)} 
                        />
                     </Form.Group>

                     <Button type='submit' variant='primary' className='my-2'>
                        Update
                     </Button>
                  </Form>
               )
            )}
         </FormContainer>
      </>
   )
}

export default ProductEditScreen;