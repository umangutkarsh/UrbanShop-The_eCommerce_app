import bcrypt from 'bcryptjs';


const users = [
   {
      name: 'Admin User',
      email: 'admin@email.com',
      password: bcrypt.hashSync('password', 12),
      isAdmin: true
   },
   {
      name: 'Devi Prasad',
      email: 'deviprasad@email.com',
      password: bcrypt.hashSync('password', 12),
      isAdmin: false
   },
   {
      name: 'Batman',
      email: 'batman@email.com',
      password: bcrypt.hashSync('password', 12),
      isAdmin: false
   }
];

export default users;