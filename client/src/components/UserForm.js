import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import axios from "axios";
import { withFormik, Form, Field } from "formik";

function UserForm({ values, errors, touched, status }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [status]);

  return (
    <div>
      <Form>
        <div>
          {touched.name && errors.name && <p>{errors.name}</p>}
          <Field type="text" name="name" placeholder="Name" />
        </div>
        <div>
          {touched.email && errors.email && <p>{errors.email}</p>}
          <Field type="email" name="email" placeholder="Email" />
        </div>
        <div>
          {touched.password && errors.password && <p>{errors.password}</p>}
          <Field type="password" name="password" placeholder="Password" />
        </div>
        <label htmlFor="tos">
          <Field type="checkbox" name="tos" checked={values.tos} />
          Accept TOS
        </label>

        <button type="submit">Submit</button>
      </Form>

      {users.map(user => (
        <ul key={user.id}>
          <li>Name: {user.name} </li>
          <li>Email: {user.email}</li>
        </ul>
      ))}
    </div>
  );
}

const FormikUserForm = withFormik({
  mapPropsToValues({ name, email, password, tos }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      tos: tos || false
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string(),
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be 6 characters or longer")
      .required("Password is required")
  }),
  handleSubmit(values, { setStatus }) {
    axios
      .post("https://reqres.in/api/users", values)
      .then(res => {
        console.log(res);

        setStatus(res.data);
      })
      .catch(err => {
        console.log(err);
        // setStatus(false);
      });
  }
})(UserForm);
export default FormikUserForm;
