import React, { useRef, useState, useContext } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";

export default function Auth() {
  const [isLogIn, setIsLogIn] = useState(true);
  const authContext = useContext(AuthContext);

  const emailEl = useRef();
  const passwordEl = useRef();

  const switchModeHandler = () => {
    setIsLogIn((prev) => !prev);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
            query Login($email: String!, $password: String!){
                login(email: $email,password: $password){
                    userId
                    token
                    tokenExpiration
                }
        }
    `,
      variables: {
        email: email,
        password: password,
      },
    };

    if (!isLogIn) {
      requestBody = {
        query: `
                mutation CreateUser($email: String!, $password: String!){
                    createUser(userInput: {
                        email: $email
                        password: $password
                      }){
                        _id
                        email
                      }
                }
            `,
        variables: {
          email: email,
          password: password,
        },
      };
    }

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }
      const resData = await response.json();
      if (resData.data.login.token) {
        authContext.login(
          resData.data.login.token,
          resData.data.login.userId,
          resData.data.login.tokenExpiration
        );
      }
      console.log(resData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="email" id="email" ref={emailEl} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordEl} />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={switchModeHandler}>
          Switch to {isLogIn ? `Signup` : `Login`}
        </button>
      </div>
    </form>
  );
}
