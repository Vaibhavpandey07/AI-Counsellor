import { useParams } from "react-router-dom";
import VideoPlayerPage from "../video/VideoPlayerPage";

export default function VideoRouteWrapper({ sideNav }) {
  const { videoId } = useParams();
  return <VideoPlayerPage key={videoId} sideNav={sideNav} />;
}