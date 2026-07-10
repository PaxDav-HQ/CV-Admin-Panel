import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../schemas";
import axios from "axios";
import { useSelector } from "react-redux";
import { Alert } from "@mui/material";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const uri = useSelector(state=>state.UriReducer.uri)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
  const { handleChange, handleBlur, handleSubmit, values, errors, touched } = useFormik({
      initialValues: {
        email: '',
        password: ''
      },
      validationSchema: loginSchema,
      onSubmit: (values) => {
        setError('')
        setIsLoading(true)
        axios.post(`${uri}auth/admin/login`, values)
        .then((res)=>{
          console.log(res.data);
          sessionStorage.setItem('userToken', res.data.token)
          sessionStorage.setItem('route', '/admin/dashboard')
          navigate('/admin')
        })
        .catch((err)=>{
          setIsLoading(false)
          console.log(err);
          err.response ? setError(err.response.data.message) : setError('An error occurred')
        })
      }
    })

  return (
    <div className="bg-admin">        
        <div className="inner-bg-admin">
            <div
            className="d-flex justify-content-center align-items-center py-2"
            style={{ minHeight: "100vh" }}
            >
            <div
                className=""
                style={{                            
                padding: "40px 32px",
                width: "100%",
                maxWidth: "420px",
                }}
            >
                {/* Header */}
                <h4 className="fw-semibold mb-1">Admin Login</h4>
                <p
                    className="text-muted mb-4"
                    style={{ fontSize: "14px" }}
                >
                    Login with your Details
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit}>  
                    {error && <Alert severity="error" className="mb-3">{error}</Alert>}             
                <div className="mb-3">
                    <label className="form-label fw-medium" style={{ fontSize: "13px" }}>
                        Email Address
                    </label>
                    <input
                    type="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name="email"
                    className={"form-control bg-transparent border-bottom" + (errors.email && touched.email ? ' is-invalid' : '')}
                    placeholder="falanayemi.com"
                    style={{
                        border: "1px solid #e9e9e9",
                        height: "42px",
                        fontSize: "14px",
                    }}
                    />
                </div>

                <div className="mb-3 position-relative">
                    <label className="form-label fw-medium" style={{ fontSize: "13px" }}>
                    Password
                    </label>
                    <input
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    className={"form-control bg-transparent border-bottom" + (errors.password && touched.password ? ' is-invalid' : '')}
                    placeholder="••••••••"
                    style={{
                        border: "1px solid #e9e9e9",
                        height: "42px",
                        fontSize: "14px",
                    }}
                    />
                    <i
                    className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: "absolute",
                        right: "12px",
                        top: "36px",
                        cursor: "pointer",
                        color: "#aaa",
                    }}
                    ></i>
                </div>               

                <button
                    type="submit"
                    className="btn w-100 fw-semibold"
                    disabled={isLoading}
                    style={{
                    backgroundColor: "#004225",
                    color: "#fff",
                    borderRadius: "6px",
                    height: "45px",
                    }}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>                
                </form>
            </div>
            </div>
        </div>
    </div>
  );
}

export default Login;