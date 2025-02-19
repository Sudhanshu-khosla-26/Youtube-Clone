import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import api from "../services/api.service";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [coverImage, setcoverImage] = useState("");
  const [avatar, setavatar] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const hiddenAvatarInput = useRef(null);
  const hiddenCoverInput = useRef(null);
    
  const handleClickAvatar = event => {
    hiddenAvatarInput.current.click();
  };

  const handleClickCover = event => {
    hiddenCoverInput.current.click();
  };

  const handleChangeCover = (e) => {
    const image = e.target.files[0];
    if (image === "" || image === undefined) {
      alert(`not an image, the file is a ${typeof image}`);
      return;
    }
    setcoverImage(image);
  };

  const handleChangeAvatar = (e) => {
    const image = e.target.files[0];
    if (image === "" || image === undefined) {
      alert(`not an image, the file is a ${typeof image}`);
      return;
    }
    setavatar(image);
  };

  const CreateUser = async(event) => {
    event.preventDefault();
    if(Password!==ConfirmPassword){
      alert("Passwords do not match");
      return;
    }
    const formData = new FormData();
    formData.append("fullName", FullName)
    formData.append("email",Email)
    formData.append("username", username)
    formData.append("password", Password)
    formData.append("avatar", avatar)
    formData.append("coverImage", coverImage)
    try{
      api.post("/users/register", formData,  {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async(Response) => {
        console.log(Response);
        await localStorage.setItem("USER", JSON.stringify(Response.data.data));
        navigate("/");
      }).catch((err) => {
        console.log(err);
      })
    }
    catch(err){
      console.log(err);
    }
  }

  console.log(username, 
    FullName, 
    username, 
    Email, 
    coverImage, 
    avatar, 
    Password, 
    ConfirmPassword, 
  );

  const User = localStorage.getItem("USER");
  const reset = () => {
    setUsername("");
    setEmail("");
    setFullName("");
    setPassword("");
    setConfirmPassword("");
    setavatar("");
    setcoverImage("");
  } 

  const handleCancel = () => {
    navigate("/v3/Signin");
    reset();
  }

  useEffect(() => {
    if(User){
      navigate("/");
      reset();
    }
  }, [])

  return (
    <div className="fixed h-screen items-start inset-0 bg-[#0f0f0f] flex md:items-center justify-center z-[100000] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#272727] w-5/6 h-fit md:h-5/6 flex-col  rounded-lg shadow-xl p-8 my-8 flex md:flex-row items-center"
      >
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src="/favicon.svg"
            alt="Your Company"
            className="h-14 w-auto  mb-4"
          />
          <h2 className="text-[26px] text-center w-full md:text-3xl font-bold text-red-500">Create your account</h2>
          
          <div className="relative mt-8 mb-4">
            <div className="h-48 w-full rounded-xl overflow-hidden">
              {coverImage ? (
                <img
                  className="w-full max-h-[96px] md:max-w-[384px] h-[96px] md:w-[384px]  object-cover"
                  src={URL.createObjectURL(coverImage) || "/images/card-bg.svg"}
                  alt="Cover"
                />
              ) : (
                <img className='max-h-[96px] w-full md:max-w-[384px] h-[96px] md:w-[384px] rounded-xl' src="/images/card-bg.svg" alt="" />
              )}
            </div>
            <div className="absolute top-[85px] md:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {avatar ? (
                <img
                  className="w-28 h-28 rounded-full object-cover"
                  src={URL.createObjectURL(avatar) || "/images/user.png"}
                  alt="Avatar"
                />
              ) : (
                <img className='w-[80px] h-[80px] rounded-full' src="/images/user.png" alt="" />
              )}
            </div>
          </div>

          <div className="flex justify-between relative w-full top-[-65px] md:w-4/6 md:top-0 bottom-8 gap-4 ">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleClickAvatar}
              className="flex-1 bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition duration-300"
            >
              Upload Avatar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleClickCover}
              className="flex-1 bg-red-600  text-white py-2 rounded-md font-semibold hover:bg-red-700 transition duration-300"
            >
              Upload Cover
            </motion.button>
          </div>
        </div>

        <form onSubmit={CreateUser} className=" w-full relative bottom-[40px] md:bottom-0  md:w-1/2 flex flex-col">
          <div className="flex flex-col gap-4">
      
            <input
              type="file"
              ref={hiddenAvatarInput}
              onChange={handleChangeAvatar}
              className="hidden"
              accept="image/*"
            />
            <input type="file" ref={hiddenCoverInput} onChange={handleChangeCover} className="hidden" accept="image/*" />

            {["username", "fullName", "email", "password", "confirmPassword"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-300 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                  required
                  onChange={(e) => {
                    const setters = {
                      username: setUsername,
                      fullName: setFullName,
                      email: setEmail,
                      password: setPassword,
                      confirmPassword: setConfirmPassword,
                    }
                    setters[field](e.target.value)
                  }}
                  className="w-full px-3 py-2 bg-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            ))}

            <div className="flex justify-between gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-600 text-white py-2 rounded-md font-semibold hover:bg-gray-700 transition duration-300"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="flex-1 bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition duration-300"
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default SignUp
