import React from "react";

function Following(props) {
    return (
      <div className={"border-0"}>
        <div className={"p-1"}>
          <img src={props.img} alt={"Missing"} className={"rounded mt-2 w-100 image"}/>
          <div className={"row"}>
            <div className="col-lg-9">
          <h4 className={"font-size-lg"}>{props.username}</h4>
          <p>{props.status}  </p>
            </div>
            <div className={"col-lg-3"}>
              <button type="submit" className={"btn float-right text-white mt-2 mb-2 ml-2 rad"} id="unfollowbtn"
                      style={{backgroundColor: '#254E58'}} onClick={() => props.deleteFollow(props.username)}>Unfollow</button>
            </div>

          </div>
        </div>
      </div>
    );
  }

export default Following;
