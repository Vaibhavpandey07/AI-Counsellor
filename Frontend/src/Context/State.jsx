import React, { useEffect, useState } from "react";
import Context from "./Context";
import api from "../api/axios";

export default function State(props) {
  const [isLogIn, setIsLogIn] = useState(() => {
    return localStorage.getItem("isLogIn") === "true";
  });

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail") || "");
  const [userProfilePhoto, setUserProfilePhoto] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [onBoarding, setOnBoarding] = useState(null); // ⬅ important
  const [channelUserName, setChannelUserName] = useState("");

  useEffect(() => {
    if (!isLogIn) return;

    let isMounted = true;

    const fetchUserDetails = async () => {
      try {
        const res = await api.get("/api/v1/users/userDetails");
        const user = res.data.data;

        if (!isMounted) return;

        setUsername(user.fullName);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setUserProfilePhoto(user.profilePhoto?.slice(1) || "");
        setUserEmail(user.email);
        setIsCreator(user.creator);
        setOnBoarding(user.onBoarding);

        localStorage.setItem("isLogIn", "true");
        localStorage.setItem("userEmail", user.email);
      } catch (err) {
        if (!isMounted) return;

        setIsLogIn(false);
        setOnBoarding(null);
        localStorage.clear();
      }
    };

    fetchUserDetails();

    return () => {
      isMounted = false;
    };
  }, [isLogIn]);

  return (
    <Context.Provider
      value={{
        isLogIn,
        setIsLogIn,
        username,
        setUsername,
        userEmail,
        setUserEmail,
        userProfilePhoto,
        setUserProfilePhoto,
        isCreator,
        setIsCreator,
        channelUserName,
        setChannelUserName,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        onBoarding,
        setOnBoarding,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}