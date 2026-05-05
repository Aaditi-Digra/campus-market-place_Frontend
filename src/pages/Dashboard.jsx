import React from "react";
import { useDispatch } from "react-redux";
import { increment } from "../redux/slices/counterSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  return (
    <>
      <h1>counter</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
    </>
  );
};

export default Dashboard;
