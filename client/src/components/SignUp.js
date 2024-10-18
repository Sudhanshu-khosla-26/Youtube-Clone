import styled from 'styled-components';
import React, { useRef, useState , useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const SignUp = (props) => {
    const navigate = useNavigate();
    const [username, setusername] = useState("");
    const [FullName, setFullName] = useState("");
    const [Email, setEmail] = useState("");
    const [coverImage, setcoverImage] = useState("");
    const [avatar, setavatar] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    // const [country, setcountry] = useState("");
    // const [Address, setAddress] = useState("");
    // const [City, setCity] = useState("");
    // const [State, setState] = useState("");
    // const [PinCode, setPinCode] = useState("");

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
        axios.post("http://localhost:8000/api/v1/users/register", formData,  {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((Response) => {
          console.log(Response);
          localStorage.setItem("USER", JSON.stringify(Response.data.data));
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
    setusername();
    setEmail();
    setFullName();
    setPassword("");
    setConfirmPassword("");
    setavatar();
    setcoverImage();
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
    <Container>
 

    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-4 lg:px-8">
        <div className="sm:mx-auto  sm:w-full sm:max-w-sm">
          <h2 className="mt-1 flex justify-center items-center  text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          <img
            alt="Your Company"
            src="/favicon.svg"
            className="mx-2 h-[28px] w-auto"
          />
          Create your account
          </h2>
        </div>



        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">

          <div>
            <div className="relative coverimage-and-avatar">
              <div className=" coverimage">
              {coverImage ?
                <img className='h-[96px] w-[384px] rounded-xl' src={URL.createObjectURL(coverImage)} alt="" />
                :
                <img className='h-[96px] w-[384px] rounded-xl' src="/images/card-bg.svg" alt="" />
              }  
              </div>

              <div className="absolute top-[42px] left-[39%] rounded-full avatar">
                {
                  avatar ?
                  <img className='w-[80px] h-[80px] rounded-full' src={URL.createObjectURL(avatar)} alt="" />
                  : 
                  <img className='w-[80px] h-[80px] rounded-full' src="/images/user.png" alt="" />
                }
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-x-6 mb-6">

          <div className="uploadavatar">
          {/* <div className="absolute top-0 bottom-0 left-0 right-0 w-[118px]
                        h-[38px] z-10 avatarinput"> */}
          <input
                        required
                        onChange={handleChangeAvatar}
                        id="avatar-upload"
                        name="avatar-upload"
                        type="file"
                        ref={hiddenAvatarInput}
                        className="hidden sr-only  " />
          {/* </div> */}
          <span onClick={handleClickAvatar} className='cursor-pointer rounded-md bg-indigo-600 px-3 py-[10px] text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>upload Avatar</span>
          </div>

          <div className="uploadcover">
          {/* <div className="absolute top-0 bottom-0 left-0 right-0 w-[118px]
                        h-[38px] z-10 avatarinput"> */}
          <input
                        required
                        onChange={handleChangeCover}
                        id="cover-upload"
                        name="cover-upload"
                        type="file"
                        ref={hiddenCoverInput}
                        className="hidden sr-only  " />
          {/* </div> */}
          <span onClick={handleClickCover} className='cursor-pointer rounded-md bg-indigo-600 px-3 py-[10px] text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>upload Cover</span>
          </div>

 
        </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                User Name
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  onChange={(e) => setusername(e.target.value)}
                  name="username"
                  type="text"
                  required
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="FullName" className="block text-sm font-medium leading-6 text-gray-900">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="fullname"
                  name="fullname"
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  required
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  type="password"
                  required
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm Password
                </label>
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-x-6 mb-6">
        <button onClick={handleCancel} type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button 
          // type="submit"
          disabled={!FullName || !username || !Email || !coverImage || !avatar || !Password || !ConfirmPassword}
          onClick={CreateUser}
          className="cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
        </div>

            {/* <div>
              <button
                type="button"
                className="flex justify-center align-centre block w-full rounded-md border-0 py-1.5 text-indigo-600 shadow-sm ring-1 ring-inset font-semibold ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-grey-600 sm:text-sm sm:leading-6"
              >
                <img className='w-[24px] mx-2 h-[24px]:' src="/images/google-icon.png" alt="" />
                Continue with Google
              </button>
            </div> */}
          </form>

          
        </div>
      </div>

    </Container>
  )
}

const Container = styled.div`
  z-index: 9999999;
  background-color: white;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  overflow-y: scroll;
    form{
        /* margin: 30px auto 0 ; */
        width: fit-content;
    }
`;

export default SignUp
