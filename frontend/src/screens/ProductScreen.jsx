import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Form, Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productsApiSlice";
import { addToCart } from "../slices/cartSlice";


const ProductScreen = () => {

   const { id: productId } = useParams();

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [qty, setQty] = useState(1);
   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState(''); 
   
   const { data: product, refetch, isLoading, error } = useGetProductDetailsQuery(productId);

   const [createReview, { isLoading: productReviewLoading }] = useCreateReviewMutation();

   const { userInfo } = useSelector(state => state.auth);


   const addToCartHandler = () => {
      dispatch(addToCart({ ...product, qty }));
      navigate('/cart'); 
   };

   const formSubmitHandler = async event => {
      event.preventDefault();

      try {
         await createReview({ productId, rating, comment }).unwrap();
         refetch();
         toast.success('Review Submitted');
         setRating(0);
         setComment('');
      } catch (err) {
         toast.error(err?.data?.message || err.error);
      }
   };

   return (
      <>
         <Link className="btn btn-light my-3" to="/">Go Back</Link>
         {isLoading ? (
            <Loader />
         ) : (
            error ? (
               <Message variant='danger'>
                  { error?.data?.message || error.error }
               </Message>
            ) : (
               <>
                  <Meta title={product.name} description={product.description} />
                  <Row>
                     <Col md={5}>
                        <Image src={product.image} alt={product.name} fluid />
                     </Col>
                     <Col md={4}>
                        <ListGroup variant="flush">
                           <ListGroup.Item>
                              <h3>{product.name}</h3>
                           </ListGroup.Item>
                           <ListGroup.Item>
                              <Rating value={product.rating} text={`${product.numReviews} ${product.numReviews === 1 ? 'review' : 'reviews'}`} />
                           </ListGroup.Item>
                           <ListGroup.Item><b>Price:</b> ${product.price}</ListGroup.Item>
                           <ListGroup.Item><b>Description:</b> {product.description}</ListGroup.Item>
                        </ListGroup>
                     </Col>
                     <Col md={3}>
                        <Card>
                           <ListGroup variant="flush">
                              <ListGroup.Item>
                                 <Row>
                                    <Col>Price:</Col>
                                    <Col>
                                       <strong>${product.price}</strong>
                                    </Col>
                                 </Row>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                 <Row>
                                    <Col>Status:</Col>
                                    <Col>
                                       <strong>
                                          {product.countInStock ? 'In Stock' : 'Out of Stock'}
                                       </strong>
                                    </Col>
                                 </Row>
                              </ListGroup.Item>
                              {product.countInStock && (
                                 <ListGroup.Item>
                                    <Row>
                                       <Col>Quantity:</Col>
                                       <Col>
                                          <Form.Control 
                                             as='select' 
                                             value={qty} 
                                             onChange={(event) => setQty(Number(event.target.value))}
                                          >
                                             {[...Array(product.countInStock).keys()].map(idx => (
                                                <option key={idx + 1} value={idx + 1}>
                                                   {idx + 1}
                                                </option>
                                             ))}
                                          </Form.Control>
                                       </Col>
                                    </Row>
                                 </ListGroup.Item>
                              )}
                              <ListGroup.Item className="center">
                                 <Button 
                                    className="btn-block" 
                                    type="button" 
                                    disabled={product.countInStock === 0}
                                    onClick={addToCartHandler}
                                 >
                                    Add To Cart
                                 </Button>
                              </ListGroup.Item>
                           </ListGroup>
                        </Card>
                     </Col>
                  </Row>
                  <Row className="review">
                     <Col md={5}>
                        <h2>Reviews</h2>
                        {product.reviews.length === 0 && <Message>No Reviews</Message>}
                        <ListGroup variant="flush">
                           {product.reviews.map(review => (
                              <ListGroup.Item key={review._id}>
                                 <strong>{review.name}</strong>
                                 <Rating value={review.rating} />
                                 <p>{review.createdAt.substring(0, 10)}</p>
                                 <p>{review.comment}</p>
                              </ListGroup.Item>
                           ))}
                           <ListGroup.Item>
                              <h2>Write a Customer Review</h2>
                              
                              {productReviewLoading && <Loader />}
                              {userInfo ? (
                                 <Form onSubmit={formSubmitHandler}>
                                    <Form.Group controlId="rating" className="my-2">
                                       <Form.Label>Rating</Form.Label>
                                       <Form.Control
                                          as="select"
                                          value={rating}
                                          onChange={event => setRating(Number(event.target.value))}
                                       >
                                          <option value=''>Select</option>
                                          <option value='1'>1 - Poor</option>
                                          <option value='2'>2 - Fair</option>
                                          <option value='3'>3 - Good</option>
                                          <option value='4'>4 - Very Good</option>
                                          <option value='5'>5 - Excellent</option>
                                       </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="comment" className="my-2">
                                       <Form.Label>Comment</Form.Label>
                                       <Form.Control
                                          as="textarea"
                                          rows='3'
                                          placeholder="Write a comment"
                                          value={comment}
                                          onChange={event => setComment(event.target.value)}
                                       />
                                    </Form.Group>

                                    <Button 
                                       disabled={productReviewLoading}
                                       type="submit"
                                       variant="primary"
                                    >
                                       Submit Review
                                    </Button>
                                 </Form>
                              ) : (
                                 <Message>
                                    Please <Link to='/auth'>sign in</Link> to write a review
                                 </Message>
                              )}
                           </ListGroup.Item>
                        </ListGroup>
                     </Col>
                  </Row>  
               </>
            )
         )}
      </>
   );
};

export default ProductScreen;