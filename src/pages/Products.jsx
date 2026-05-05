import React from "react";
import { useSelector } from "react-redux";
const Products = () => {
  const count = useSelector((state) => state.counters.value);

  console.log(count);
  return (
    <div className="border-2 border-red-500">
      this is product page
      <h1>{count}</h1>
    </div>
  );
};

export default Products;
