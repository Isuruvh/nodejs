const users = [
  {
    username: 'jessie.smith@example.com',
    password: 'password1',
  },
  {
    username: 'kim.sato@example.com',
    password: 'password2',
  },
    {
    username: 'rajiv.tal@example.com',
    password: 'password3',
  },
]

function validate(username, password) {
  return users.some(user => user.username === username && user.password === password);
}

exports.validate = validate;
