import { useState, useEffect } from "react";
import { Table, Form, Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { FaTimes } from "react-icons/fa";
import { useProfileMutation } from "../slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { setCredentials } from "../slices/authSlice";


const ProfileScreen = () => {

   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   
   const dispatch = useDispatch();

   const { userInfo } = useSelector(state => state.auth);

   const [updateProfile, { isLoading: updateProfileLoading }] = useProfileMutation();

   const { data: orders, isLoading, error } = useGetMyOrdersQuery();


   useEffect(() => {
      if (userInfo) {
         setName(userInfo.name);
         setEmail(userInfo.email);
      }
   }, [userInfo, userInfo.name, userInfo.email]);

   const formSubmitHandler = async event => {
      event.preventDefault();
      
      if (password !== confirmPassword) {
         toast.error('Passwords do not match');
      }
      
      else {

         try {
            const responseData = await updateProfile({ 
               _id: userInfo._id, 
               name, 
               email, 
               password 
            }).unwrap();

            dispatch(setCredentials(responseData));
            toast.success('Profile updated successfully');
         } catch (err) {
            toast.error(err?.data?.message || err.error);
         }
      }
   };


   return (
      <Row>
         <Col md={3}>
            <h2>User Profile </h2>

            <Form onSubmit={formSubmitHandler}>
               <Form.Group controlId="name" className="my-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                     type="text"
                     placeholder="Enter name"
                     value={name}
                     onChange={event => setName(event.target.value)}
                  />
               </Form.Group>

               <Form.Group controlId="email" className="my-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                     type="text"
                     placeholder="Enter email"
                     value={email}
                     onChange={event => setEmail(event.target.value)}
                  />
               </Form.Group>

               <Form.Group controlId="password" className="my-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                     type="text"
                     placeholder="Enter password"
                     value={password}
                     onChange={event => setPassword(event.target.value)}
                  />
               </Form.Group>

               <Form.Group controlId="confirmPassword" className="my-2">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                     type="text"
                     placeholder="Enter password again"
                     value={confirmPassword}
                     onChange={event => setConfirmPassword(event.target.value)}
                  />
               </Form.Group>

               <Button type="submit" variant="primary" className="my-2">
                  Update
               </Button>
               {updateProfileLoading && <Loader />}

            </Form>
         </Col>
         <Col md={9}>
            <h2>My Orders</h2>

            {isLoading ? <Loader /> : (error ? (
               <Message variant='danger'>
                 {error?.data?.message || error.error} 
               </Message>
            ) : (
               <Table striped hover responsive className="table-sm">
                  <thead>
                     <tr>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th></th>
                     </tr>
                  </thead>
                  <tbody>
                     {orders.map(order => (
                        <tr key={order._id}>
                           <td>{order._id}</td>
                           <td>{order.createdAt.substring(0, 10)}</td>
                           <td>{order.totalPrice}</td>
                           <td>
                              {order.isPaid ? (order.paidAt.substring(0, 10)) : (
                                 <FaTimes style={{ color: 'red' }} />
                              )}
                           </td>
                           <td>
                              {order.isDelivered ? (order.deliveredAt.substring(0, 10)) : (
                                 <FaTimes style={{ color: 'red' }} />
                              )}
                           </td>
                           <td>
                              <LinkContainer to={`/order/${order._id}`}>
                                 <Button className="btn-sm" variant="light">
                                    Details
                                 </Button>
                              </LinkContainer>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </Table>
            ))}
         </Col>
      </Row>
   )
}

export default ProfileScreen;