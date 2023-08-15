import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { 
   useGetOrderDetailsQuery, 
   usePayOrderMutation, 
   useGetPayPalClientIdQuery,
   useDeliverOrderMutation
} from '../slices/ordersApiSlice';


const OrderScreen = () => {

   const { id: orderId } = useParams();

   const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

   const [payOrder, { isLoading: payLoading }] = usePayOrderMutation();

   const [deliverOrder, { isLoading: deliverLoading }] = useDeliverOrderMutation();
   
   const { userInfo } = useSelector(state => state.auth);

   const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

   const { data: paypal, isLoading: payPalLoading, error: payPalError } = useGetPayPalClientIdQuery();


   useEffect(() => {
      if (!payPalError && !payPalLoading && paypal.clientId) {

         const loadPayPalScript = async () => {
            paypalDispatch({
               type: 'resetOptions',
               value: {
                  'clientId': paypal.clientId,
                  currency: 'USD',
               }
            });
            paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
         };
         
         if (order && !order.isPaid) {
            if (!window.paypal) {
               loadPayPalScript();
            }
         }
      }
   }, [order, paypal, paypalDispatch, payPalLoading, payPalError]);


   const onApproveHandler = async (data, actions) => {
      return actions.order.capture().then(async function (details) {

         try {
            await payOrder({ orderId, details });
            refetch();
            toast.success('Payment susccessful');
         } catch (err) {
            toast.error(err?.data?.message || err.message);
         }
      });
   };

   // const onApproveTest = async () => {
   //    await payOrder({ orderId, details: { payer: {} } });
   //    refetch();
   //    toast.success('Payment successful');
   // };

   const onErrorHandler = err => {
      toast.error(err.message);
   }; 

   const createOrderHandler = (data, actions) => {
      return actions.order.create({
         purchase_units: [
            {
               amount: { value: order.totalPrice },
            },
         ],
      }).then((orderId) => {
         return orderId;
      });
   };

   const deliverOrderHandler = async () => {

      try {
         await deliverOrder(orderId);
         refetch();
         toast.success('Order delivered successfully');
      } catch (err) {
         toast.error(err?.data?.message || err.message);
      }
   };


   return (
      isLoading ? (<Loader />) : (error ? (
         <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
         <>
            <h1>Order: {order._id}</h1>
            <Row>
               <Col md={8}>
                  <ListGroup variant='flush'>

                     <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                           <strong>Name: </strong>
                           {order.user.name}
                        </p>
                        <p>
                           <strong>Email: </strong>
                           {order.user.email}
                        </p>
                        <p>
                           <strong>Address: </strong>
                           {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                           <Message variant='success'>
                              Delivered on {order.deliveredAt}
                           </Message>
                        ) : (
                           <Message variant='danger'>Not Delivered</Message>
                        )}
                     </ListGroup.Item>

                     <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                           <strong>Method: </strong>
                           {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                           <Message variant='success'>
                              Paid on {order.paidAt}
                           </Message>
                        ) : (
                           <Message variant='danger'>Not Paid</Message>
                        )}
                     </ListGroup.Item>

                     <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? (
                           <Message>Order is empty</Message>
                        ) : (
                           <ListGroup variant='flush'>
                              {order.orderItems.map((item, index) => (
                                 <ListGroup.Item key={index}>
                                    <Row>
                                       <Col md={1}>
                                          <Image src={item.image} alt={item.name} fluid rounded />
                                       </Col>
                                       <Col>
                                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                                       </Col>
                                       <Col md={4}>
                                          {item.qty} x ${item.price} = ${item.qty * item.price}
                                       </Col>
                                    </Row>
                                 </ListGroup.Item>
                              ))}
                           </ListGroup>
                        )}
                     </ListGroup.Item>

                  </ListGroup>
               </Col>
               <Col md={4}>
                  <Card>
                     <ListGroup variant='flush'>
                        <ListGroup.Item>
                           <h2>Order Summary</h2>
                        </ListGroup.Item>

                        <ListGroup.Item>
                           <Row>
                              <Col>Items: </Col>
                              <Col>${order.itemsPrice}</Col>
                           </Row>

                           <Row>
                              <Col>Shipping: </Col>
                              <Col>${order.shippingPrice}</Col>
                           </Row>

                           <Row>
                              <Col>Tax: </Col>
                              <Col>${order.taxPrice}</Col>
                           </Row>

                           <Row>
                              <Col>Total: </Col>
                              <Col>${order.totalPrice}</Col>
                           </Row>
                        </ListGroup.Item>

                        {!userInfo.isAdmin && !order.isPaid && (
                           <ListGroup.Item>
                              {payLoading && <Loader />}
                              {isPending ? (<Loader />) : (
                                 <div className='center'>
                                    {/* <Button onClick={onApproveTest} style={{ marginBottom: '10px' }}>
                                       Test Pay Order
                                    </Button> */}
                                    <div>
                                       <PayPalButtons
                                          createOrder={createOrderHandler}
                                          onApprove={onApproveHandler}
                                          onError={onErrorHandler}
                                       />
                                    </div>
                                 </div>
                              )}
                           </ListGroup.Item>
                        )}
                        
                        {deliverLoading && (<Loader />)}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                           <ListGroup.Item>
                              <div className='center'>
                                 <Button 
                                    type='submit' 
                                    className='btn btn-block' 
                                    onClick={deliverOrderHandler}
                                 >
                                    Mark As Delivered
                                 </Button>
                              </div>
                           </ListGroup.Item>
                        )}

                     </ListGroup>
                  </Card>
               </Col>
            </Row>
         </>
      ))
   )
}

export default OrderScreen;