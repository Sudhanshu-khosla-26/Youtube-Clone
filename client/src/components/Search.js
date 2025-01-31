import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import LeftSide from "./LeftSide";
import styled from "styled-components";

const Search = () => {
  const [SEARCHVIDEOS, setSEARCHVIDEOs] = useState([]);
  const [activetag, setactiveta] = useState("All");

  const tags = ["All", "Shorts", "Videos", "Unwatched", "Watched", "Recently uploaded", "Live"];

  const { query } = useParams();
  console.log(query);

  useEffect(() => {
    axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${query}&key=AIzaSyAV74Shpyw_Aov7ux6po4GJ1Ti_Z8oLhS8`)
      .then((response) => {
        setSEARCHVIDEOs(response.data.items);
        console.log(response.data.items);
      })

    // axios.get(`https://youtube.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=IN&key=AIzaSyAV74Shpyw_Aov7ux6po4GJ1Ti_Z8oLhS8`)
    //   .then((videos) => {
    //     settaglist(videos.data.items)
    //     // console.log(videos.data.items);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   })

  }, []);

  return (
    <>

      <Container>
        <LeftSide />
        <div className="right flex flex-col w-screen h-screen ">
          <div className="tags w-screen h-48">
            {tags.length > 0 && tags.map((tag, index) => (
              <button className={`${tag === activetag ? "bg-white text-black hover:bg-[#FFFFFF]" : "text-white bg-[#272727] hover:bg-[#3F3F3F]"}`} key={index} onClick={() => setactiveta(tag)} >
                {tag}
              </button>
            ))}

          </div>
          <ul>

            {SEARCHVIDEOS.length > 0 && SEARCHVIDEOS.map((Data, index) => (
              <a href={`/watch/${Data.id.videoId}`} key={index} >
                <li className='flex w-full h-fit'>
                  <img className="h-[280px] object-cover min-w-[500px] max-[500px] " src={Data?.snippet?.thumbnails?.maxres?.url || Data?.snippet?.thumbnails?.standard?.url || Data?.snippet?.thumbnails?.high?.url} alt="" />
                  <div className="videoInfo">
                    {/* <img src={} alt="Channel" /> */}
                    <div className="Info">
                      <div className="title">
                        <span>{Data.snippet.title.length > 74 ? Data.snippet.title.slice(0, 72) + "..." : Data.snippet.title}</span>
                        <img src="/images/tripledot.svg" alt="" />
                      </div>
                      <div className="channelname">
                        <span>
                          {Data?.snippet?.channelTitle}
                          <img src="/images/tick.svg" alt="" />
                        </span>
                      </div>
                      <span className='viewAndTime'>
                        {/* {formatViewCount(Data?.statistics?.viewCount)} views • {timeAgo(Data?.snippet?.publishedAt)}                      
                     */}
                      </span>
                    </div>
                  </div>
                </li>
              </a>
            ))}
          </ul>


        </div>
      </Container>
    </>
  )
}


const Container = styled.div`
  display: flex;
  gap: 14px;
  height: unset;
  margin-top: 56px;
    /* margin-top: 56px; */
  width: 100vw;
  height: 91vh;
  top: 0;
  /* left: 230px; */
  overflow-y: scroll;
  position: absolute;

  .right{

     .tags{
      margin-top: 4px;
     display: flex;
     scroll-behavior: smooth;
     overflow-x: scroll;
      /* margin-left: 24px; */
      white-space: nowrap;
    
    & > button{
      width: max-content;
      cursor: pointer;
      text-align: center;
      padding: 0 12px;
      line-height: 20px;
      font-size: 14px;
      font-weight: 500;
      font-family: "Gill Sans Extrabold", sans-serif;
      border: none;
      height: 32px;
      border-radius: 8px;
      margin: 12px 12px 12px 0;

    }
    }

    
  ul{
    display: flex; 
    flex-direction: column;
    position: absolute;
    top: 90px;
    left: 17px;
    /* left: 30px; */
    a{
      text-decoration: none;
      margin: 0 7.3px 40px 7.3px !important;
      li{
        list-style : none ;

        img{
          border-radius: 16px;
        }

        .videoInfo{
          display: flex;
          margin-top: 6px;
          img{
            margin-top: 4px;
            border-radius: 50%;
            width: 36px;
            height: 36px;
          }
          .Info{

            width: 100%;
            margin-left: 14px;
            max-width: 298px;
        
            display: flex;
            align-items: start;
            justify-content: space-between;
            /* flex-direction: column;  */
            .title{
              display: flex;
              align-items: center;
              justify-content: space-between;
              span{
                cursor: pointer;
                line-height: 22px;
                font-weight: 500;
                font-size: 16px;
              }

              img{
                width: 24px;
                cursor: pointer;
                height: 24px;
                margin-left: 2px;
                filter: invert(1);
              }
            }

            .channelname{
              display: flex;
              align-items: center;
              span{
                display: flex;
                align-items: center;
                font-weight: 400;
                color: #949494;
                cursor: pointer;
                font-size: 14px;
                line-height: 20px;
              
              img{
                width: 14px;
                margin-left: 4px;
                height: 14px;
                filter: invert(0.6);
              }
            }
              &:hover{
                span{
                  color: white;
                }
              }
            }

            .viewAndTime{
                color: #949494;           
                font-weight: 400;
                cursor: pointer;
                font-size: 14px;
                line-height: 20px;
            }

          }
        }
      }
    }
  }

  }

`

  ;

export default Search
