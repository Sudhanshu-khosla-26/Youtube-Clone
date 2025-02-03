import { useRef, useState } from "react";
import styled from "styled-components";

const steps = ["details", "elements", "checks", "visibility"]

const PostModal = (props) => {
  const InputRef = useRef(null);
  const selectRef = useRef(null);

  const [files, setFiles] = useState();

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(selectedFiles);
    }
    console.log(selectedFiles, "selected files");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files;
    setFiles(droppedFile);
    console.log(droppedFile, "dropped files");
    console.log(files, "file");
  };

  const handleRemoveFile = () => {
    setFiles();
  };

  const handleSelect = () => {
    selectRef.current.click();
  };


  const reset = (e) => {
    setFiles();
    props.handleClick(e);
  };



  const [currentStep, setCurrentStep] = useState("details")
  const [progress, setProgress] = useState(25)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoElements: false,
    checks: false,
    visibility: false,
  })

  const handleStepClick = (step) => {
    setCurrentStep(step)
    setProgress((steps.indexOf(step) + 1) * 25)
  }

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
      setProgress((currentIndex + 2) * 25)
    }
  }

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
      setProgress(currentIndex * 25)
    }
  }

  return (
    <>
      {props.showModal === "open" && (
        <Container>
          <Content>
            <div className="header w-full h-[61px]  flex items-center justify-between">
              <div className="titleside text-[20px] leading-[28px] font-[600]">
                Upload videos
              </div>
              <div className="btnside w-[80px] h-[40px] flex items-center justify-between">
                <button className="w-[40px] h-[40px]">
                  <img className="invert " src="/images/Send-feedback.svg" alt="" />
                </button>
                <button onClick={reset} className="w-[40px] h-[40px]">
                  <img className="invert " src="/images/cancel.png" alt="" />
                </button>
              </div>
            </div>


            {files ?
              <>
                {/* <div className="statusBar">
              <div className="line">
                <div className="progress-bar"></div>
              </div>
              <div className="Deatails">
              <svg height="36" width="36"> 
                  <circle cx="18" cy="18" r="8" stroke="white" 
                  stroke-width="4" fill="black" /> 
              </svg> 
              </div>
              
              <div className="videoElements">

              </div>
              
              <div className="checks">

              </div>
              
              <div className="visibility">

              </div>

            </div> */}





                <div className="w-full">

                  {/* Timeline */}
                  <div className="px-4 py-6 border-b border-neutral-700">
                    <div className="relative">
                      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-neutral-600 -translate-y-1/2">
                        <div
                          className="h-full bg-white transition-all duration-300 ease-in-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="relative flex justify-between">
                        {steps.map((step, index) => (
                          <button
                            key={step}
                            onClick={() => handleStepClick(step)}
                            className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ease-in-out
                  ${index <= steps.indexOf(currentStep) ? "border-white bg-white" : "border-white bg-black"}
                  ${currentStep === step ? "scale-125" : ""}
                `}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      {steps.map((step) => (
                        <button
                          key={step}
                          onClick={() => handleStepClick(step)}
                          className={`text-neutral-400 hover:text-white transition-colors duration-200 ease-in-out
                ${currentStep === step ? "text-white font-medium" : ""}
              `}
                        >
                          {step.charAt(0).toUpperCase() + step.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {currentStep === "details" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-neutral-400 mb-2">Title (required)</label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 bg-[#1f1f1f] border border-neutral-700 rounded-md text-white placeholder-neutral-500"
                            placeholder="Add a title that describes your video"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-neutral-400 mb-2">Description</label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 min-h-[150px] bg-[#1f1f1f] border border-neutral-700 rounded-md text-white placeholder-neutral-500"
                            placeholder="Tell viewers about your video"
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === "elements" && (
                      <div className="text-white">
                        <h3 className="text-lg mb-4">Video elements</h3>
                        <p className="text-neutral-400">Add cards, end screens, and captions to your video.</p>
                      </div>
                    )}

                    {currentStep === "checks" && (
                      <div className="text-white">
                        <h3 className="text-lg mb-4">Checks</h3>
                        <p className="text-neutral-400">Review potential copyright issues and age restrictions.</p>
                      </div>
                    )}

                    {currentStep === "visibility" && (
                      <div className="text-white">
                        <h3 className="text-lg mb-4">Visibility</h3>
                        <p className="text-neutral-400">Choose when to publish and who can see your video.</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between p-4 border-t border-neutral-700">
                    <button
                      onClick={handleBack}
                      disabled={currentStep === "details"}
                      className="px-4 py-2 text-white bg-transparent hover:bg-neutral-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentStep === "visibility"}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>

              </>
              :
              <div className="drag-container"
                ref={InputRef}
                onDrop={handleDrop}
                onDragOver={(event) => {
                  event.preventDefault();

                }}
              >
                <div className="center-cirle">
                  <div className="arrow-up"></div>
                  <div className="arrow-rectanglebox"></div>
                  <div className="arrow-baseline"></div>
                </div>
                <p className="dragtext1">Drag and drop video files to upload</p>
                <p className="dragtext2">Your videos will be private until you publish them.</p>
                <button onClick={handleSelect} className="select">
                  Select files
                </button>

                <input ref={selectRef} className="inputbox" type="file" onChange={handleFileChange} accept="video/*" />

                <p className="dragtext3">
                  By submitting your videos to YouTube, you acknowledge that you agree to YouTube's
                  <span>Terms of Service </span>
                  and
                  <span>Community Guidelines.</span>
                </p>
                <p className="dragtext4">
                  Please make sure that you do not violate others' copyright or privacy rights.
                  <span>Learn more</span>
                </p>
              </div>

            }

          </Content>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  color: black;
  background-color: rgba(0, 0, 0, 0.6);
  animation: fadeIn 0.3s;
`;

const Content = styled.div`
  width: 960px;
  /* max-width: 744px; */
  background-color: #282828;
  /* max-height: 90%; */
  overflow: initial;
  height: 549px;
  border-radius: 26px;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  top: 26px;
  margin: 24px auto;
  color: white;

  .header{
    padding: 16px 24px;
    border-bottom: 1px solid #3e3e3e;

    .titleside{
      margin-right: 16px;
    }

    .btnside{
      & > button{
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover{
          background-color: #3e3e3e;
        }
      }
    }
  }

  .drag-container{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    position: relative;


    .center-cirle{
      width: 136px;
      height: 136px;
      border-radius: 50%;
      background-color: #1f1f1f;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-top: 80px;
      /* background-repeat: no-repeat;
      background-image: url(https://www.gstatic.com/youtube/img/creator/uploads/speed_line_darkmode.svg);
      background-size: cover; */

      .arrow-up{  
        width: 0; 
        height: 0; 
        border-left: 19px solid transparent;
        border-right: 19px solid transparent;
        border-bottom: 21px solid #909090;

      }

      .arrow-rectanglebox{
        width: 0; 
        height: 0; 
        // margin-left: 5px;
        border-left: 8px solid  #909090;
        border-right: 8px solid  #909090;
        border-bottom: 16px solid  #909090;
      }



      .arrow-baseline{
        width: 0; 
        height: 0; 
        margin-top: 8px;
        border-left: 20px solid  #909090;
        border-right: 20px solid  #909090;
        border-bottom: 6px solid  #909090;
      }
    }

    .inputbox{
      position: absolute;
      width: 136px;
      height: 136px;
      opacity: 0;
      top: 80px;
      cursor: pointer;
      opacity: 0;
      border-radius: 50%;
    }



    .dragtext1{
      line-height: 24px;
      font-size: 15px;
      font-weight: 400;
      color: rgb(255,255,255);
      margin-top: 23px;
      text-align: center;
    }

    .dragtext2{
      line-height: 20px;
      font-size: 13px;
      font-weight: 400;
      text-align: center;
      color: rgb(170,170,170);
      margin-top: 2px;
    }

    .select{
      width: 101px;
      height: 36px;
      background-color: white;
      border-radius: 18px;
      line-height: 36px;
      font-size: 14px;
      font-weight: 500;
      color: black;
      margin: 26px 0 64.5px 0;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      
      &:hover{
        background-color: #d9d9d9;
      }
    }

    .dragtext3{
      line-height: 24px;
      font-size: 12px;
      font-weight: 400;
      text-align: center;
      color: rgb(170,170,170);
      span{
        margin-left: 4px;
        color: rgb(62,166,255);

      }
    }

    .dragtext4{
      line-height: 24px;
      font-size: 12px;
      font-weight: 400;
      color: rgb(170,170,170);
      margin-bottom: 4px;
      text-align: center;
      span{
        color: rgb(62,166,255);
        margin-left: 4px;
      }
    }

  }


  @media (max-width:786px){
    width: 390px;
    height: 592px;
  }


`;
export default PostModal;