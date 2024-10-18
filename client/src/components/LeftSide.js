import styled , {createGlobalStyle} from "styled-components";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LeftSide = (props) => {
  const navigate = useNavigate();
  const User = JSON.parse(localStorage.getItem("USER"));
  const Minimize = useSelector((state) => state.MinimizeState);
  console.log(Minimize);

  return (
    <>
    <GlobalStyle />
    <Container Minimize={Minimize}>
      <ul>
        <a href="/" >
        <li className="active">
          <img src="/images/home.svg" alt="" />
          Home
        </li>
        </a>
        <a href="#">
        <li>
          <img src="/images/shorts.svg" alt="" />
          Shorts
        </li>
        </a>
        <a href="#">
        <li className="subscription">
          <img src="/images/subscriptions.svg" alt="" />
          Subscriptions
        </li>
        </a>

        {!Minimize &&
        
        <a href="#">
          <li>  
            <img src="/images/You.svg" alt="" />
            You
          </li>
        </a>
        }

        {Minimize && 
        <hr style={{
            width: "224px",
            height: "0.6px",
            backgroundColor: "#3d3d3d",
            opacity: "0.18",
            margin: "9px 0"
    }}></hr>
  }
        
        {Minimize && 
      <>  
    {User ? 
  <>
    <a href="#">
        <li className="Youbox">
          You
          <img src="/images/arrow-right.svg" alt="" />
        </li>
    </a>
    <a href="#">
        <li>
          <img src="/images/yourchannel.svg" alt="" />
          Your channel
        </li>
    </a>
    <a href="#">
        <li>
          <img src="/images/history.svg" alt="" />
          History
        </li>
    </a>
    <a href="#">
        <li>
          <img src="/images/playlists.svg" alt="" />
          Playlists
        </li>
    </a>
    <a href="#">
        <li>
          <img src="/images/yourvideos.svg" alt="" />
          Your videos
        </li>
    </a>
    <a href="#">
        <li>
          <img src="/images/watchlater.svg" alt="" />
          Watch Later
        </li>
    </a>
    <a href="#">
        <li>
          <img src="/images/likedvideos.svg" alt="" />
          Liked videos
        </li>
    </a>     
    </>
      :  
      <>
      <a href="#">
      <li>
        <img src="/images/history.svg" alt="" />
        You
      </li>
  </a>
      <a href="#">
      <li>
        <img src="/images/history.svg" alt="" />
        History
      </li>
  </a>
  </>
    } 
        </>
    }
      </ul>

      {Minimize && 
      <>
      {User ? 
      <hr style={{
        height: "0.6px",
        maxWidth: "236px",
        backgroundColor: "#3d3d3d",
        opacity: "0.18",
            margin: "34px 0 18px 0"
    }}></hr>
  :
  <hr style={{
    height: "0.6px",
    maxWidth: "236px",
    backgroundColor: "#3d3d3d",
    opacity: "0.18",
        margin: "0px 0 18px 0"
}}></hr>
  }
  

    {User ?
    <div className="subscriptionsbox">
      <span>Subscriptions</span>
      <ul>
        <li>
          <img src="https://yt3.ggpht.com/SieSOlanXFaZVE-5vJlrY9qq-zdGyWXrWCtF5JbjidPZvM2b_6ddCshm5i5n-yGSNHE2f2XASQ=s88-c-k-c0x00ffffff-no-rj" alt="" />
          <span>
          BeastBoyShub
            <img src="/images/livestream.svg" alt="" />
          </span>
        </li>
        <li>
          <img src="https://yt3.ggpht.com/SieSOlanXFaZVE-5vJlrY9qq-zdGyWXrWCtF5JbjidPZvM2b_6ddCshm5i5n-yGSNHE2f2XASQ=s88-c-k-c0x00ffffff-no-rj" alt="" />
          <span>
          BeastBoyShub
            <img src="/images/livestream.svg" alt="" />
          </span>
        </li>
        <li>
          <img src="https://yt3.ggpht.com/SieSOlanXFaZVE-5vJlrY9qq-zdGyWXrWCtF5JbjidPZvM2b_6ddCshm5i5n-yGSNHE2f2XASQ=s88-c-k-c0x00ffffff-no-rj" alt="" />
          <span>
          BeastBoyShub
            <img src="/images/livestream.svg" alt="" />
          </span>
        </li>
        <li>
          <img src="https://yt3.ggpht.com/SieSOlanXFaZVE-5vJlrY9qq-zdGyWXrWCtF5JbjidPZvM2b_6ddCshm5i5n-yGSNHE2f2XASQ=s88-c-k-c0x00ffffff-no-rj" alt="" />
          <span>
          BeastBoyShub
            <img src="/images/livestream.svg" alt="" />
          </span>
        </li>
        <li>
          <img src="https://yt3.ggpht.com/SieSOlanXFaZVE-5vJlrY9qq-zdGyWXrWCtF5JbjidPZvM2b_6ddCshm5i5n-yGSNHE2f2XASQ=s88-c-k-c0x00ffffff-no-rj" alt="" />
          <span>
          BeastBoyShub
            <img src="/images/livestream.svg" alt="" />
          </span>
        </li>
        <li>
          <img src="https://yt3.ggpht.com/SieSOlanXFaZVE-5vJlrY9qq-zdGyWXrWCtF5JbjidPZvM2b_6ddCshm5i5n-yGSNHE2f2XASQ=s88-c-k-c0x00ffffff-no-rj" alt="" />
          <span>
          BeastBoyShub
            <img src="/images/livestream.svg" alt="" />
          </span>
        </li>
        <li className="showmore">
          <img src="/images/arrow-down.svg" alt="" />
          Show more
        </li>
      </ul>
    </div>
    :
    <div className="signIn">
      <span>
        Sign in to like videos, comment, and subscribe.
      </span>
    <a href='/v3/Signin'>
      <button className="signin">
        <img src="/images/signin.svg" alt="" />
        Sign in
      </button>  
    </a>
    </div>
    }

    <hr style={{
              maxWidth: "236px",
            height: "0.6px",
            backgroundColor: "#3d3d3d",
            opacity: "0.18",
            margin: "0 0 18px 0"
    }}></hr>

    <div className="ExploreBox">
      <span>Explore</span>
      <ul>
        <li>
          <img src="/images/trending.svg" alt="" />
          <span>Trending</span>
        </li>
        <li>
          <img src="/images/shopping.svg" alt="" />
          <span>Shopping</span>
          </li>
        <li>
          <img src="/images/Music.svg" alt="" />
          <span>Music</span>
          </li>
        <li>
          <img src="/images/Films.svg" alt="" />
          <span>Films</span>
          </li>
        <li>
          <img src="/images/Live.svg" alt="" />
          <span>Live</span>
          </li>
        <li>
          <img src="/images/Gaming.svg" alt="" />
          <span>Gaming</span>
          </li>
        <li>
          <img src="/images/News.svg" alt="" />
          <span>News</span>
          </li>
        <li>
          <img src="/images/Sports.svg" alt="" />
          <span>Sport</span>
          </li>
        <li>
          <img src="/images/Courses.svg" alt="" />
          <span>Courses</span>
          </li>
        <li>
          <img src="/images/Fashion.svg" alt="" />
          <span>Fashion & beauty</span>
          </li>
        <li>
          <img src="/images/Podcasts.svg" alt="" />
          <span>Podcasts</span>
          </li>
      </ul>
    </div>

    <hr style={{
              maxWidth: "236px",
            height: "0.6px",
            backgroundColor: "#3d3d3d",
            opacity: "0.18",
            margin: "38px 0 18px 0"
    }}></hr>

    <div className="madefromYoutube">
      <span>
        More from Youtube
      </span>

    <ul>
      <li>
        <img src="/images/Youtube-premium.svg" alt="" />
      <span>Youtube Premuim</span>
      </li>
      <li>
        <img src="/images/Youtube-studio.svg" alt="" />
      <span>Youtube Studio</span>
      </li>
      <li>
        <img src="/images/Youtube-music.svg" alt="" />
      <span>Youtube Music</span>
      </li>
      <li>
        <img src="/images/Youtube-kids.svg" alt="" />
      <span>Youtube Kids</span>
      </li>
    </ul>
    </div>

    
    <hr style={{
            height: "0.6px",
            maxWidth: "236px",
            backgroundColor: "#3d3d3d",
            opacity: "0.18",
            margin: "0px 0 0px 0"
    }}></hr>

    <div className="settingAndFeedback">
      <ul>
        <li>
          <img src="/images/Setting.svg" alt="" />
        <span>Settings</span>
        </li>
        <li>
          <img src="/images/Report-history.svg" alt="" />
        <span>Report history</span>
        </li>
        <li>
          <img src="/images/Help.svg" alt="" />
        <span>Help</span>
        </li>
        <li>
          <img src="/images/Send-feedback.svg" alt="" />
        <span>Send feedback</span>
        </li>
      </ul>
    </div>

    <hr style={{
            height: "0.6px",
            maxWidth: "236px",
            backgroundColor: "#3d3d3d",
            opacity: "0.18",
            margin: "0px 0 0px 0"
    }}></hr>

    <div className="footer">
        <div className="tags1">
            <a href="">About</a>
            <a href="">Press</a>
            <a href="">Copyright</a>
            <a href="">Contact us</a>
            <a href="">Creator</a>
            <a href="">Advertise</a>
            <a href="">Developers</a>
        </div>
        <div className="tags2">
          <a href="">Terms</a>
          <a href="">Privacy</a>
          <a href="">Policy & Safety</a>
          <a href="">How Youtube works</a>
          <a href="">Test new features</a>
        </div>

        <div className="copyright">
        © 2024 Google LLC
        </div>
    </div>
    </>
  }
    </Container>
    </>
    
  );
};

const Container = styled.div`
  display: flex;
  background-color: #0F0F0F;
  flex: 0.18;
  max-width: fit-content;
  height: 91vh;
  position: relative;
  flex-direction: column;
  margin-top: 56px;
  overflow-y: scroll;
  overflow-x: hidden;
  z-index: 9999;

  /* ::-webkit-scrollbar {
    opacity: 0;
    transition: opacity 0.3s;
  } */

  /* Show scrollbar on hover */
  &:hover::-webkit-scrollbar {
    display: block;
  }

  ul{
    width: 236px;
    height: 425px;
    padding: 12px 12px;
    a{
        text-decoration: none;
      li{
        margin: 2px 0;
        width: 204px;
        height: 40px;
        padding: 0 12px;
        font-style: normal;
        border-radius: 10px;
        display: flex;
        line-height: 20px;
        font-size: 14px;
        font-weight: 500;
        gap: 26px;
        align-items: center;
        img{
          filter: invert(1);
        }    
        &:hover{
          background-color: #272727;
        }
        &:active{
          background-color:#3F3F3F;
        }

      }
    }




  }

  .subscription{
        border-bottom: 1 px solid grey;
  }

  .Youbox{
    line-height: 22px;
    font-size: 17px;
    font-weight: 500;
    gap: 8px !important;
  }

  .active{
          background-color: #272727;
        }

  .subscriptionsbox{
    span{
      margin-left: 24px;
      line-height: 22px;
      font-size: 17px;
      font-weight: 500;
    }

    ul{
      width: 236px;
    height: unset;
    padding: 12px 12px;
      display: flex;
      flex-direction: column;
      li{
        margin: 1px 0;
        cursor: pointer;
        width: 204px;
        height: 40px;
        padding: 0 12px;
        font-style: normal;
        border-radius: 10px;
        display: flex;
        line-height: 20px;
        font-size: 14px;
        font-weight: 500;
        /* gap: 26px; */
        align-items: center;
        img{
          border-radius: 50%;
          width: 24px;
          height: 24px;
        }
        span{
          display: flex;
          align-items: center;
          line-height: 20px;
          margin-left: 24px;
      font-size: 14px;
      font-weight: 400;
          img{
            width: 16px;
            margin-left: 20px;
            height: 16px;
          }
        }

        &:hover{
          background-color: #272727;
        }
        &:active{
          background-color:#3F3F3F;
        }
      }
    }
  }

  .showmore{
    display: flex;
    align-items: center;
    gap: 24px;
    cursor: pointer;
    img{
      width: 24px;
      height: 24px;
      filter: invert(1);
    }
      line-height: 20px;
      font-size: 14px;
      font-weight: 400;

  }

  .ExploreBox{
    span{
      margin-left: 24px;
      line-height: 22px;
      font-size: 17px;
      font-weight: 500; 
    }

    ul{
      list-style: none;
      li{
        /* margin: 1px 0; */
        cursor: pointer;
        width: 204px;
        height: 40px;
        padding: 0 12px;
        font-style: normal;
        border-radius: 10px;
        display: flex;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        /* gap: 26px; */
        align-items: center;
        img{
          width: 24px;
          height: 24px;
          filter: invert(1);
          
        }
        span{
          line-height: 20px;
      font-size: 14px;
      font-weight: 400;
        }
        &:hover{
          background-color: #272727;
        }
        &:active{
          background-color:#3F3F3F;
        }
      }
    }
  }

  .madefromYoutube{
    height: unset;
    span{
      margin-left: 24px;
      line-height: 22px;
      font-size: 17px;
      font-weight: 500; 
    }

    ul{
      list-style: none;
      height: unset;
      li{

      cursor: pointer;
        width: 204px;
        height: 40px;
        padding: 0 12px;
        font-style: normal;
        border-radius: 10px;
        display: flex;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        /* gap: 26px; */
        align-items: center;
        img{
          width: 24px;
          height: 24px;
        }
        span{
          line-height: 20px;
      font-size: 14px;
      font-weight: 400;
        }
        &:hover{
          background-color: #272727;
        }
        &:active{
          background-color:#3F3F3F;
        }
      }
    }
  }

  .settingAndFeedback{
    ul{
      list-style: none;
      height: unset;
      li{

      cursor: pointer;
        width: 204px;
        height: 40px;
        padding: 0 12px;
        font-style: normal;
        border-radius: 10px;
        display: flex;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        /* gap: 26px; */
        align-items: center;
        img{
          width: 24px;
          height: 24px;
          filter: invert(1);
        }
        span{
          line-height: 20px;
          margin-left: 24px;  
      font-size: 14px;
      font-weight: 400;
        }
        &:hover{
          background-color: #272727;
        }
        &:active{
          background-color:#3F3F3F;
        }
      }
    }
  }

  .footer{
    
    .tags1{
      display: flex;
      flex-wrap: wrap;
      width: 220px;
      height: 54px;
      padding:16px 20px 0 20px;
      line-height: 18px;
      font-weight: 500;
      font-size: 13px;
      a{
        margin: 0 3px;
        color: rgb(170,170,170);
        text-decoration: none;
      }
    }

    .tags2{
      margin-top: 8px;
      height: 54px;
      padding:16px 16px 0 20px;
      line-height: 18px;
      font-weight: 500;
      display: flex;
      flex-wrap: wrap;
      width: 220px;
      font-size: 13px;
      a{
        margin: 0 3px;
        text-decoration: none;
        color: rgb(170,170,170);
      }
    }
  
  .copyright{
    line-height: 18px;
    font-weight: 400;
    font-size: 12px;
    margin-left: 24px;
    margin-top: 28px;
    padding-bottom: 16px;
    color: rgb(113,113,113);
  }
}

.signIn{
  display: flex;
  flex-direction: column;
  width: 240px;
  margin-bottom: 16px;
  padding: 0px 32px 8px 32px !important;

  span{
    font-size: 14px;
    line-height: 2rem;
    font-weight: 400;
    width: 176px;
    margin-bottom: 8px;
  }

  a{
    text-decoration: none;
    pointer: default;
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


  ${props => props.Minimize === false && `
    width: fit-content !important;

    ul{
    width: fit-content !important;
    padding: 0 10px 0 4px !important;
    li{
    display: flex !important;
    flex-direction: column !important;
    margin: 2px 0 !important;
    width: 64px !important;
    height: 74px !important;
    gap: 0 !important;
    align-items: center !important;
    line-height: 14px !important;
    font-size:10px !important;
    font-weight: 400 !important;
    padding: 16px 0 14px 0 !important;
    img{
      padding-bottom: 5px !important;
    }
  }
  }

  .active{
    background-color: transparent;
  }

  `}

`;

const GlobalStyle = createGlobalStyle`
  /* Custom scrollbar styles for WebKit browsers */
  ::-webkit-scrollbar {
    width: 8px; /* Small width for scrollbar */
display: none;
transition: display 0.3s;

  }

  ::-webkit-scrollbar-track {
    background: #0f0f0f; //Dark background for the track
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: #ABABAB; /* Dark gray for the thumb */
    border-radius: 3px;
    border: 2px solid #222; /* Slightly darker border to make it stand out */
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555; /* Slightly lighter gray when hovering */
  }
`;

export default LeftSide;
