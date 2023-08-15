import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';


const UserEditScreen = () => {

   const { id: userId } = useParams();

   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [isAdmin, setIsAdmin] = useState(false);
   

   const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId);
   // console.log(user);

   const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();

   const navigate = useNavigate();


   useEffect(() => {
      if (user) {
         setName(user.name);
         setEmail(user.email);
         setIsAdmin(user.isAdmin);
      }
   }, [user]);

   const formSubmitHandler = async event => {
      event.preventDefault();

      try {
         await updateUser({ userId, name, email, isAdmin });
         toast.success('User updated successfully');
         refetch();
         navigate('/admin/userlist');
      } catch (err) {
         toast.error(err?.data?.message || err.error);
      }

   };

   


   return (
      <>
         <Link to='/admin/userlist' className='btn btn-light my-3'>
            Go Back
         </Link>

         <FormContainer>
            <h1>Edit User</h1>
            {updateLoading && <Loader />}

            {isLoading ? <Loader /> : (
               error ? (
                  <Message variant='danger'>{error}</Message>
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

                     <Form.Group controlId='email' className='my-2'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control 
                           type='email'
                           placeholder='Enter your Email'
                           value={email}
                           onChange={event => setEmail(event.target.value)} 
                        />
                     </Form.Group>

                     <Form.Group controlId='isAdmin' className='my-2'>
                        <Form.Check
                           type='checkbox'
                           label='Is Admin'
                           checked={isAdmin}
                           onChange={event => setIsAdmin(event.target.checked)}
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

export default UserEditScreen;