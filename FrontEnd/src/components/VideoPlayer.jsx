import React from "react";

export default function VideoPlayer() {
  return (
    <>
      <div>
        <div>
          <p>My Video</p>
          <video playsInline muted ref={"myVid"} autoPlay></video>
        </div>
        <div>
          <p>Guest Video</p>
          <video playsInline muted ref={"myVid"} autoPlay></video>
        </div>
      </div>
    </>
  );
}
