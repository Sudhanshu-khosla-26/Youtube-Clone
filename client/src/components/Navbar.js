import styled from 'styled-components';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { toggleBoolean } from '../features/Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PostModal from './PostModal';

const Navbar = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState("close");
  const [ShowSeetingsBox, setShowSeetingsBox] = useState(false)
  const [showUplaodbox, setshowUplaodbox] = useState(false);

  const User = JSON.parse(localStorage.getItem('USER'));

  const handleToggle = () => {
    dispatch(toggleBoolean());
  };

  const LogOut = async() => {
    
    
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/logout', {}, {
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers required for authentication
          'Authorization': `Bearer ${User?.accessToken}`
        }
      });
      localStorage.removeItem('USER');
      setShowSeetingsBox(false);
      console.log('Logout successful:', response.data);
      navigate("/v3/Signin")
    } catch (error) {
      console.error('Error logging out:', error.response ? error.response.data : error.message);
    }

// try {
//       axios.post("http://localhost:8000/api/v1/users/logout", User).then((response) => {
//         console.log(response);
//         localStorage.removeItem('USER');
//         navigate("/v3/Signin")
//       }).catch((err)=>{
//         console.log(err.message);
//       })
// } catch (error) {
//   console.log(error);
// }
  }

  const handleClick = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }

    switch (showModal) {
      case "open":
        setShowModal("close");
        setshowUplaodbox(false);
        break;
      case "close":
        setShowModal("open");
        setshowUplaodbox(false);
        break;
      default:
        setShowModal("close");
    }
  };

  return (
    
    <>
    <Container>
      <div className="LeftSideSections">
      <div className="menubutton" onClick={()=> {
        handleToggle()
        // Minimize === true? setMinimize(false) : setMinimize(true);  
      }}>
        <img src="/images/hamburger-menu.svg" alt="" />
      </div>
      <div className="yotubelogo">
      <img src="/images/youtube.svg" alt="" />
        {/* <img src="/images/logo4.0.png" alt="" /> */}
        <span>
          IN
        </span>
      </div>
      </div>

      <div className="MiddleSections">
        <div className="searchbox">
        <form>
          <div className='Yt-icon'>
              <img src="" alt="" />
          </div>
          <div className="search-input">
            <input placeholder='Search' type="text" />
          </div>
          <button className="search">
            <img src="/images/search.svg" alt="" />
          </button>
        </form>
        </div>

        <button className="voiceicon">
          <img src="/images/voice-search-icon.svg" alt="" />
        </button>

      </div>
      {User ?
      <div className="LastSections">
        <div className="upload">
        <button  onClick={()=> showUplaodbox? setshowUplaodbox(false) : setshowUplaodbox(true)}>
          <img src="/images/upload.svg" alt="" />
        </button>
            {showUplaodbox && <div className="createbox">
              <ul>
                <li onClick={handleClick}>
                  <img src="/images/yourvideos.svg" alt="" />
                  Upload video
                </li>
                <li>
                  <img src="/images/Live.svg" alt="" />
                  Go live
                </li>
                <li>
                  <img src="/images/createpost.svg" alt="" />
                  Create post
                </li>
              </ul>
            </div>}
        </div>
        <button className="notifications">
          <img src="/images/notifications.svg" alt="" />
        </button>
        <div className="relative userbox">
          <img  onClick={()=> {ShowSeetingsBox ? setShowSeetingsBox(false) : setShowSeetingsBox(true)}} src="/images/my photo.jpg" alt="" />
          {ShowSeetingsBox && <div className="functionbox">
          <ul>

            <li style={{padding: "8px 16px 16px 16px", gap: '20px', marginTop: "0", backgroundColor: "transparent"}} >
              <img style={{filter: "invert(0) ",width: "40px", height: "40px", marginBottom: "30px"}} className='rounded-full' src={User?.user?.avatar} alt="" />
              <div className="flex flex-1 flex-col items-start">
                <span className='cursor-default leading-[22px] text-[16px] font-[400]'>
                  {User?.user?.fullName}
                </span>
                <span className="cursor-default leading-[22px] text-[16px] font-[400]">
                  @{User?.user?.username}
                </span>
                <a href="#" style={{color: "rgb(62, 166, 255)", margin: "8px 0 0 0 "}} className=' leading-[20px] text-[14px] font-[400]'>
                  View your channel
                </a>
              </div>
            </li>

          <hr style={{
            height: "0.6px",
            width: "-webkit-fill-available",
            backgroundColor: "#3d3d3d",
            opacity: "0.18",
            margin: "6px 0 6px 0"
    }}></hr>

            <li>
              <img src="/images/Google-account.svg" alt="" />
              <span>Google Account</span>
            </li>

            <li>
              <img src="/images/Switch-account.svg" alt="" />
              <span>Switch account</span>
              <img src="/images/arrow-right.svg" alt="" />
            </li>

            <li onClick={LogOut} >
              <img src="/images/Sign-out.svg" alt="" />
              <span>Sign out</span>
            </li>

          <hr style={{
            height: "0.6px",
            width: "-webkit-fill-available",
            backgroundColor: "#3d3d3d",
            opacity: "0.18",
            margin: "6px 0 6px 0"
    }}></hr>

          <li>
              <img src="/images/Youtube-premeim.-setting.svg" alt="" />
              <span>YouTube Studio</span>
            </li>
            <li>
              <img src="/images/YourData.svg" alt="" />
              <span>Purchases and memberships</span>
            </li>

          <hr style={{
            height: "0.6px",
            width: "-webkit-fill-available",
            backgroundColor: "#3d3d3d",
            opacity: "0.18",
            margin: "6px 0 6px 0"
    }}></hr>

            <li>
              <img src="/images/YourData.svg" alt="" />
              <span>Your data in YouTube</span>
            </li>
            <li>
              <img src="/images/theme.svg" alt="" />
              <span>Appearance: Device theme</span>
              <img src="/images/arrow-right.svg" alt="" />
            </li>
            <li>
              <img src="/images/Language.svg" alt="" />
              <span>Language: English</span>
              <img src="/images/arrow-right.svg" alt="" />
            </li>
            <li>
              <img src="/images/Restriction.svg" alt="" />
              <span>Restricted Mode: Off</span>
              <img src="/images/arrow-right.svg" alt="" />
            </li>
            <li>
              <img src="/images/Location.svg" alt="" />
              <span>Location: India</span>
              <img src="/images/arrow-right.svg" alt="" />
              </li>
            <li>
              <img src="/images/Keyboard-shortcuts.svg" alt="" />
              <span>Keyboard shortcuts</span>
            </li>
          </ul>

          <hr style={{
            height: "0.6px",
            width: "-webkit-fill-available",
            backgroundColor: "#3d3d3d",
            opacity: "0.18",
            margin: "0px 0 0px 0"
    }}></hr>

    <ul style={{margin: "6px 0"}}>
      <li>
        <img src="/images/Setting.svg" alt="" />
        Settings
      </li>
    </ul>

    
    <hr style={{
            height: "0.6px",
            width: "-webkit-fill-available",
            backgroundColor: "#3d3d3d",
            opacity: "0.18",
            margin: "0px 0 6px 0"
    }}></hr>

    <ul>
      <li>
        <img src="/images/Help.svg" alt="" />
        Help
        </li>
      <li>
        <img src="/images/Send-feedback.svg" alt="" />
        Send feedback
        </li>
    </ul>

        </div>
}
          {/* <div className="absolute bg-gray-600 w-24 h-8">
            Sign Out
          </div> */}
        </div>
      </div>
  :
  <>
  <div className="sign_box">

  <div className="settingicon">
        <img onClick={()=> {ShowSeetingsBox ? setShowSeetingsBox(false) : setShowSeetingsBox(true)}} src="/images/tripledot.svg" alt="" />
        {ShowSeetingsBox && <div className="functionbox">
          <ul>
            <li>
              <img src="/images/YourData.svg" alt="" />
              <span>Your data in YouTube</span>
            </li>
            <li>
              <img src="/images/theme.svg" alt="" />
              <span>Appearance: Device theme</span>
              <img src="/images/arrow-right.svg" alt="" />
            </li>
            <li>
              <img src="/images/Language.svg" alt="" />
              <span>Language: English</span>
              <img src="/images/arrow-right.svg" alt="" />
            </li>
            <li>
              <img src="/images/Restriction.svg" alt="" />
              <span>Restricted Mode: Off</span>
              <img src="/images/arrow-right.svg" alt="" />
            </li>
            <li>
              <img src="/images/Location.svg" alt="" />
              <span>Location: India</span>
              <img src="/images/arrow-right.svg" alt="" />
              </li>
            <li>
              <img src="/images/Keyboard-shortcuts.svg" alt="" />
              <span>Keyboard shortcuts</span>
            </li>
          </ul>

          <hr style={{
            height: "0.6px",
            backgroundColor: "#3d3d3d",
            opacity: "0.18",
            margin: "0px 0 0px 0"
    }}></hr>

    <ul style={{margin: "6px 0"}}>
      <li>
        <img src="/images/Setting.svg" alt="" />
        Settings
      </li>
    </ul>

    
    <hr style={{
            height: "0.6px",
            backgroundColor: "#3d3d3d",
            opacity: "0.18",
            margin: "0px 0 6px 0"
    }}></hr>

    <ul>
      <li>
        <img src="/images/Help.svg" alt="" />
        Help
        </li>
      <li>
        <img src="/images/Send-feedback.svg" alt="" />
        Send feedback
        </li>
    </ul>

        </div>
}
  </div>
  <a href='/v3/Signin'>
  <button className="signin">
    <img src="/images/signin.svg" alt="" />
    Sign in
  </button>  
  </a>
  </div>
  </>
}

    <PostModal showModal={showModal} handleClick={handleClick}  />
    </Container>
  </>

  )
}

const Container = styled.div`
  /* background-color: darkgrey; */
  padding: 0 16px;
  height: 56px;
  background-color: #0F0F0F;
  width: 100vw;
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 99999;

  .LeftSideSections{
    display: flex;
    align-items: center;
    .menubutton{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      width: 24px;
      height: 24px;
      filter: invert(1);
    }

  

    &:hover{
      background-color: #272727;
    }
    }

    .yotubelogo{
      width: 120px;
      cursor: pointer;
      height: 56px;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      img{
       width: 90px;
       height: 20px;
      }
      
      span{
      font-weight: 500;
      font-size: 10px;
      color: lightgray;
      position: absolute;
      right: 0px;
      top: 15px;
    }
  
    }
  }

  .MiddleSections{
    display: flex;
    align-items: center;
    gap: 16px;
    margin-right: 20px;

    .searchbox{
      width: 632px;
      height: 40px;
      padding: 0 4px;
      display: flex;
      align-items: center;

      
      form{
        padding: 0 4px 0 16px;
        margin-left: 32px;
        border: 1px solid #3D3D3D;
        display: flex;
        width: 568px;
        border-radius:18px ;
        height: 40px;
        align-items: center;

        .search-input{
          width: 515px;
          height: 24px;
          input{
            width: 515px;
            padding: 1px 0;
            background-color: #121212;
            border: none;
            outline: none;
            line-height: 24px;
            font-size: 16px;
            font-weight: 400;
            height: 24px;
            color: white;
          }
        }

        .search{
          width: 64px;
          padding: 1px 20px;
          height: 40px;
          border: 1px solid #3D3D3D;
          display: flex;
          justify-content: center;
          align-items: center;
          outline: none;
          border-top-right-radius: 18px;
          border-bottom-right-radius: 18px;
          background-color: #222222;
          img{
            width: 24px;
            height: 24px;
            filter: invert(1);
          }
          }
        }
      }

    }

    .voiceicon{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background-color: #272727;
      border: none;
      img{
        filter: invert(1);
        width: 24px;
        height: 24px;
      }
      &:hover{
        background-color: #3D3D3D;
      }
      
    }

  .LastSections{
    display: flex;
    gap: 14px;

    & > button{
      width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
      cursor: pointer;
      background: transparent;
      border: none;
      img{
        filter: invert(1);
        width: 24px;
        height: 24px;
      }

      &:hover{
      background-color: #272727;
     }
    

    }

    .upload{
      & > button{
      width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
      cursor: pointer;
      background: transparent;
      border: none;
      img{
        filter: invert(1);
        width: 24px;
        height: 24px;
      }

      &:hover{
      background-color: #272727;
     } 
    }
      .createbox{
        display: flex;
        height: unset;
        max-height: 634px;
        overflow-y: scroll;
        align-items: center;
        flex-direction: column;
        top: 52px;
    right: 13px;
        background-color: #272727;
        position: absolute;
        border-radius: 12px;
        ul{
          display: flex;
          flex-direction: column;
          margin: 8px 0;
          list-style: none;
          li{
            gap: 8px;
            width: 176px;
            min-height: 40px;
            padding: 0 16px;
            flex: 1;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 400;
            color: rgb(241, 241, 241);
            line-height: 20px;
            font-family: normal;
            /* font-family: Roboto, Arial, sans-serif; */

            & > img{
              cursor: pointer;
              width: 24px;
              height: 24px;
              filter: invert(1);
            }

            :nth-child(3){              
              margin-left: auto;
            }

            &:hover{
              background-color: #3D3D3D;
            }
          }
        }
      }
    }


    .userbox{
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 30px;
      border-radius: 50%;
      position: relative;
      
      img{
        border-radius: 50%;
        width: 32px;
        height: 32px;
        &:active{
          border: 2px solid #0a66ce;
        }
      }

      .functionbox{
        display: flex;
        height: unset;
        max-height: 634px;
        overflow-y: scroll;
        align-items: center;
        flex-direction: column;
        top: 2px;
        right: 50px;
        background-color: #272727;
        position: absolute;
        border-radius: 12px;
        ul{
          display: flex;
          flex-direction: column;
          margin: 8px 0;
          list-style: none;
          li{
            gap: 8px;
            width: 300px;
            min-height: 40px;
            padding: 0 16px;
            flex: 1;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 400;
            color: rgb(241, 241, 241);
            line-height: 20px;
            font-family: normal;
            /* font-family: Roboto, Arial, sans-serif; */

            & > img{
              cursor: pointer;
              width: 24px;
              height: 24px;
              filter: invert(1);
            }

            :nth-child(3){              
              margin-left: auto;
            }

            &:hover{
              background-color: #3D3D3D;
            }
          }
        }
      }
    }

    }


  
  
  .sign_box{
    display: flex;
    align-items: center;
    .settingicon{ 
      position: relative;
      margin-right: 26px;
      img{
        cursor: pointer;
        width: 24px;
        height: 24px;
        filter: invert(1);
      }
      .functionbox{
        top: 42px;
        right: -16px;
        background-color: #272727;
        position: absolute;
        border-radius: 12px;
        ul{
          display: flex;
          flex-direction: column;
          margin: 8px 0;
          list-style: none;
          li{
            gap: 8px;
            width: 289px;
            min-height: 40px;
            padding: 0 16px;
            flex: 1;
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 400;
            line-height: 24px;
            font-family: Roboto, Arial, sans-serif;

            :nth-child(3){              
                margin-left: auto;
            }

            &:hover{
              background-color: #3D3D3D;
            }
          }
        }
      }
    }

  a{
    text-decoration: none;
  .signin{
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid grey;
    color: #3ea6ff;
    width: 96px;
    height: 36px;
    font-size: 14px;
    line-height: 36px;
    font-weight: 500;
    background: transparent;
    border-radius: 18px;
    cursor: pointer;

    img{
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }

    &:hover{
      background-color: #3D3D3D;
    }
  }
}
}
`;

export default Navbar;
